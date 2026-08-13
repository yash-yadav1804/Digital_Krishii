import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardStatsGrid from "../components/dashboard/DashboardStatsGrid.jsx";
import { getAdminStats } from "../api/adminApi";

const AdminStatsPage = () => {
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
    error?.response?.data?.message || "Failed to load platform stats.";

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers || 0,
      helperText: "All registered users",
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
    {
      label: "Total Lands",
      value: stats.totalLands || 0,
      helperText: "Land listings on platform",
    },
    {
      label: "Total Equipment",
      value: stats.totalEquipment || 0,
      helperText: "Equipment rental listings",
    },
    {
      label: "Contract Requests",
      value: stats.totalContractRequests || 0,
      helperText: "All contract requests",
    },
    {
      label: "Rental Requests",
      value: stats.totalRentalRequests || 0,
      helperText: "All equipment rental requests",
    },
  ];

  return (
    <DashboardLayout title="Platform Stats">
      {isError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl bg-white px-6 py-10 text-center text-slate-500 shadow-sm ring-1 ring-slate-200">
          Loading platform stats...
        </div>
      ) : (
        <>
          <DashboardStatsGrid cards={cards} />

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">
              Platform Health
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              These numbers help admin understand user activity, listings,
              contract flow, and rental flow.
            </p>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default AdminStatsPage;
