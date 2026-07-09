const prisma = require("../config/prisma");

const createLandListing = async (ownerId, landData) => {
  const land = await prisma.landListing.create({
    data: {
      ...landData,
      ownerId,
    },
    include: {
      owner: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  return land;
};

const getAllLandListings = async (filters = {}) => {
  const allowedPublicStatuses = ["AVAILABLE", "PRE_BOOKED", "UNDER_CONTRACT"];

  const where = {};

  if (filters.status && allowedPublicStatuses.includes(filters.status)) {
    where.status = filters.status;
  } else {
    where.status = {
      not: "INACTIVE",
    };
  }

  if (filters.listingType) {
    where.listingType = filters.listingType;
  }

  if (filters.district) {
    where.district = {
      contains: filters.district,
      mode: "insensitive",
    };
  }

  if (filters.state) {
    where.state = {
      contains: filters.state,
      mode: "insensitive",
    };
  }

  const lands = await prisma.landListing.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      owner: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
        },
      },
    },
  });

  return lands;
};

const getMyLandListings = async (ownerId) => {
  const lands = await prisma.landListing.findMany({
    where: {
      ownerId,
      status: {
        not: "INACTIVE",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return lands;
};

const getLandListingById = async (landId) => {
  const land = await prisma.landListing.findFirst({
    where: {
      id: landId,
      status: {
        not: "INACTIVE",
      },
    },
    include: {
      owner: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  if (!land) {
    throw new Error("Land listing not found");
  }

  return land;
};

const updateLandListing = async (landId, ownerId, landData) => {
  const land = await prisma.landListing.findUnique({
    where: {
      id: landId,
    },
  });

  if (!land || land.status === "INACTIVE") {
    throw new Error("Land listing not found");
  }

  if (land.ownerId !== ownerId) {
    throw new Error("You can update only your own land listing");
  }

  const updatedLand = await prisma.landListing.update({
    where: {
      id: landId,
    },
    data: landData,
  });

  return updatedLand;
};

const deactivateLandListing = async (landId, ownerId) => {
  const land = await prisma.landListing.findUnique({
    where: {
      id: landId,
    },
  });

  if (!land || land.status === "INACTIVE") {
    throw new Error("Land listing not found");
  }

  if (land.ownerId !== ownerId) {
    throw new Error("You can delete only your own land listing");
  }

  const deletedLand = await prisma.landListing.update({
    where: {
      id: landId,
    },
    data: {
      status: "INACTIVE",
    },
  });

  return deletedLand;
};

module.exports = {
  createLandListing,
  getAllLandListings,
  getMyLandListings,
  getLandListingById,
  updateLandListing,
  deactivateLandListing,
};
