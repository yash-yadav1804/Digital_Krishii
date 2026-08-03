import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../api/notificationApi";

const formatNotificationType = (type) => {
  return type?.replaceAll("_", " ") || "NOTIFICATION";
};

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const {
    data: notificationsResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const markReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["farmer-dashboard"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["buyer-dashboard"],
      });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["farmer-dashboard"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["buyer-dashboard"],
      });
    },
  });

  const notifications = notificationsResponse?.data || [];

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  const errorMessage =
    error?.response?.data?.message || "Failed to load notifications.";

  const handleMarkAsRead = (notification) => {
    if (notification.isRead) {
      return;
    }

    markReadMutation.mutate(notification.id);
  };

  return (
    <DashboardLayout title="Notifications">
      <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Your Notifications
          </h3>

          <p className="text-sm text-slate-500">
            Track contract, rental, and platform updates.
          </p>

          <p className="mt-2 text-sm font-medium text-green-700">
            {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
          </p>
        </div>

        <button
          type="button"
          disabled={unreadCount === 0 || markAllReadMutation.isPending}
          onClick={() => markAllReadMutation.mutate()}
          className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-green-400"
        >
          {markAllReadMutation.isPending ? "Marking..." : "Mark All as Read"}
        </button>
      </div>

      {isError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        {isLoading ? (
          <div className="px-6 py-10 text-center text-slate-500">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-6 py-10 text-center text-slate-500">
            No notifications found.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {notifications.map((notification) => (
              <article
                key={notification.id}
                className={`px-6 py-5 ${
                  notification.isRead ? "bg-white" : "bg-green-50/50"
                }`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="font-semibold text-slate-900">
                        {notification.title}
                      </h4>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                        {formatNotificationType(notification.type)}
                      </span>

                      {!notification.isRead && (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          New
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                      {notification.message}
                    </p>

                    <p className="mt-3 text-xs text-slate-400">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>

                  {!notification.isRead && (
                    <button
                      type="button"
                      disabled={markReadMutation.isPending}
                      onClick={() => handleMarkAsRead(notification)}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {markReadMutation.isPending
                        ? "Marking..."
                        : "Mark as Read"}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
