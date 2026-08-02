const express = require("express");

const { protect, authorizeRoles } = require("../middlewares/auth.middleware");

const validate = require("../middlewares/validate.middleware");

const {
  createEquipmentSchema,
  updateEquipmentSchema,
  createEquipmentRentalSchema,
  updateEquipmentRentalStatusSchema,
} = require("../validations/equipment.validation");

const {
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
} = require("../controllers/equipment.controller");

const router = express.Router();

router.use(protect);

// Equipment rental routes must come before "/:id"
router.post(
  "/rentals",
  authorizeRoles("FARMER"),
  validate(createEquipmentRentalSchema),
  createRentalRequest,
);

router.get("/rentals/my", authorizeRoles("FARMER"), getMyRentalRequests);

router.get(
  "/rentals/received",
  authorizeRoles("FARMER"),
  getReceivedRentalRequests,
);

router.patch(
  "/rentals/:id/status",
  authorizeRoles("FARMER"),
  validate(updateEquipmentRentalStatusSchema),
  updateRentalStatus,
);

// Equipment listing routes
router.post(
  "/",
  authorizeRoles("FARMER"),
  validate(createEquipmentSchema),
  createEquipment,
);

router.get("/", getEquipment);

router.get("/my", authorizeRoles("FARMER"), getMyEquipment);

router.get("/:id", getEquipmentById);

router.put(
  "/:id",
  authorizeRoles("FARMER"),
  validate(updateEquipmentSchema),
  updateEquipment,
);

router.delete("/:id", authorizeRoles("FARMER"), deleteEquipment);

module.exports = router;
