const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");
const { createNotification } = require("./notification.service");

const getActiveContractTemplates = async () => {
  const templates = await prisma.contractTemplate.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return templates;
};

const getContractTemplateById = async (templateId) => {
  const template = await prisma.contractTemplate.findUnique({
    where: {
      id: templateId,
    },
  });

  if (!template || !template.isActive) {
    throw new AppError("Contract template not found", 404);
  }

  return template;
};

const createContractRequest = async (buyerId, requestData) => {
  const template = await prisma.contractTemplate.findUnique({
    where: {
      id: requestData.templateId,
    },
  });

  if (!template || !template.isActive) {
    throw new AppError("Contract template not found", 404);
  }

  const land = await prisma.landListing.findUnique({
    where: {
      id: requestData.landId,
    },
    include: {
      owner: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  if (!land || land.status === "INACTIVE") {
    throw new AppError("Land listing not found", 404);
  }

  if (land.listingType !== "CONTRACT_FARMING") {
    throw new AppError(
      "Contract request can be created only for contract farming land",
      400,
    );
  }

  if (land.ownerId === buyerId) {
    throw new AppError(
      "You cannot create a contract request for your own land",
      400,
    );
  }

  if (land.status !== "AVAILABLE") {
    throw new AppError("Land is not available for contract request", 400);
  }

  const existingPendingRequest = await prisma.contractRequest.findFirst({
    where: {
      landId: requestData.landId,
      buyerId,
      status: "PENDING",
    },
  });

  if (existingPendingRequest) {
    throw new AppError("You already have a pending request for this land", 409);
  }

  const contractRequest = await prisma.contractRequest.create({
    data: {
      templateId: requestData.templateId,
      landId: requestData.landId,
      buyerId,
      farmerId: land.ownerId,
      cropName: requestData.cropName,
      quantity: requestData.quantity,
      proposedPrice: requestData.proposedPrice,
      startDate: requestData.startDate,
      endDate: requestData.endDate,
      message: requestData.message,
    },
    include: {
      template: true,
      land: {
        select: {
          id: true,
          title: true,
          area: true,
          areaUnit: true,
          price: true,
          priceUnit: true,
          listingType: true,
          status: true,
          district: true,
          state: true,
        },
      },
      buyer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
      farmer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  await createNotification({
    userId: land.ownerId,
    type: "CONTRACT_REQUEST_CREATED",
    title: "New contract request",
    message: `${contractRequest.buyer.firstName} ${contractRequest.buyer.lastName} sent a contract request for your land "${land.title}".`,
  });

  return contractRequest;
};

const getMySentContractRequests = async (buyerId) => {
  const requests = await prisma.contractRequest.findMany({
    where: {
      buyerId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      template: true,
      land: {
        select: {
          id: true,
          title: true,
          area: true,
          areaUnit: true,
          price: true,
          priceUnit: true,
          status: true,
          district: true,
          state: true,
        },
      },
      farmer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  return requests;
};

const getMyReceivedContractRequests = async (farmerId) => {
  const requests = await prisma.contractRequest.findMany({
    where: {
      farmerId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      template: true,
      land: {
        select: {
          id: true,
          title: true,
          area: true,
          areaUnit: true,
          price: true,
          priceUnit: true,
          status: true,
          district: true,
          state: true,
        },
      },
      buyer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  return requests;
};

const getContractRequestById = async (requestId, userId) => {
  const request = await prisma.contractRequest.findUnique({
    where: {
      id: requestId,
    },
    include: {
      template: true,
      land: true,
      buyer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
      farmer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  if (!request) {
    throw new AppError("Contract request not found", 404);
  }

  const isBuyer = request.buyerId === userId;
  const isFarmer = request.farmerId === userId;

  if (!isBuyer && !isFarmer) {
    throw new AppError("You can view only your own contract requests", 403);
  }

  return request;
};

const updateContractRequestStatus = async (requestId, farmerId, status) => {
  const allowedStatuses = ["ACCEPTED", "REJECTED"];

  if (!allowedStatuses.includes(status)) {
    throw new AppError("Invalid contract request status", 400);
  }

  const request = await prisma.contractRequest.findUnique({
    where: {
      id: requestId,
    },
    include: {
      land: true,
    },
  });

  if (!request) {
    throw new AppError("Contract request not found", 404);
  }

  if (request.farmerId !== farmerId) {
    throw new AppError(
      "You can update only requests received for your land",
      403,
    );
  }

  if (request.status !== "PENDING") {
    throw new AppError("Only pending contract requests can be updated", 400);
  }

  if (status === "ACCEPTED" && request.land.status !== "AVAILABLE") {
    throw new AppError("Land is not available for accepting this request", 400);
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.contractRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status,
      },
    });

    if (status === "ACCEPTED") {
      await tx.landListing.update({
        where: {
          id: request.landId,
        },
        data: {
          status: "UNDER_CONTRACT",
        },
      });

      await tx.contractRequest.updateMany({
        where: {
          landId: request.landId,
          id: {
            not: requestId,
          },
          status: "PENDING",
        },
        data: {
          status: "REJECTED",
        },
      });
    }

    const finalRequest = await tx.contractRequest.findUnique({
      where: {
        id: requestId,
      },
      include: {
        template: true,
        land: true,
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        farmer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return finalRequest;
  });

  await createNotification({
    userId: request.buyerId,
    type:
      status === "ACCEPTED"
        ? "CONTRACT_REQUEST_ACCEPTED"
        : "CONTRACT_REQUEST_REJECTED",
    title:
      status === "ACCEPTED"
        ? "Contract request accepted"
        : "Contract request rejected",
    message: `Your contract request for land "${result.land.title}" has been ${status.toLowerCase()}.`,
  });

  return result;
};

const cancelContractRequest = async (requestId, buyerId) => {
  const request = await prisma.contractRequest.findUnique({
    where: {
      id: requestId,
    },
  });

  if (!request) {
    throw new AppError("Contract request not found", 404);
  }

  if (request.buyerId !== buyerId) {
    throw new AppError("You can cancel only your own contract request", 403);
  }

  if (request.status !== "PENDING") {
    throw new AppError("Only pending contract requests can be cancelled", 400);
  }

  const cancelledRequest = await prisma.contractRequest.update({
    where: {
      id: requestId,
    },
    data: {
      status: "CANCELLED",
    },
    include: {
      template: true,
      land: true,
      farmer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  return cancelledRequest;
};

module.exports = {
  getActiveContractTemplates,
  getContractTemplateById,
  createContractRequest,
  getMySentContractRequests,
  getMyReceivedContractRequests,
  getContractRequestById,
  updateContractRequestStatus,
  cancelContractRequest,
};
