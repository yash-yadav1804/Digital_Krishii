const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");

const userSelect = {
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
};

const formatUserProfile = (user) => {
  return {
    ...user,
    roles: user.roles.map((userRole) => userRole.role.name),
  };
};

const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: userSelect,
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return formatUserProfile(user);
};

const updateUserProfile = async (userId, profileData) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser) {
    throw new AppError("User not found", 404);
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: profileData,
    select: userSelect,
  });

  return formatUserProfile(updatedUser);
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
