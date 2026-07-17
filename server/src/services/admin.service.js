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
    throw new Error("User not found");
  }

  return user;
};

const blockUserByAdmin = async (userId, adminId) => {
  if (userId === adminId) {
    throw new Error("Admin cannot block their own account");
  }

  const user = await getUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.roles.includes("ADMIN")) {
    throw new Error("Admin users cannot be blocked");
  }

  if (user.status === "BLOCKED") {
    throw new Error("User is already blocked");
  }

  const blockedUser = await updateUserStatus(userId, "BLOCKED");

  return blockedUser;
};

const unblockUserByAdmin = async (userId) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.status === "ACTIVE") {
    throw new Error("User is already active");
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
