const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");
const { createNotification } = require("./notification.service");

const calculateRentalUnits = (startDate, endDate, priceUnit) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffInMs = end - start;

  if (diffInMs <= 0) {
    throw new AppError("End date must be after start date", 400);
  }

  const diffInHours = Math.ceil(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  if (priceUnit === "PER_HOUR") {
    return diffInHours;
  }

  if (priceUnit === "PER_DAY") {
    return diffInDays;
  }

  if (priceUnit === "PER_WEEK") {
    return Math.ceil(diffInDays / 7);
  }

  if (priceUnit === "PER_MONTH") {
    return Math.ceil(diffInDays / 30);
  }

  return diffInDays;
};

const createEquipmentListing = async (ownerId, equipmentData) => {
  const equipment = await prisma.equipmentListing.create({
    data: {
      ...equipmentData,
      ownerId,
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

  return equipment;
};

const getAllEquipmentListings = async (filters = {}, pagination = {}) => {
  const allowedPublicStatuses = ["AVAILABLE", "BOOKED", "MAINTENANCE"];

  const where = {};

  if (filters.status && allowedPublicStatuses.includes(filters.status)) {
    where.status = filters.status;
  } else {
    where.status = {
      not: "INACTIVE",
    };
  }

  if (filters.equipmentType) {
    where.equipmentType = {
      contains: filters.equipmentType,
      mode: "insensitive",
    };
  }

  if (filters.district) {
    where.district = {
      contains: filters.district,
      mode: "insensitive",
    };
  }

  if (filters.state) {
    where.state = {
      contains: filters.state,
      mode: "insensitive",
    };
  }

  const [total, equipment] = await prisma.$transaction([
    prisma.equipmentListing.count({
      where,
    }),

    prisma.equipmentListing.findMany({
      where,
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    }),
  ]);

  return {
    total,
    equipment,
  };
};

const getMyEquipmentListings = async (ownerId) => {
  const equipment = await prisma.equipmentListing.findMany({
    where: {
      ownerId,
      status: {
        not: "INACTIVE",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return equipment;
};

const getEquipmentListingById = async (equipmentId) => {
  const equipment = await prisma.equipmentListing.findFirst({
    where: {
      id: equipmentId,
      status: {
        not: "INACTIVE",
      },
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

  if (!equipment) {
    throw new AppError("Equipment listing not found", 404);
  }

  return equipment;
};

const updateEquipmentListing = async (equipmentId, ownerId, equipmentData) => {
  const equipment = await prisma.equipmentListing.findUnique({
    where: {
      id: equipmentId,
    },
  });

  if (!equipment || equipment.status === "INACTIVE") {
    throw new AppError("Equipment listing not found", 404);
  }

  if (equipment.ownerId !== ownerId) {
    throw new AppError("You can update only your own equipment listing", 403);
  }

  const updatedEquipment = await prisma.equipmentListing.update({
    where: {
      id: equipmentId,
    },
    data: equipmentData,
  });

  return updatedEquipment;
};

const deactivateEquipmentListing = async (equipmentId, ownerId) => {
  const equipment = await prisma.equipmentListing.findUnique({
    where: {
      id: equipmentId,
    },
  });

  if (!equipment || equipment.status === "INACTIVE") {
    throw new AppError("Equipment listing not found", 404);
  }

  if (equipment.ownerId !== ownerId) {
    throw new AppError("You can delete only your own equipment listing", 403);
  }

  const deletedEquipment = await prisma.equipmentListing.update({
    where: {
      id: equipmentId,
    },
    data: {
      status: "INACTIVE",
    },
  });

  return deletedEquipment;
};

const createEquipmentRental = async (requesterId, rentalData) => {
  const equipment = await prisma.equipmentListing.findFirst({
    where: {
      id: rentalData.equipmentId,
      status: {
        not: "INACTIVE",
      },
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

  if (!equipment) {
    throw new AppError("Equipment listing not found", 404);
  }

  if (equipment.ownerId === requesterId) {
    throw new AppError("You cannot rent your own equipment", 400);
  }

  if (equipment.status !== "AVAILABLE") {
    throw new AppError("Equipment is not available for rent", 400);
  }

  const startDate = new Date(rentalData.startDate);
  const endDate = new Date(rentalData.endDate);

  if (endDate <= startDate) {
    throw new AppError("End date must be after start date", 400);
  }

  const overlappingRental = await prisma.equipmentRental.findFirst({
    where: {
      equipmentId: rentalData.equipmentId,
      status: {
        in: ["PENDING", "APPROVED"],
      },
      startDate: {
        lte: endDate,
      },
      endDate: {
        gte: startDate,
      },
    },
  });

  if (overlappingRental) {
    throw new AppError("Overlapping rental request already exists", 409);
  }

  const rentalUnits = calculateRentalUnits(
    rentalData.startDate,
    rentalData.endDate,
    equipment.priceUnit,
  );

  const totalAmount = Number(equipment.rentPrice) * rentalUnits;

  const rental = await prisma.equipmentRental.create({
    data: {
      equipmentId: rentalData.equipmentId,
      requesterId,
      startDate,
      endDate,
      message: rentalData.message,
      totalAmount,
    },
    include: {
      requester: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
      equipment: {
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
      },
    },
  });

  await createNotification({
    userId: equipment.ownerId,
    type: "EQUIPMENT_RENTAL_REQUEST_CREATED",
    title: "New equipment rental request",
    message: `${rental.requester.firstName} ${rental.requester.lastName} sent a rental request for your equipment "${equipment.title}".`,
  });

  return rental;
};

const getMyEquipmentRentals = async (requesterId) => {
  const rentals = await prisma.equipmentRental.findMany({
    where: {
      requesterId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      equipment: {
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
      },
    },
  });

  return rentals;
};

const getReceivedEquipmentRentals = async (ownerId) => {
  const rentals = await prisma.equipmentRental.findMany({
    where: {
      equipment: {
        ownerId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      requester: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
      equipment: true,
    },
  });

  return rentals;
};

const updateEquipmentRentalStatus = async (rentalId, ownerId, status) => {
  const allowedStatuses = ["APPROVED", "REJECTED"];

  if (!allowedStatuses.includes(status)) {
    throw new AppError("Invalid rental status", 400);
  }

  const rental = await prisma.equipmentRental.findUnique({
    where: {
      id: rentalId,
    },
    include: {
      requester: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
      equipment: {
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
      },
    },
  });

  if (!rental) {
    throw new AppError("Equipment rental request not found", 404);
  }

  if (rental.equipment.ownerId !== ownerId) {
    throw new AppError(
      "Only equipment owner can approve or reject rental requests",
      403,
    );
  }

  if (rental.status !== "PENDING") {
    throw new AppError("Rental request already processed", 400);
  }

  if (status === "APPROVED" && rental.equipment.status !== "AVAILABLE") {
    throw new AppError("Equipment is not available for rent", 400);
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedRental = await tx.equipmentRental.update({
      where: {
        id: rentalId,
      },
      data: {
        status,
      },
      include: {
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        equipment: {
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
        },
      },
    });

    if (status === "APPROVED") {
      await tx.equipmentListing.update({
        where: {
          id: rental.equipmentId,
        },
        data: {
          status: "BOOKED",
        },
      });

      await tx.equipmentRental.updateMany({
        where: {
          equipmentId: rental.equipmentId,
          id: {
            not: rentalId,
          },
          status: "PENDING",
        },
        data: {
          status: "REJECTED",
        },
      });
    }

    return updatedRental;
  });

  await createNotification({
    userId: rental.requesterId,
    type:
      status === "APPROVED"
        ? "EQUIPMENT_RENTAL_APPROVED"
        : "EQUIPMENT_RENTAL_REJECTED",
    title:
      status === "APPROVED"
        ? "Equipment rental approved"
        : "Equipment rental rejected",
    message: `Your rental request for equipment "${rental.equipment.title}" has been ${status.toLowerCase()}.`,
  });

  return result;
};

module.exports = {
  createEquipmentListing,
  getAllEquipmentListings,
  getMyEquipmentListings,
  getEquipmentListingById,
  updateEquipmentListing,
  deactivateEquipmentListing,
  createEquipmentRental,
  getMyEquipmentRentals,
  getReceivedEquipmentRentals,
  updateEquipmentRentalStatus,
};
