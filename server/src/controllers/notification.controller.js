const asyncHandler = require("../utils/asyncHandler");

const {
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require("../services/notification.service");

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await getMyNotifications(req.user.id, req.query);

  res.status(200).json({
    success: true,
    count: notifications.length,
    data: notifications,
  });
});

const getUnreadCount = asyncHandler(async (req, res) => {
  const unreadCount = await getUnreadNotificationCount(req.user.id);

  res.status(200).json({
    success: true,
    data: {
      unreadCount,
    },
  });
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await markNotificationAsRead(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    message: "Notification marked as read",
    data: notification,
  });
});

const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await markAllNotificationsAsRead(req.user.id);

  res.status(200).json({
    success: true,
    message: "All notifications marked as read",
    data: result,
  });
});

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
