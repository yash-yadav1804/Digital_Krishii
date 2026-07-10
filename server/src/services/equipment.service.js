const prisma = require("../config/prisma");
const { createNotification } = require("./notification.service");

const calculateRentalUnits = (startDate, endDate, priceUnit) => {
  const diffInMs = new Date(endDate) - new Date(startDate);

  const hours = Math.ceil(diffInMs / (1000 * 60 * 60));
  const days = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  if (priceUnit === "PER_HOUR") return hours;
  if (priceUnit === "PER_DAY") return days;
  if (priceUnit === "PER_WEEK") return Math.ceil(days / 7);
  if (priceUnit === "PER_MONTH") return Math.ceil(days / 30);

  return days;
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

const getAllEquipmentListings = async (filters = {}) => {
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

  const equipment = await prisma.equipmentListing.findMany({
    where,
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
  });

  return equipment;
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
      rentals: {
        select: {
          id: true,
          startDate: true,
          endDate: true,
          status: true,
          totalAmount: true,
        },
      },
    },
  });

  if (!equipment) {
    throw new Error("Equipment listing not found");
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
    throw new Error("Equipment listing not found");
  }

  if (equipment.ownerId !== ownerId) {
    throw new Error("You can update only your own equipment listing");
  }

  const updatedEquipment = await prisma.equipmentListing.update({
    where: {
      id: equipmentId,
    },
    data: equipmentData,
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
  return updatedEquipment;
};

const deactivateEquipmentListing = async (equipmentId, ownerId) => {
  const equipment = await prisma.equipmentListing.findUnique({
    where: {
      id: equipmentId,
    },
  });

  if (!equipment || equipment.status === "INACTIVE") {
    throw new Error("Equipment listing not found");
  }

  if (equipment.ownerId !== ownerId) {
    throw new Error("You can delete only your own equipment listing");
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

const createEquipmentRentalRequest = async (requesterId, rentalData) => {
  const equipment = await prisma.equipmentListing.findUnique({
    where: {
      id: rentalData.equipmentId,
    },
  });

  if (!equipment || equipment.status === "INACTIVE") {
    throw new Error("Equipment listing not found");
  }

  if (equipment.ownerId === requesterId) {
    throw new Error("You cannot rent your own equipment");
  }

  if (equipment.status !== "AVAILABLE") {
    throw new Error("Equipment is not available for rent");
  }

  const overlappingRental = await prisma.equipmentRental.findFirst({
    where: {
      equipmentId: rentalData.equipmentId,
      status: {
        in: ["PENDING", "APPROVED"],
      },
      startDate: {
        lte: rentalData.endDate,
      },
      endDate: {
        gte: rentalData.startDate,
      },
    },
  });

  if (overlappingRental) {
    throw new Error("Equipment already has a rental request for these dates");
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
      startDate: rentalData.startDate,
      endDate: rentalData.endDate,
      message: rentalData.message,
      totalAmount,
    },
    include: {
      equipment: {
        select: {
          id: true,
          title: true,
          equipmentType: true,
          rentPrice: true,
          priceUnit: true,
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
        },
      },
      requester: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
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

const getMyEquipmentRentalRequests = async (requesterId) => {
  const rentals = await prisma.equipmentRental.findMany({
    where: {
      requesterId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      equipment: {
        select: {
          id: true,
          title: true,
          equipmentType: true,
          rentPrice: true,
          priceUnit: true,
          status: true,
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
        },
      },
    },
  });

  return rentals;
};

const getRentalRequestsForMyEquipment = async (ownerId) => {
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
      equipment: {
        select: {
          id: true,
          title: true,
          equipmentType: true,
          rentPrice: true,
          priceUnit: true,
        },
      },
      requester: {
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

  return rentals;
};

const updateEquipmentRentalStatus = async (rentalId, ownerId, status) => {
  const rental = await prisma.equipmentRental.findUnique({
    where: {
      id: rentalId,
    },
    include: {
      equipment: true,
    },
  });

  if (!rental) {
    throw new Error("Rental request not found");
  }

  if (rental.equipment.ownerId !== ownerId) {
    throw new Error("You can update only requests for your own equipment");
  }

  if (rental.status !== "PENDING") {
    throw new Error("Only pending rental requests can be updated");
  }

  if (status === "APPROVED" && rental.equipment.status !== "AVAILABLE") {
    throw new Error("Equipment is not available for approval");
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedRental = await tx.equipmentRental.update({
      where: {
        id: rentalId,
      },
      data: {
        status,
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
  createEquipmentRentalRequest,
  getMyEquipmentRentalRequests,
  getRentalRequestsForMyEquipment,
  updateEquipmentRentalStatus,
};
