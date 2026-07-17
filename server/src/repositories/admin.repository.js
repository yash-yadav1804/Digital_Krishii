const prisma = require("../config/prisma");

const getDashboardStats = async () => {
  const [
    totalUsers,
    totalFarmers,
    totalBuyers,
    totalLands,
    totalEquipment,
    totalContractRequests,
    totalEquipmentRentals,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.user.count({
      where: {
        roles: {
          some: {
            role: {
              name: "FARMER",
            },
          },
        },
      },
    }),

    prisma.user.count({
      where: {
        roles: {
          some: {
            role: {
              name: "BUYER",
            },
          },
        },
      },
    }),

    prisma.landListing.count(),

    prisma.equipmentListing.count(),

    prisma.contractRequest.count(),

    prisma.equipmentRental.count(),
  ]);

  return {
    totalUsers,
    totalFarmers,
    totalBuyers,
    totalLands,
    totalEquipment,
    totalContractRequests,
    totalEquipmentRentals,
  };
};

const getUsers = async (filters = {}) => {
  const where = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.role) {
    where.roles = {
      some: {
        role: {
          name: filters.role,
        },
      },
    };
  }

  if (filters.search) {
    where.OR = [
      {
        firstName: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
      {
        lastName: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      status: true,
      createdAt: true,
      roles: {
        select: {
          role: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return users.map((user) => ({
    ...user,
    roles: user.roles.map((userRole) => userRole.role.name),
  }));
};

const getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      address: true,
      pincode: true,
      profileImage: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      roles: {
        select: {
          role: {
            select: {
              name: true,
            },
          },
        },
      },
      landListings: {
        select: {
          id: true,
          title: true,
          status: true,
          listingType: true,
          createdAt: true,
        },
      },
      equipmentListings: {
        select: {
          id: true,
          title: true,
          status: true,
          equipmentType: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  return {
    ...user,
    roles: user.roles.map((userRole) => userRole.role.name),
  };
};

const updateUserStatus = async (userId, status) => {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      status: true,
      roles: {
        select: {
          role: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return {
    ...user,
    roles: user.roles.map((userRole) => userRole.role.name),
  };
};

module.exports = {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUserStatus,
};
