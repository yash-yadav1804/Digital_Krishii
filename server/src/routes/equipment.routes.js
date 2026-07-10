const express = require("express");

const {
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
} = require("../controllers/equipment.controller");

const { protect, authorizeRoles } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
  createEquipmentSchema,
  updateEquipmentSchema,
  createEquipmentRentalSchema,
  updateRentalStatusSchema,
} = require("../validations/equipment.validation");

const router = express.Router();

/*
  Equipment listing routes
*/

router.post(
  "/",
  protect,
  authorizeRoles("FARMER"),
  validate(createEquipmentSchema),
  createEquipment,
);

router.get("/", protect, getEquipment);

router.get("/my", protect, authorizeRoles("FARMER"), getMyEquipment);

/*
  Equipment rental routes
  Important: keep these before /:id
*/

router.post(
  "/rentals",
  protect,
  authorizeRoles("FARMER"),
  validate(createEquipmentRentalSchema),
  createRentalRequest,
);

router.get(
  "/rentals/my",
  protect,
  authorizeRoles("FARMER"),
  getMyRentalRequests,
);

router.get(
  "/rentals/received",
  protect,
  authorizeRoles("FARMER"),
  getRentalRequestsForOwner,
);

router.patch(
  "/rentals/:id/status",
  protect,
  authorizeRoles("FARMER"),
  validate(updateRentalStatusSchema),
  updateRentalStatus,
);

/*
  Dynamic equipment routes
  Keep these after /my and /rentals routes
*/

router.get("/:id", protect, getEquipmentById);

router.put(
  "/:id",
  protect,
  authorizeRoles("FARMER"),
  validate(updateEquipmentSchema),
  updateEquipment,
);

router.delete("/:id", protect, authorizeRoles("FARMER"), deleteEquipment);

module.exports = router;
