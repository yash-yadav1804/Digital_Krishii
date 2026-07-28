const express = require("express");

const {
  createReview,
  getReceivedReviews,
  getGivenReviews,
  getRatingSummary,
} = require("../controllers/review.controller");

const { protect } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { createReviewSchema } = require("../validations/review.validation");

const router = express.Router();

router.post("/", protect, validate(createReviewSchema), createReview);

router.get("/received", protect, getReceivedReviews);

router.get("/given", protect, getGivenReviews);

router.get("/summary/:userId", protect, getRatingSummary);

module.exports = router;
