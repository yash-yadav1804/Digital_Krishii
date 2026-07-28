const asyncHandler = require("../utils/asyncHandler");

const {
  createUserReview,
  getMyReceivedReviews,
  getMyGivenReviews,
  getUserRatingSummary,
} = require("../services/review.service");

const createReview = asyncHandler(async (req, res) => {
  const review = await createUserReview(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: "Review created successfully",
    data: review,
  });
});

const getReceivedReviews = asyncHandler(async (req, res) => {
  const reviews = await getMyReceivedReviews(req.user.id);

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

const getGivenReviews = asyncHandler(async (req, res) => {
  const reviews = await getMyGivenReviews(req.user.id);

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

const getRatingSummary = asyncHandler(async (req, res) => {
  const stats = await getUserRatingSummary(req.params.userId);

  res.status(200).json({
    success: true,
    data: stats,
  });
});

module.exports = {
  createReview,
  getReceivedReviews,
  getGivenReviews,
  getRatingSummary,
};
