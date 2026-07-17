const AppError = require("../utils/AppError");

const {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUserStatus,
} = require("../repositories/admin.repository");

const getAdminDashboardStats = async () => {
  const stats = await getDashboardStats();

  return stats;
};

const getAllUsersForAdmin = async (filters) => {
  const allowedStatuses = ["ACTIVE", "BLOCKED"];
  const allowedRoles = ["FARMER", "BUYER", "ADMIN"];

  const cleanedFilters = {};

  if (filters.status && allowedStatuses.includes(filters.status)) {
    cleanedFilters.status = filters.status;
  }

  if (filters.role && allowedRoles.includes(filters.role)) {
    cleanedFilters.role = filters.role;
  }

  if (filters.search) {
    cleanedFilters.search = filters.search;
  }

  const users = await getUsers(cleanedFilters);

  return users;
};

const getUserDetailsForAdmin = async (userId) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

const blockUserByAdmin = async (userId, adminId) => {
  if (userId === adminId) {
    throw new AppError("Admin cannot block their own account", 403);
  }

  const user = await getUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.roles.includes("ADMIN")) {
    throw new AppError("Admin users cannot be blocked", 403);
  }

  if (user.status === "BLOCKED") {
    throw new AppError("User is already blocked", 409);
  }

  const blockedUser = await updateUserStatus(userId, "BLOCKED");

  return blockedUser;
};

const unblockUserByAdmin = async (userId) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.status === "ACTIVE") {
    throw new AppError("User is already active", 409);
  }

  const unblockedUser = await updateUserStatus(userId, "ACTIVE");

  return unblockedUser;
};

module.exports = {
  getAdminDashboardStats,
  getAllUsersForAdmin,
  getUserDetailsForAdmin,
  blockUserByAdmin,
  unblockUserByAdmin,
};
