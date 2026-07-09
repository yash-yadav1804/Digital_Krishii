const {
  getMyProfile,
  updateMyProfile,
} = require("../services/profile.service");

const getProfile = async (req, res) => {
  try {
    const profile = await getMyProfile(req.user.id);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updatedProfile = await updateMyProfile(req.user.id, req.body);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
