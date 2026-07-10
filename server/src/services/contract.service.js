const prisma = require("../config/prisma");

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
    throw new Error("Contract template not found");
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
    throw new Error("Contract template not found");
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
    throw new Error("Land listing not found");
  }

  if (land.listingType !== "CONTRACT_FARMING") {
    throw new Error(
      "Contract request can be created only for contract farming land",
    );
  }

  if (land.ownerId === buyerId) {
    throw new Error("You cannot create a contract request for your own land");
  }

  if (land.status !== "AVAILABLE") {
    throw new Error("Land is not available for contract request");
  }

  const existingPendingRequest = await prisma.contractRequest.findFirst({
    where: {
      landId: requestData.landId,
      buyerId,
      status: "PENDING",
    },
  });

  if (existingPendingRequest) {
    throw new Error("You already have a pending request for this land");
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
    throw new Error("Contract request not found");
  }

  const isBuyer = request.buyerId === userId;
  const isFarmer = request.farmerId === userId;

  if (!isBuyer && !isFarmer) {
    throw new Error("You can view only your own contract requests");
  }

  return request;
};

const updateContractRequestStatus = async (requestId, farmerId, status) => {
  const request = await prisma.contractRequest.findUnique({
    where: {
      id: requestId,
    },
    include: {
      land: true,
    },
  });

  if (!request) {
    throw new Error("Contract request not found");
  }

  if (request.farmerId !== farmerId) {
    throw new Error("You can update only requests received for your land");
  }

  if (request.status !== "PENDING") {
    throw new Error("Only pending contract requests can be updated");
  }

  if (status === "ACCEPTED" && request.land.status !== "AVAILABLE") {
    throw new Error("Land is not available for accepting this request");
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

  return result;
};

const cancelContractRequest = async (requestId, buyerId) => {
  const request = await prisma.contractRequest.findUnique({
    where: {
      id: requestId,
    },
  });

  if (!request) {
    throw new Error("Contract request not found");
  }

  if (request.buyerId !== buyerId) {
    throw new Error("You can cancel only your own contract request");
  }

  if (request.status !== "PENDING") {
    throw new Error("Only pending contract requests can be cancelled");
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
