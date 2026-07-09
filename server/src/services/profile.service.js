const prisma = require("../config/prisma");

const getMyProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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
      roles: {
        select: {
          role: {
            select: {
              name: true,
            },
          },
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    ...user,
    roles: user.roles.map((userRole) => userRole.role.name),
  };
};

const updateMyProfile = async (userId, profileData) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: profileData,
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
      updatedAt: true,
    },
  });

  return updatedUser;
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};
