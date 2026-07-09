const express = require("express");
const {
  getProfile,
  updateProfile,
} = require("../controllers/profile.controller");

const { protect } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { updateProfileSchema } = require("../validations/profile.validation");

const router = express.Router();

router.get("/", protect, getProfile);

router.put("/", protect, validate(updateProfileSchema), updateProfile);

module.exports = router;
