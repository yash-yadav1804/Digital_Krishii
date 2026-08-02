const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");

const createNotification = async ({ userId, type, title, message }) => {
  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
    },
  });

  return notification;
};

const getMyNotifications = async (userId, filters = {}) => {
  const where = {
    userId,
  };

  if (filters.isRead === "true") {
    where.isRead = true;
  }

  if (filters.isRead === "false") {
    where.isRead = false;
  }

  const notifications = await prisma.notification.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  return notifications;
};

const getUnreadNotificationCount = async (userId) => {
  const unreadCount = await prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });

  return unreadCount;
};

const markNotificationAsRead = async (notificationId, userId) => {
  const notification = await prisma.notification.findUnique({
    where: {
      id: notificationId,
    },
  });

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  if (notification.userId !== userId) {
    throw new AppError("You can update only your own notifications", 403);
  }

  const updatedNotification = await prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      isRead: true,
    },
  });

  return updatedNotification;
};

const markAllNotificationsAsRead = async (userId) => {
  const result = await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  return {
    updatedCount: result.count,
  };
};

module.exports = {
  createNotification,
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
