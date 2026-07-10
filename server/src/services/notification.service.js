const prisma = require("../config/prisma");

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
  const count = await prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });

  return count;
};

const markNotificationAsRead = async (notificationId, userId) => {
  const notification = await prisma.notification.findUnique({
    where: {
      id: notificationId,
    },
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  if (notification.userId !== userId) {
    throw new Error("You can update only your own notification");
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
  await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  return {
    message: "All notifications marked as read",
  };
};

module.exports = {
  createNotification,
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
