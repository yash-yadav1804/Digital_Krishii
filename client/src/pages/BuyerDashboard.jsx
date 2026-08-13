import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardStatsGrid from "../components/dashboard/DashboardStatsGrid.jsx";
import { getLands } from "../api/landApi";
import { getSentContractRequests } from "../api/contractApi";
import { getUnreadNotificationCount } from "../api/notificationApi";

const BuyerDashboard = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["buyer-dashboard"],
    queryFn: async () => {
      const [
        availableLandsResponse,
        sentContractsResponse,
        unreadNotificationsResponse,
      ] = await Promise.all([
        getLands({
          page: 1,
          limit: 10,
          listingType: "CONTRACT_FARMING",
          status: "AVAILABLE",
        }),
        getSentContractRequests(),
        getUnreadNotificationCount(),
      ]);

      return {
        availableLands: availableLandsResponse?.data || [],
        sentContracts: sentContractsResponse?.data || [],
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

  const cards = [
    {
      label: "Available Lands",
      value: data?.availableLands?.length || 0,
      helperText: "Contract farming lands",
    },
    {
      label: "Sent Contracts",
      value: data?.sentContracts?.length || 0,
      helperText: "Requests sent to farmers",
    },
    {
      label: "Pending Requests",
      value: pendingContracts,
      helperText: "Waiting for farmer response",
    },
    {
      label: "Unread Notifications",
      value: data?.unreadNotifications || 0,
      helperText: "Notifications needing attention",
    },
  ];

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
          <DashboardStatsGrid cards={cards} />

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">
              Contract Summary
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              You have {acceptedContracts} accepted contract request
              {acceptedContracts === 1 ? "" : "s"}.
            </p>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default BuyerDashboard;
