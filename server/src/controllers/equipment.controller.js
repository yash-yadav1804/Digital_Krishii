const asyncHandler = require("../utils/asyncHandler");
const { getPagination, getPaginationMeta } = require("../utils/pagination");

const {
  createEquipmentListing,
  getAllEquipmentListings,
  getMyEquipmentListings,
  getEquipmentListingById,
  updateEquipmentListing,
  deactivateEquipmentListing,
  createEquipmentRental,
  getMyEquipmentRentals,
  getReceivedEquipmentRentals,
  updateEquipmentRentalStatus,
} = require("../services/equipment.service");

const createEquipment = asyncHandler(async (req, res) => {
  const equipment = await createEquipmentListing(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: "Equipment listing created successfully",
    data: equipment,
  });
});

const getEquipment = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.query);

  const { equipment, total } = await getAllEquipmentListings(
    req.query,
    pagination,
  );

  res.status(200).json({
    success: true,
    ...getPaginationMeta({
      page: pagination.page,
      limit: pagination.limit,
      total,
    }),
    data: equipment,
  });
});

const getMyEquipment = asyncHandler(async (req, res) => {
  const equipment = await getMyEquipmentListings(req.user.id);

  res.status(200).json({
    success: true,
    count: equipment.length,
    data: equipment,
  });
});

const getEquipmentById = asyncHandler(async (req, res) => {
  const equipment = await getEquipmentListingById(req.params.id);

  res.status(200).json({
    success: true,
    data: equipment,
  });
});

const updateEquipment = asyncHandler(async (req, res) => {
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
});

const deleteEquipment = asyncHandler(async (req, res) => {
  await deactivateEquipmentListing(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    message: "Equipment listing deleted successfully",
  });
});

const createRentalRequest = asyncHandler(async (req, res) => {
  const rental = await createEquipmentRental(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: "Equipment rental request created successfully",
    data: rental,
  });
});

const getMyRentalRequests = asyncHandler(async (req, res) => {
  const rentals = await getMyEquipmentRentals(req.user.id);

  res.status(200).json({
    success: true,
    count: rentals.length,
    data: rentals,
  });
});

const getReceivedRentalRequests = asyncHandler(async (req, res) => {
  const rentals = await getReceivedEquipmentRentals(req.user.id);

  res.status(200).json({
    success: true,
    count: rentals.length,
    data: rentals,
  });
});

const updateRentalStatus = asyncHandler(async (req, res) => {
  const rental = await updateEquipmentRentalStatus(
    req.params.id,
    req.user.id,
    req.body.status,
  );

  res.status(200).json({
    success: true,
    message: "Equipment rental status updated successfully",
    data: rental,
  });
});

module.exports = {
  createEquipment,
  getEquipment,
  getMyEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
  createRentalRequest,
  getMyRentalRequests,
  getReceivedRentalRequests,
  updateRentalStatus,
};
