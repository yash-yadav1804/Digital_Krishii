const express = require("express");

const { protect } = require("../middlewares/auth.middleware");

const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notification.controller");

const router = express.Router();

router.use(protect);

router.get("/", getNotifications);

router.get("/unread-count", getUnreadCount);

router.patch("/read-all", markAllAsRead);

router.patch("/:id/read", markAsRead);

module.exports = router;
