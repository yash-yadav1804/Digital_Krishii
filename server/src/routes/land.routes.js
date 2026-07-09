const express = require("express");

const {
  createLand,
  getLands,
  getMyLands,
  getLandById,
  updateLand,
  deleteLand,
} = require("../controllers/land.controller");

const { protect, authorizeRoles } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  createLandSchema,
  updateLandSchema,
} = require("../validations/land.validation");

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("FARMER"),
  validate(createLandSchema),
  createLand,
);

router.get("/", protect, getLands);

router.get("/my", protect, authorizeRoles("FARMER"), getMyLands);

router.get("/:id", protect, getLandById);

router.put(
  "/:id",
  protect,
  authorizeRoles("FARMER"),
  validate(updateLandSchema),
  updateLand,
);

router.delete("/:id", protect, authorizeRoles("FARMER"), deleteLand);

module.exports = router;
