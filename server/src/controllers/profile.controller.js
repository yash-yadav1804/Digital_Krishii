const asyncHandler = require("../utils/asyncHandler");
const {
  getUserProfile,
  updateUserProfile,
} = require("../services/profile.service");

const getProfile = asyncHandler(async (req, res) => {
  const profile = await getUserProfile(req.user.id);

  res.status(200).json({
    success: true,
    data: profile,
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const profile = await updateUserProfile(req.user.id, req.body);

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: profile,
  });
});

module.exports = {
  getProfile,
  updateProfile,
};
