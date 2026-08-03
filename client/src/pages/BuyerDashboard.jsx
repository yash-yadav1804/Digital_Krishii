import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getLands } from "../api/landApi";
import { getSentContractRequests } from "../api/contractApi";
import { getUnreadNotificationCount } from "../api/notificationApi";

const BuyerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    availableLands: 0,
    sentContracts: 0,
    pendingContracts: 0,
    acceptedContracts: 0,
    rejectedContracts: 0,
    unreadNotifications: 0,
  });

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [landsResponse, contractsResponse, notificationResponse] =
          await Promise.all([
            getLands({
              page: 1,
              limit: 10,
              listingType: "CONTRACT_FARMING",
              status: "AVAILABLE",
            }),
            getSentContractRequests(),
            getUnreadNotificationCount(),
          ]);

        const contracts = contractsResponse.data || [];

        setDashboardData({
          availableLands: landsResponse.total || 0,
          sentContracts: contracts.length,
          pendingContracts: contracts.filter(
            (contract) => contract.status === "PENDING",
          ).length,
          acceptedContracts: contracts.filter(
            (contract) => contract.status === "ACCEPTED",
          ).length,
          rejectedContracts: contracts.filter(
            (contract) => contract.status === "REJECTED",
          ).length,
          unreadNotifications: notificationResponse.data?.unreadCount ?? 0,
        });
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Failed to load buyer dashboard data.";

        setErrorMessage(message);
      }
    };

    fetchDashboardData();
  }, []);

  const cards = [
    {
      label: "Available Lands",
      value: dashboardData.availableLands,
    },
    {
      label: "Sent Contracts",
      value: dashboardData.sentContracts,
    },
    {
      label: "Pending Contracts",
      value: dashboardData.pendingContracts,
    },
    {
      label: "Accepted Contracts",
      value: dashboardData.acceptedContracts,
    },
    {
      label: "Rejected Contracts",
      value: dashboardData.rejectedContracts,
    },
    {
      label: "Unread Notifications",
      value: dashboardData.unreadNotifications,
    },
  ];

  return (
    <DashboardLayout title="Buyer Dashboard">
      {errorMessage && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm text-slate-500">{card.label}</p>

            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              {card.value}
            </h3>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default BuyerDashboard;
