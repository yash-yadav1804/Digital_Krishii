import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardStatsGrid from "../components/dashboard/DashboardStatsGrid.jsx";
import StatusBadge from "../components/common/StatusBadge.jsx";
import { getMyLands } from "../api/landApi";
import {
  getMyEquipment,
  getReceivedEquipmentRentalRequests,
} from "../api/equipmentApi";
import { getReceivedContractRequests } from "../api/contractApi";
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

const FarmerDashboard = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["farmer-dashboard"],
    queryFn: async () => {
      const [
        landsResponse,
        equipmentResponse,
        contractRequestsResponse,
        rentalRequestsResponse,
        unreadNotificationsResponse,
        notificationsResponse,
      ] = await Promise.all([
        getMyLands(),
        getMyEquipment(),
        getReceivedContractRequests(),
        getReceivedEquipmentRentalRequests(),
        getUnreadNotificationCount(),
        getNotifications(),
      ]);

      return {
        lands: landsResponse?.data || [],
        equipment: equipmentResponse?.data || [],
        contractRequests: contractRequestsResponse?.data || [],
        rentalRequests: rentalRequestsResponse?.data || [],
        notifications: notificationsResponse?.data || [],
        unreadNotifications:
          unreadNotificationsResponse?.data?.count ||
          unreadNotificationsResponse?.count ||
          0,
      };
    },
  });

  const errorMessage =
    error?.response?.data?.message || "Failed to load farmer dashboard.";

  const pendingContracts =
    data?.contractRequests?.filter((request) => request.status === "PENDING")
      ?.length || 0;

  const pendingRentals =
    data?.rentalRequests?.filter((request) => request.status === "PENDING")
      ?.length || 0;

  const cards = [
    {
      label: "My Lands",
      value: data?.lands?.length || 0,
      helperText: "Active land listings ready for contract farming.",
      icon: "🌾",
      tone: "green",
      to: "/farmer/lands",
    },
    {
      label: "My Equipment",
      value: data?.equipment?.length || 0,
      helperText: "Machines and tools listed for rental.",
      icon: "🚜",
      tone: "yellow",
      to: "/farmer/equipment",
    },
    {
      label: "Contract Requests",
      value: data?.contractRequests?.length || 0,
      helperText: `${pendingContracts} pending buyer request${
        pendingContracts === 1 ? "" : "s"
      }.`,
      icon: "📄",
      tone: "blue",
      to: "/farmer/contracts",
    },
    {
      label: "Rental Requests",
      value: data?.rentalRequests?.length || 0,
      helperText: `${pendingRentals} pending equipment rental${
        pendingRentals === 1 ? "" : "s"
      }.`,
      icon: "📦",
      tone: "purple",
      to: "/farmer/rentals",
    },
    {
      label: "Unread Notifications",
      value: data?.unreadNotifications || 0,
      helperText: "New updates that need your attention.",
      icon: "🔔",
      tone: "red",
      to: "/notifications",
    },
  ];

  const recentContracts = data?.contractRequests?.slice(0, 3) || [];
  const recentRentals = data?.rentalRequests?.slice(0, 3) || [];
  const recentNotifications = data?.notifications?.slice(0, 3) || [];

  return (
    <DashboardLayout title="Farmer Dashboard">
      {isError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl bg-white px-6 py-10 text-center text-slate-500 shadow-sm ring-1 ring-slate-200">
          Loading farmer dashboard...
        </div>
      ) : (
        <>
          <section className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-green-950 via-green-800 to-emerald-700 p-7 text-white shadow-sm">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wide text-green-50 ring-1 ring-white/20">
                  Farmer Control Center
                </p>

                <h2 className="mt-5 text-3xl font-black leading-tight md:text-4xl">
                  Manage lands, equipment, contracts, and rentals from one smart
                  dashboard.
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-green-50">
                  Track buyer requests, rental activity, notifications, and
                  active listings. Digital Krishii helps farmers manage contract
                  farming work faster and with better visibility.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/farmer/lands"
                    className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-green-800 hover:bg-green-50"
                  >
                    Add Land
                  </Link>

                  <Link
                    to="/farmer/equipment"
                    className="rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/20 hover:bg-green-500"
                  >
                    Add Equipment
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-2xl font-black">{pendingContracts}</p>
                    <p className="mt-1 text-xs text-green-50">
                      Pending Contracts
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-2xl font-black">{pendingRentals}</p>
                    <p className="mt-1 text-xs text-green-50">
                      Pending Rentals
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-2xl font-black">
                      {data?.lands?.length || 0}
                    </p>
                    <p className="mt-1 text-xs text-green-50">Land Listings</p>
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
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Quick Actions
                </h3>

                <p className="text-sm text-slate-500">
                  Common farmer tasks you may want to perform quickly.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <QuickActionCard
                title="Add Land"
                description="Create a new land listing for contract farming or rent."
                to="/farmer/lands"
              />

              <QuickActionCard
                title="Add Equipment"
                description="List tractors, tools, or machines for rental."
                to="/farmer/equipment"
              />

              <QuickActionCard
                title="View Contracts"
                description="Review buyer contract requests and take action."
                to="/farmer/contracts"
              />

              <QuickActionCard
                title="View Rentals"
                description="Approve or reject equipment rental requests."
                to="/farmer/rentals"
              />
            </div>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Recent Contracts</h3>

                <Link
                  to="/farmer/contracts"
                  className="text-sm font-semibold text-green-700 hover:underline"
                >
                  View all
                </Link>
              </div>

              {recentContracts.length === 0 ? (
                <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                  No contract requests yet.
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
                            {request.land?.title || "Land request"}
                          </h4>

                          <p className="mt-1 text-sm text-slate-500">
                            Buyer: {request.buyer?.firstName}{" "}
                            {request.buyer?.lastName}
                          </p>
                        </div>

                        <StatusBadge status={request.status} />
                      </div>

                      <p className="mt-3 text-xs text-slate-500">
                        Crop: {request.cropName || "N/A"}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Recent Rentals</h3>

                <Link
                  to="/farmer/rentals"
                  className="text-sm font-semibold text-green-700 hover:underline"
                >
                  View all
                </Link>
              </div>

              {recentRentals.length === 0 ? (
                <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                  No rental requests yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {recentRentals.map((rental) => (
                    <article
                      key={rental.id}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-slate-900">
                            {rental.equipment?.title || "Equipment request"}
                          </h4>

                          <p className="mt-1 text-sm text-slate-500">
                            From: {rental.requester?.firstName}{" "}
                            {rental.requester?.lastName}
                          </p>
                        </div>

                        <StatusBadge status={rental.status} />
                      </div>

                      <p className="mt-3 text-xs text-slate-500">
                        {formatDate(rental.startDate)} -{" "}
                        {formatDate(rental.endDate)}
                      </p>
                    </article>
                  ))}
                </div>
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

export default FarmerDashboard;
