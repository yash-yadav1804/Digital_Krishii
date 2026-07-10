const express = require("express");

const {
  getTemplates,
  getTemplateById,
  createRequest,
  getSentRequests,
  getReceivedRequests,
  getRequestById,
  updateRequestStatus,
  cancelRequest,
} = require("../controllers/contract.controller");

const { protect, authorizeRoles } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
  createContractRequestSchema,
  updateContractRequestStatusSchema,
  cancelContractRequestSchema,
} = require("../validations/contract.validation");

const router = express.Router();

/*
  Contract template routes
*/

router.get("/templates", protect, getTemplates);

router.get("/templates/:id", protect, getTemplateById);

/*
  Contract request routes
*/

router.post(
  "/requests",
  protect,
  authorizeRoles("BUYER"),
  validate(createContractRequestSchema),
  createRequest,
);

router.get("/requests/sent", protect, authorizeRoles("BUYER"), getSentRequests);

router.get(
  "/requests/received",
  protect,
  authorizeRoles("FARMER"),
  getReceivedRequests,
);

/*
  Keep these dynamic routes after /sent and /received
*/

router.get("/requests/:id", protect, getRequestById);

router.patch(
  "/requests/:id/status",
  protect,
  authorizeRoles("FARMER"),
  validate(updateContractRequestStatusSchema),
  updateRequestStatus,
);

router.patch(
  "/requests/:id/cancel",
  protect,
  authorizeRoles("BUYER"),
  validate(cancelContractRequestSchema),
  cancelRequest,
);

module.exports = router;
