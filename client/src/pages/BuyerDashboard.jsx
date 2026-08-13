import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardStatsGrid from "../components/dashboard/DashboardStatsGrid.jsx";
import StatusBadge from "../components/common/StatusBadge.jsx";
import { getLands } from "../api/landApi";
import { getSentContractRequests } from "../api/contractApi";
import {
  getNotifications,
  getUnreadNotificationCount,
} from "../api/notificationApi";

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const QuickActionCard = ({ title, description, to }) => {
  return (
    <Link
      to={to}
      className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <h3 className="text-base font-bold text-slate-900">{title}</h3>

      <p className="mt-2 text-sm text-slate-500">{description}</p>

      <p className="mt-4 text-sm font-semibold text-green-700">Open →</p>
    </Link>
  );
};

const BuyerDashboard = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["buyer-dashboard"],
    queryFn: async () => {
      const [
        availableLandsResponse,
        sentContractsResponse,
        unreadNotificationsResponse,
        notificationsResponse,
      ] = await Promise.all([
        getLands({
          page: 1,
          limit: 6,
          listingType: "CONTRACT_FARMING",
          status: "AVAILABLE",
        }),
        getSentContractRequests(),
        getUnreadNotificationCount(),
        getNotifications(),
      ]);

      return {
        availableLands: availableLandsResponse?.data || [],
        sentContracts: sentContractsResponse?.data || [],
        notifications: notificationsResponse?.data || [],
        unreadNotifications:
          unreadNotificationsResponse?.data?.count ||
          unreadNotificationsResponse?.count ||
          0,
      };
    },
  });

  const errorMessage =
    error?.response?.data?.message || "Failed to load buyer dashboard.";

  const pendingContracts =
    data?.sentContracts?.filter((contract) => contract.status === "PENDING")
      ?.length || 0;

  const acceptedContracts =
    data?.sentContracts?.filter((contract) => contract.status === "ACCEPTED")
      ?.length || 0;

  const rejectedContracts =
    data?.sentContracts?.filter((contract) => contract.status === "REJECTED")
      ?.length || 0;

  const cards = [
    {
      label: "Available Lands",
      value: data?.availableLands?.length || 0,
      helperText: "Open contract farming opportunities.",
      icon: "🌾",
      tone: "green",
      to: "/buyer/lands",
    },
    {
      label: "Sent Contracts",
      value: data?.sentContracts?.length || 0,
      helperText: "Requests sent to farmers.",
      icon: "📄",
      tone: "blue",
      to: "/buyer/contracts",
    },
    {
      label: "Pending Requests",
      value: pendingContracts,
      helperText: "Waiting for farmer response.",
      icon: "⏳",
      tone: "yellow",
      to: "/buyer/contracts",
    },
    {
      label: "Accepted Deals",
      value: acceptedContracts,
      helperText: "Approved contract opportunities.",
      icon: "✅",
      tone: "green",
      to: "/buyer/contracts",
    },
    {
      label: "Unread Alerts",
      value: data?.unreadNotifications || 0,
      helperText: "Notifications needing attention.",
      icon: "🔔",
      tone: "red",
      to: "/notifications",
    },
  ];

  const recentLands = data?.availableLands?.slice(0, 3) || [];
  const recentContracts = data?.sentContracts?.slice(0, 3) || [];
  const recentNotifications = data?.notifications?.slice(0, 3) || [];

  return (
    <DashboardLayout title="Buyer Dashboard">
      {isError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl bg-white px-6 py-10 text-center text-slate-500 shadow-sm ring-1 ring-slate-200">
          Loading buyer dashboard...
        </div>
      ) : (
        <>
          <section className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-green-900 to-emerald-700 p-7 text-white shadow-sm">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wide text-green-50 ring-1 ring-white/20">
                  Buyer Opportunity Center
                </p>

                <h2 className="mt-5 text-3xl font-black leading-tight md:text-4xl">
                  Discover farming lands and manage your contract requests in
                  one place.
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-green-50">
                  Browse available lands, send contract farming proposals, track
                  farmer responses, and stay updated through real-time
                  notifications.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/buyer/lands"
                    className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-green-800 hover:bg-green-50"
                  >
                    Browse Lands
                  </Link>

                  <Link
                    to="/buyer/contracts"
                    className="rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/20 hover:bg-green-500"
                  >
                    Track Contracts
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-2xl font-black">
                      {data?.availableLands?.length || 0}
                    </p>
                    <p className="mt-1 text-xs text-green-50">
                      Available Lands
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-2xl font-black">{pendingContracts}</p>
                    <p className="mt-1 text-xs text-green-50">
                      Pending Requests
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-2xl font-black">{acceptedContracts}</p>
                    <p className="mt-1 text-xs text-green-50">Accepted Deals</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-2xl font-black">
                      {data?.unreadNotifications || 0}
                    </p>
                    <p className="mt-1 text-xs text-green-50">Unread Alerts</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <DashboardStatsGrid cards={cards} columns="xl:grid-cols-5" />

          <section className="mt-6">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                Quick Actions
              </h3>

              <p className="text-sm text-slate-500">
                Common buyer tasks to move faster.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <QuickActionCard
                title="Browse Lands"
                description="Explore available contract farming land listings."
                to="/buyer/lands"
              />

              <QuickActionCard
                title="Track Sent Contracts"
                description="Check pending, accepted, rejected, or cancelled requests."
                to="/buyer/contracts"
              />

              <QuickActionCard
                title="View Notifications"
                description="Stay updated about farmer responses and platform alerts."
                to="/notifications"
              />
            </div>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Land Opportunities</h3>

                <Link
                  to="/buyer/lands"
                  className="text-sm font-semibold text-green-700 hover:underline"
                >
                  View all
                </Link>
              </div>

              {recentLands.length === 0 ? (
                <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                  No available lands found.
                </p>
              ) : (
                <div className="space-y-4">
                  {recentLands.map((land) => (
                    <article
                      key={land.id}
                      className="overflow-hidden rounded-xl border border-slate-200"
                    >
                      <div className="h-32 bg-slate-100">
                        {land.imageUrl ? (
                          <img
                            src={land.imageUrl}
                            alt={land.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-slate-400">
                            No image available
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h4 className="font-semibold text-slate-900">
                          {land.title}
                        </h4>

                        <p className="mt-1 text-sm text-slate-500">
                          {land.district}, {land.state}
                        </p>

                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          ₹{land.price} / {land.priceUnit?.replaceAll("_", " ")}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Recent Contracts</h3>

                <Link
                  to="/buyer/contracts"
                  className="text-sm font-semibold text-green-700 hover:underline"
                >
                  View all
                </Link>
              </div>

              {recentContracts.length === 0 ? (
                <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                  No contract requests sent yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {recentContracts.map((request) => (
                    <article
                      key={request.id}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-slate-900">
                            {request.land?.title || "Contract request"}
                          </h4>

                          <p className="mt-1 text-sm text-slate-500">
                            Farmer: {request.farmer?.firstName}{" "}
                            {request.farmer?.lastName}
                          </p>
                        </div>

                        <StatusBadge status={request.status} />
                      </div>

                      <p className="mt-3 text-xs text-slate-500">
                        Crop: {request.cropName || "N/A"}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Start: {formatDate(request.startDate)}
                      </p>
                    </article>
                  ))}
                </div>
              )}

              {rejectedContracts > 0 && (
                <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {rejectedContracts} request
                  {rejectedContracts === 1 ? "" : "s"} rejected. Try sending a
                  revised proposal to another farmer.
                </p>
              )}
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">
                  Recent Notifications
                </h3>

                <Link
                  to="/notifications"
                  className="text-sm font-semibold text-green-700 hover:underline"
                >
                  View all
                </Link>
              </div>

              {recentNotifications.length === 0 ? (
                <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                  No notifications yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {recentNotifications.map((notification) => (
                    <article
                      key={notification.id}
                      className={`rounded-xl border p-4 ${
                        notification.isRead
                          ? "border-slate-200"
                          : "border-green-200 bg-green-50"
                      }`}
                    >
                      <h4 className="font-semibold text-slate-900">
                        {notification.title}
                      </h4>

                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                        {notification.message}
                      </p>

                      <p className="mt-3 text-xs text-slate-400">
                        {formatDate(notification.createdAt)}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </DashboardLayout>
  );
};

export default BuyerDashboard;
