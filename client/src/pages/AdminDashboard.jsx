import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardStatsGrid from "../components/dashboard/DashboardStatsGrid.jsx";
import { getAdminStats, getAdminUsers } from "../api/adminApi";

const formatRoles = (roles = []) => {
  return roles.join(", ");
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

const AdminDashboard = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const [statsResponse, usersResponse] = await Promise.all([
        getAdminStats(),
        getAdminUsers({
          page: 1,
          limit: 5,
        }),
      ]);

      return {
        stats: statsResponse?.data || statsResponse || {},
        recentUsers: usersResponse?.data || [],
      };
    },
  });

  const stats = data?.stats || {};
  const recentUsers = data?.recentUsers || [];

  const errorMessage =
    error?.response?.data?.message || "Failed to load admin dashboard.";

  const totalUsers = stats.totalUsers || 0;
  const blockedUsers = stats.blockedUsers || 0;

  const activeUsers = Math.max(totalUsers - blockedUsers, 0);

  const blockedPercentage =
    totalUsers > 0 ? Math.round((blockedUsers / totalUsers) * 100) : 0;

  const cards = [
    {
      label: "Total Users",
      value: totalUsers,
      helperText: "All registered platform accounts.",
      icon: "👥",
      tone: "green",
      to: "/admin/users",
    },
    {
      label: "Farmers",
      value: stats.totalFarmers || 0,
      helperText: "Users managing lands and equipment.",
      icon: "🌾",
      tone: "yellow",
      to: "/admin/users",
    },
    {
      label: "Buyers",
      value: stats.totalBuyers || 0,
      helperText: "Users sending contract requests.",
      icon: "🧑‍💼",
      tone: "blue",
      to: "/admin/users",
    },
    {
      label: "Blocked Users",
      value: blockedUsers,
      helperText: "Accounts restricted by admin.",
      icon: "🚫",
      tone: "red",
      to: "/admin/users",
    },
    {
      label: "Land Listings",
      value: stats.totalLands || 0,
      helperText: "Total lands listed on platform.",
      icon: "🗺️",
      tone: "green",
      to: "/admin/stats",
    },
    {
      label: "Equipment Listings",
      value: stats.totalEquipment || 0,
      helperText: "Rental equipment available on platform.",
      icon: "🚜",
      tone: "purple",
      to: "/admin/stats",
    },
    {
      label: "Contract Requests",
      value: stats.totalContractRequests || 0,
      helperText: "All buyer-to-farmer contract requests.",
      icon: "📄",
      tone: "blue",
      to: "/admin/stats",
    },
    {
      label: "Rental Requests",
      value: stats.totalRentalRequests || 0,
      helperText: "All equipment rental requests.",
      icon: "📦",
      tone: "yellow",
      to: "/admin/stats",
    },
  ];

  return (
    <DashboardLayout title="Admin Dashboard">
      {isError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl bg-white px-6 py-10 text-center text-slate-500 shadow-sm ring-1 ring-slate-200">
          Loading admin dashboard...
        </div>
      ) : (
        <>
          <section className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-green-900 to-emerald-700 p-7 text-white shadow-sm">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wide text-green-50 ring-1 ring-white/20">
                  Platform Control Center
                </p>

                <h2 className="mt-5 text-3xl font-black leading-tight md:text-4xl">
                  Monitor users, listings, contracts, rentals, and platform
                  health from one admin console.
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-green-50">
                  Digital Krishii admin dashboard helps track farmer-buyer
                  activity, manage user access, review platform growth, and
                  maintain operational control.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/admin/users"
                    className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-green-800 hover:bg-green-50"
                  >
                    Manage Users
                  </Link>

                  <Link
                    to="/admin/uploads"
                    className="rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/20 hover:bg-green-500"
                  >
                    Upload Contract PDFs
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-2xl font-black">{activeUsers}</p>
                    <p className="mt-1 text-xs text-green-50">Active Users</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-2xl font-black">{blockedUsers}</p>
                    <p className="mt-1 text-xs text-green-50">Blocked Users</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-2xl font-black">
                      {stats.totalContractRequests || 0}
                    </p>
                    <p className="mt-1 text-xs text-green-50">Contracts</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-2xl font-black">
                      {stats.totalRentalRequests || 0}
                    </p>
                    <p className="mt-1 text-xs text-green-50">Rentals</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <DashboardStatsGrid cards={cards} columns="xl:grid-cols-4" />

          <section className="mt-6 grid gap-6 xl:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 xl:col-span-2">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Recent Users
                  </h3>

                  <p className="text-sm text-slate-500">
                    Latest platform accounts visible to admin.
                  </p>
                </div>

                <Link
                  to="/admin/users"
                  className="text-sm font-semibold text-green-700 hover:underline"
                >
                  View all
                </Link>
              </div>

              {recentUsers.length === 0 ? (
                <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  No users found.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="rounded-l-xl px-4 py-3">User</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Location</th>
                        <th className="rounded-r-xl px-4 py-3">Status</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200">
                      {recentUsers.map((user) => (
                        <tr key={user.id} className="text-sm">
                          <td className="px-4 py-4">
                            <p className="font-semibold text-slate-900">
                              {user.firstName} {user.lastName}
                            </p>

                            <p className="text-xs text-slate-400">
                              {user.email}
                            </p>
                          </td>

                          <td className="px-4 py-4 text-slate-600">
                            {formatRoles(user.roles)}
                          </td>

                          <td className="px-4 py-4 text-slate-600">
                            {user.district || "N/A"}, {user.state || "N/A"}
                          </td>

                          <td className="px-4 py-4">
                            {user.isBlocked ? (
                              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200">
                                Blocked
                              </span>
                            ) : (
                              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200">
                                Active
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 className="text-lg font-bold text-slate-900">
                  Platform Health
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Quick admin view of access control and operational risk.
                </p>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      Blocked User Ratio
                    </span>
                    <span className="font-bold text-slate-900">
                      {blockedPercentage}%
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-red-500"
                      style={{ width: `${blockedPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-green-50 p-4">
                    <p className="text-2xl font-black text-green-800">
                      {activeUsers}
                    </p>
                    <p className="mt-1 text-xs font-medium text-green-700">
                      Active
                    </p>
                  </div>

                  <div className="rounded-xl bg-red-50 p-4">
                    <p className="text-2xl font-black text-red-700">
                      {blockedUsers}
                    </p>
                    <p className="mt-1 text-xs font-medium text-red-700">
                      Blocked
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 className="text-lg font-bold text-slate-900">
                  Admin Quick Actions
                </h3>

                <div className="mt-4 grid gap-3">
                  <QuickActionCard
                    title="Manage Users"
                    description="Block or unblock users and review accounts."
                    to="/admin/users"
                  />

                  <QuickActionCard
                    title="View Platform Stats"
                    description="Review user, listing, contract, and rental metrics."
                    to="/admin/stats"
                  />

                  <QuickActionCard
                    title="Upload PDFs"
                    description="Upload contract templates or legal documents."
                    to="/admin/uploads"
                  />
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
