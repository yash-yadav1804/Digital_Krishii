const {
  createEquipmentListing,
  getAllEquipmentListings,
  getMyEquipmentListings,
  getEquipmentListingById,
  updateEquipmentListing,
  deactivateEquipmentListing,
  createEquipmentRentalRequest,
  getMyEquipmentRentalRequests,
  getRentalRequestsForMyEquipment,
  updateEquipmentRentalStatus,
} = require("../services/equipment.service");

const getErrorStatusCode = (message) => {
  if (message.includes("not found")) return 404;
  if (message.includes("own")) return 403;
  return 400;
};

const createEquipment = async (req, res) => {
  try {
    const equipment = await createEquipmentListing(req.user.id, req.body);

    res.status(201).json({
      success: true,
      message: "Equipment listing created successfully",
      data: equipment,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

const getEquipment = async (req, res) => {
  try {
    const equipment = await getAllEquipmentListings(req.query);

    res.status(200).json({
      success: true,
      count: equipment.length,
      data: equipment,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyEquipment = async (req, res) => {
  try {
    const equipment = await getMyEquipmentListings(req.user.id);

    res.status(200).json({
      success: true,
      count: equipment.length,
      data: equipment,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

const getEquipmentById = async (req, res) => {
  try {
    const equipment = await getEquipmentListingById(req.params.id);

    res.status(200).json({
      success: true,
      data: equipment,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

const updateEquipment = async (req, res) => {
  try {
    const equipment = await updateEquipmentListing(
      req.params.id,
      req.user.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Equipment listing updated successfully",
      data: equipment,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteEquipment = async (req, res) => {
  try {
    const equipment = await deactivateEquipmentListing(
      req.params.id,
      req.user.id,
    );

    res.status(200).json({
      success: true,
      message: "Equipment listing deleted successfully",
      data: equipment,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

const createRentalRequest = async (req, res) => {
  try {
    const rental = await createEquipmentRentalRequest(req.user.id, req.body);

    res.status(201).json({
      success: true,
      message: "Equipment rental request created successfully",
      data: rental,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyRentalRequests = async (req, res) => {
  try {
    const rentals = await getMyEquipmentRentalRequests(req.user.id);

    res.status(200).json({
      success: true,
      count: rentals.length,
      data: rentals,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

const getRentalRequestsForOwner = async (req, res) => {
  try {
    const rentals = await getRentalRequestsForMyEquipment(req.user.id);

    res.status(200).json({
      success: true,
      count: rentals.length,
      data: rentals,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

const updateRentalStatus = async (req, res) => {
  try {
    const rental = await updateEquipmentRentalStatus(
      req.params.id,
      req.user.id,
      req.body.status,
    );

    res.status(200).json({
      success: true,
      message: "Equipment rental request updated successfully",
      data: rental,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createEquipment,
  getEquipment,
  getMyEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
  createRentalRequest,
  getMyRentalRequests,
  getRentalRequestsForOwner,
  updateRentalStatus,
};
