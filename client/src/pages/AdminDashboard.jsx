import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getAdminStats } from "../api/adminApi";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getAdminStats();
        setStats(response.data);
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to load admin stats.";

        setErrorMessage(message);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      label: "Users",
      value: stats?.totalUsers ?? 0,
    },
    {
      label: "Farmers",
      value: stats?.totalFarmers ?? 0,
    },
    {
      label: "Buyers",
      value: stats?.totalBuyers ?? 0,
    },
    {
      label: "Lands",
      value: stats?.totalLands ?? 0,
    },
    {
      label: "Equipment",
      value: stats?.totalEquipment ?? 0,
    },
    {
      label: "Contract Requests",
      value: stats?.totalContractRequests ?? 0,
    },
    {
      label: "Equipment Rentals",
      value: stats?.totalEquipmentRentals ?? 0,
    },
  ];

  return (
    <DashboardLayout title="Admin Dashboard">
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

export default AdminDashboard;
