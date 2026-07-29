const { getPagination, getPaginationMeta } = require("../utils/pagination");
const asyncHandler = require("../utils/asyncHandler");

const {
  getAdminDashboardStats,
  getAllUsersForAdmin,
  getUserDetailsForAdmin,
  blockUserByAdmin,
  unblockUserByAdmin,
} = require("../services/admin.service");

const getStats = asyncHandler(async (req, res) => {
  const stats = await getAdminDashboardStats();

  res.status(200).json({
    success: true,
    data: stats,
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.query);

  const { users, total } = await getAllUsersForAdmin(req.query, pagination);

  res.status(200).json({
    success: true,
    ...getPaginationMeta({
      page: pagination.page,
      limit: pagination.limit,
      total,
    }),
    data: users,
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await getUserDetailsForAdmin(req.params.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

const blockUser = asyncHandler(async (req, res) => {
  const user = await blockUserByAdmin(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    message: "User blocked successfully",
    data: user,
  });
});

const unblockUser = asyncHandler(async (req, res) => {
  const user = await unblockUserByAdmin(req.params.id);

  res.status(200).json({
    success: true,
    message: "User unblocked successfully",
    data: user,
  });
});

module.exports = {
  getStats,
  getUsers,
  getUserById,
  blockUser,
  unblockUser,
};
