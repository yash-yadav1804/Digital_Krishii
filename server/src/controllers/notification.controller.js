const {
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require("../services/notification.service");

const getErrorStatusCode = (message) => {
  if (message.includes("not found")) return 404;
  if (message.includes("own")) return 403;
  return 400;
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await getMyNotifications(req.user.id, req.query);

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await getUnreadNotificationCount(req.user.id);

    res.status(200).json({
      success: true,
      unreadCount: count,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await markNotificationAsRead(
      req.params.id,
      req.user.id,
    );

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const result = await markAllNotificationsAsRead(req.user.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(getErrorStatusCode(error.message)).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
