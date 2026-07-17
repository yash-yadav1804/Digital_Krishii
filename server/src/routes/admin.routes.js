const express = require("express");

const {
  getStats,
  getUsers,
  getUserById,
  blockUser,
  unblockUser,
} = require("../controllers/admin.controller");

const { protect, authorizeRoles } = require("../middlewares/auth.middleware");

const router = express.Router();

/*
  All admin routes require:
  1. Valid JWT token
  2. ADMIN role
*/

router.use(protect);
router.use(authorizeRoles("ADMIN"));

router.get("/stats", getStats);

router.get("/users", getUsers);

router.get("/users/:id", getUserById);

router.patch("/users/:id/block", blockUser);

router.patch("/users/:id/unblock", unblockUser);

module.exports = router;
