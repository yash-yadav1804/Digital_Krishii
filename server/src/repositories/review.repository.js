const prisma = require("../config/prisma");

const userSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
};

const findContractRequestById = async (contractRequestId) => {
  return prisma.contractRequest.findUnique({
    where: {
      id: contractRequestId,
    },
    include: {
      buyer: {
        select: userSelect,
      },
      farmer: {
        select: userSelect,
      },
      template: {
        select: {
          id: true,
          type: true,
          title: true,
        },
      },
      land: {
        select: {
          id: true,
          title: true,
          status: true,
        },
      },
    },
  });
};

const findEquipmentRentalById = async (equipmentRentalId) => {
  return prisma.equipmentRental.findUnique({
    where: {
      id: equipmentRentalId,
    },
    include: {
      requester: {
        select: userSelect,
      },
      equipment: {
        select: {
          id: true,
          title: true,
          equipmentType: true,
          status: true,
          ownerId: true,
          owner: {
            select: userSelect,
          },
        },
      },
    },
  });
};

const findExistingContractReview = async (reviewerId, contractRequestId) => {
  return prisma.review.findFirst({
    where: {
      reviewerId,
      contractRequestId,
    },
  });
};

const findExistingEquipmentReview = async (reviewerId, equipmentRentalId) => {
  return prisma.review.findFirst({
    where: {
      reviewerId,
      equipmentRentalId,
    },
  });
};

const createReview = async (reviewData) => {
  return prisma.review.create({
    data: reviewData,
    include: {
      reviewer: {
        select: userSelect,
      },
      reviewee: {
        select: userSelect,
      },
      contractRequest: {
        select: {
          id: true,
          status: true,
          cropName: true,
        },
      },
      equipmentRental: {
        select: {
          id: true,
          status: true,
          startDate: true,
          endDate: true,
        },
      },
    },
  });
};

const getReviewsReceivedByUser = async (userId) => {
  return prisma.review.findMany({
    where: {
      revieweeId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      reviewer: {
        select: userSelect,
      },
      contractRequest: {
        select: {
          id: true,
          status: true,
          cropName: true,
        },
      },
      equipmentRental: {
        select: {
          id: true,
          status: true,
          startDate: true,
          endDate: true,
        },
      },
    },
  });
};

const getReviewsGivenByUser = async (userId) => {
  return prisma.review.findMany({
    where: {
      reviewerId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      reviewee: {
        select: userSelect,
      },
      contractRequest: {
        select: {
          id: true,
          status: true,
          cropName: true,
        },
      },
      equipmentRental: {
        select: {
          id: true,
          status: true,
          startDate: true,
          endDate: true,
        },
      },
    },
  });
};

const getUserReviewStats = async (userId) => {
  const stats = await prisma.review.aggregate({
    where: {
      revieweeId: userId,
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  return {
    averageRating: stats._avg.rating || 0,
    totalReviews: stats._count.rating || 0,
  };
};

module.exports = {
  findContractRequestById,
  findEquipmentRentalById,
  findExistingContractReview,
  findExistingEquipmentReview,
  createReview,
  getReviewsReceivedByUser,
  getReviewsGivenByUser,
  getUserReviewStats,
};
