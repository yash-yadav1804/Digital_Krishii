const AppError = require("../utils/AppError");

const {
  findContractRequestById,
  findEquipmentRentalById,
  findExistingContractReview,
  findExistingEquipmentReview,
  createReview,
  getReviewsReceivedByUser,
  getReviewsGivenByUser,
  getUserReviewStats,
} = require("../repositories/review.repository");

const createContractReview = async (reviewerId, reviewData) => {
  const contractRequest = await findContractRequestById(
    reviewData.contractRequestId,
  );

  if (!contractRequest) {
    throw new AppError("Contract request not found", 404);
  }

  const allowedStatuses = ["ACCEPTED", "COMPLETED"];

  if (!allowedStatuses.includes(contractRequest.status)) {
    throw new AppError(
      "Review can be added only after contract is accepted or completed",
      400,
    );
  }

  const isBuyer = contractRequest.buyerId === reviewerId;
  const isFarmer = contractRequest.farmerId === reviewerId;

  if (!isBuyer && !isFarmer) {
    throw new AppError("You can review only your own contract deal", 403);
  }

  if (reviewData.revieweeId === reviewerId) {
    throw new AppError("You cannot review yourself", 400);
  }

  const validRevieweeIds = [contractRequest.buyerId, contractRequest.farmerId];

  if (!validRevieweeIds.includes(reviewData.revieweeId)) {
    throw new AppError("Reviewee must be part of this contract deal", 400);
  }

  const existingReview = await findExistingContractReview(
    reviewerId,
    reviewData.contractRequestId,
  );

  if (existingReview) {
    throw new AppError("You have already reviewed this contract deal", 409);
  }

  const review = await createReview({
    reviewerId,
    revieweeId: reviewData.revieweeId,
    targetType: "CONTRACT_REQUEST",
    contractRequestId: reviewData.contractRequestId,
    rating: reviewData.rating,
    comment: reviewData.comment,
  });

  return review;
};

const createEquipmentReview = async (reviewerId, reviewData) => {
  const rental = await findEquipmentRentalById(reviewData.equipmentRentalId);

  if (!rental) {
    throw new AppError("Equipment rental not found", 404);
  }

  const allowedStatuses = ["APPROVED", "COMPLETED"];

  if (!allowedStatuses.includes(rental.status)) {
    throw new AppError(
      "Review can be added only after equipment rental is approved or completed",
      400,
    );
  }

  const equipmentOwnerId = rental.equipment.ownerId;
  const requesterId = rental.requesterId;

  const isRequester = requesterId === reviewerId;
  const isOwner = equipmentOwnerId === reviewerId;

  if (!isRequester && !isOwner) {
    throw new AppError(
      "You can review only your own equipment rental deal",
      403,
    );
  }

  if (reviewData.revieweeId === reviewerId) {
    throw new AppError("You cannot review yourself", 400);
  }

  const validRevieweeIds = [requesterId, equipmentOwnerId];

  if (!validRevieweeIds.includes(reviewData.revieweeId)) {
    throw new AppError(
      "Reviewee must be part of this equipment rental deal",
      400,
    );
  }

  const existingReview = await findExistingEquipmentReview(
    reviewerId,
    reviewData.equipmentRentalId,
  );

  if (existingReview) {
    throw new AppError(
      "You have already reviewed this equipment rental deal",
      409,
    );
  }

  const review = await createReview({
    reviewerId,
    revieweeId: reviewData.revieweeId,
    targetType: "EQUIPMENT_RENTAL",
    equipmentRentalId: reviewData.equipmentRentalId,
    rating: reviewData.rating,
    comment: reviewData.comment,
  });

  return review;
};

const createUserReview = async (reviewerId, reviewData) => {
  if (reviewData.targetType === "CONTRACT_REQUEST") {
    return createContractReview(reviewerId, reviewData);
  }

  if (reviewData.targetType === "EQUIPMENT_RENTAL") {
    return createEquipmentReview(reviewerId, reviewData);
  }

  throw new AppError("Invalid review target type", 400);
};

const getMyReceivedReviews = async (userId) => {
  const reviews = await getReviewsReceivedByUser(userId);

  return reviews;
};

const getMyGivenReviews = async (userId) => {
  const reviews = await getReviewsGivenByUser(userId);

  return reviews;
};

const getUserRatingSummary = async (userId) => {
  const stats = await getUserReviewStats(userId);

  return stats;
};

module.exports = {
  createUserReview,
  getMyReceivedReviews,
  getMyGivenReviews,
  getUserRatingSummary,
};
