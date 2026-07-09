const {
  createLandListing,
  getAllLandListings,
  getMyLandListings,
  getLandListingById,
  updateLandListing,
  deactivateLandListing,
} = require("../services/land.service");

const getErrorStatusCode = (message) => {
  if (message.includes("not found")) return 404;
  if (message.includes("own")) return 403;
  return 400;
};

const createLand = async (req, res) => {
  try {
    const land = await createLandListing(req.user.id, req.body);

    res.status(201).json({
      success: true,
      message: "Land listing created successfully",
      data: land,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getLands = async (req, res) => {
  try {
    const lands = await getAllLandListings(req.query);

    res.status(200).json({
      success: true,
      count: lands.length,
      data: lands,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyLands = async (req, res) => {
  try {
    const lands = await getMyLandListings(req.user.id);

    res.status(200).json({
      success: true,
      count: lands.length,
      data: lands,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getLandById = async (req, res) => {
  try {
    const land = await getLandListingById(req.params.id);

    res.status(200).json({
      success: true,
      data: land,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

const updateLand = async (req, res) => {
  try {
    const land = await updateLandListing(req.params.id, req.user.id, req.body);

    res.status(200).json({
      success: true,
      message: "Land listing updated successfully",
      data: land,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteLand = async (req, res) => {
  try {
    const land = await deactivateLandListing(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: "Land listing deleted successfully",
      data: land,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createLand,
  getLands,
  getMyLands,
  getLandById,
  updateLand,
  deleteLand,
};
