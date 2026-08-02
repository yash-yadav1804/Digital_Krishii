const asyncHandler = require("../utils/asyncHandler");
const { getPagination, getPaginationMeta } = require("../utils/pagination");

const {
  createLandListing,
  getAllLandListings,
  getMyLandListings,
  getLandListingById,
  updateLandListing,
  deactivateLandListing,
} = require("../services/land.service");

const createLand = asyncHandler(async (req, res) => {
  const land = await createLandListing(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: "Land listing created successfully",
    data: land,
  });
});

const getLands = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.query);

  const { lands, total } = await getAllLandListings(req.query, pagination);

  res.status(200).json({
    success: true,
    ...getPaginationMeta({
      page: pagination.page,
      limit: pagination.limit,
      total,
    }),
    data: lands,
  });
});

const getMyLands = asyncHandler(async (req, res) => {
  const lands = await getMyLandListings(req.user.id);

  res.status(200).json({
    success: true,
    count: lands.length,
    data: lands,
  });
});

const getLandById = asyncHandler(async (req, res) => {
  const land = await getLandListingById(req.params.id);

  res.status(200).json({
    success: true,
    data: land,
  });
});

const updateLand = asyncHandler(async (req, res) => {
  const land = await updateLandListing(req.params.id, req.user.id, req.body);

  res.status(200).json({
    success: true,
    message: "Land listing updated successfully",
    data: land,
  });
});

const deleteLand = asyncHandler(async (req, res) => {
  await deactivateLandListing(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    message: "Land listing deleted successfully",
  });
});

module.exports = {
  createLand,
  getLands,
  getMyLands,
  getLandById,
  updateLand,
  deleteLand,
};
