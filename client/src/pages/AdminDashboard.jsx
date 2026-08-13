import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardStatsGrid from "../components/dashboard/DashboardStatsGrid.jsx";
import { getAdminStats } from "../api/adminApi";

const AdminDashboard = () => {
  const {
    data: statsResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
  });

  const stats = statsResponse?.data || statsResponse || {};

  const errorMessage =
    error?.response?.data?.message || "Failed to load admin dashboard.";

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers || 0,
      helperText: "All registered platform users",
    },
    {
      label: "Farmers",
      value: stats.totalFarmers || 0,
      helperText: "Users with farmer role",
    },
    {
      label: "Buyers",
      value: stats.totalBuyers || 0,
      helperText: "Users with buyer role",
    },
    {
      label: "Blocked Users",
      value: stats.blockedUsers || 0,
      helperText: "Users blocked by admin",
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
        <DashboardStatsGrid cards={cards} />
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
