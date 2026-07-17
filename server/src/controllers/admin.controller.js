const {
  getAdminDashboardStats,
  getAllUsersForAdmin,
  getUserDetailsForAdmin,
  blockUserByAdmin,
  unblockUserByAdmin,
} = require("../services/admin.service");

const getErrorStatusCode = (message) => {
  if (message.includes("not found")) return 404;
  if (message.includes("cannot")) return 403;
  if (message.includes("already")) return 409;
  return 400;
};

const getStats = async (req, res) => {
  try {
    const stats = await getAdminDashboardStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await getAllUsersForAdmin(req.query);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await getUserDetailsForAdmin(req.params.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

const blockUser = async (req, res) => {
  try {
    const user = await blockUserByAdmin(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: "User blocked successfully",
      data: user,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

const unblockUser = async (req, res) => {
  try {
    const user = await unblockUserByAdmin(req.params.id);

    res.status(200).json({
      success: true,
      message: "User unblocked successfully",
      data: user,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getStats,
  getUsers,
  getUserById,
  blockUser,
  unblockUser,
};
