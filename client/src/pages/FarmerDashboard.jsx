import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getMyLands } from "../api/landApi";
import {
  getMyEquipment,
  getReceivedEquipmentRentalRequests,
} from "../api/equipmentApi";
import { getReceivedContractRequests } from "../api/contractApi";
import { getUnreadNotificationCount } from "../api/notificationApi";

const FarmerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    lands: 0,
    equipment: 0,
    contractRequests: 0,
    pendingContractRequests: 0,
    rentalRequests: 0,
    pendingRentalRequests: 0,
    unreadNotifications: 0,
  });

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          landsResponse,
          equipmentResponse,
          contractResponse,
          rentalResponse,
          notificationResponse,
        ] = await Promise.all([
          getMyLands(),
          getMyEquipment(),
          getReceivedContractRequests(),
          getReceivedEquipmentRentalRequests(),
          getUnreadNotificationCount(),
        ]);

        const contractRequests = contractResponse.data || [];
        const rentalRequests = rentalResponse.data || [];

        setDashboardData({
          lands: landsResponse.count || landsResponse.data?.length || 0,
          equipment:
            equipmentResponse.count || equipmentResponse.data?.length || 0,
          contractRequests: contractRequests.length,
          pendingContractRequests: contractRequests.filter(
            (request) => request.status === "PENDING",
          ).length,
          rentalRequests: rentalRequests.length,
          pendingRentalRequests: rentalRequests.filter(
            (request) => request.status === "PENDING",
          ).length,
          unreadNotifications: notificationResponse.data?.unreadCount ?? 0,
        });
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Failed to load farmer dashboard data.";

        setErrorMessage(message);
      }
    };

    fetchDashboardData();
  }, []);

  const cards = [
    {
      label: "My Lands",
      value: dashboardData.lands,
    },
    {
      label: "My Equipment",
      value: dashboardData.equipment,
    },
    {
      label: "Contract Requests",
      value: dashboardData.contractRequests,
    },
    {
      label: "Pending Contracts",
      value: dashboardData.pendingContractRequests,
    },
    {
      label: "Rental Requests",
      value: dashboardData.rentalRequests,
    },
    {
      label: "Pending Rentals",
      value: dashboardData.pendingRentalRequests,
    },
    {
      label: "Unread Notifications",
      value: dashboardData.unreadNotifications,
    },
  ];

  return (
    <DashboardLayout title="Farmer Dashboard">
      {errorMessage && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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

export default FarmerDashboard;
