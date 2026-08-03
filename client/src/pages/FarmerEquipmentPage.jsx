import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import StatusBadge from "../components/common/StatusBadge.jsx";
import { deleteEquipment, getMyEquipment } from "../api/equipmentApi.js";

const FarmerEquipmentPage = () => {
  const [actionError, setActionError] = useState("");

  const queryClient = useQueryClient();

  const {
    data: equipmentResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["farmer-equipment"],
    queryFn: getMyEquipment,
  });

  const deleteEquipmentMutation = useMutation({
    mutationFn: deleteEquipment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["farmer-equipment"],
      });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to delete equipment listing.";

      setActionError(message);
    },
  });

  const equipmentList = equipmentResponse?.data || [];

  const errorMessage =
    error?.response?.data?.message || "Failed to load equipment listings.";

  const handleDeleteEquipment = (equipmentId) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this equipment listing?",
    );

    if (!shouldDelete) {
      return;
    }

    setActionError("");
    deleteEquipmentMutation.mutate(equipmentId);
  };

  return (
    <DashboardLayout title="My Equipment">
      {(isError || actionError) && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError || errorMessage}
        </div>
      )}

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Equipment Listings
            </h3>

            <p className="text-sm text-slate-500">
              Manage your farming equipment rental listings.
            </p>
          </div>

          <button className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800">
            Add Equipment
          </button>
        </div>

        {isLoading ? (
          <div className="px-6 py-10 text-center text-slate-500">
            Loading equipment listings...
          </div>
        ) : equipmentList.length === 0 ? (
          <div className="px-6 py-10 text-center text-slate-500">
            No equipment listings found.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {equipmentList.map((equipment) => (
              <article
                key={equipment.id}
                className="grid gap-4 px-6 py-5 md:grid-cols-7"
              >
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-slate-900">
                    {equipment.title}
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    {equipment.equipmentType}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {equipment.district}, {equipment.state}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Brand</p>
                  <p className="font-medium text-slate-900">
                    {equipment.brand || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Model</p>
                  <p className="font-medium text-slate-900">
                    {equipment.modelName || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Rent</p>
                  <p className="font-medium text-slate-900">
                    ₹{equipment.rentPrice} /{" "}
                    {equipment.priceUnit?.replaceAll("_", " ")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <div className="mt-1">
                    <StatusBadge status={equipment.status} />
                  </div>
                </div>

                <div className="flex items-center justify-start md:justify-end">
                  <button
                    type="button"
                    onClick={() => handleDeleteEquipment(equipment.id)}
                    disabled={deleteEquipmentMutation.isPending}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deleteEquipmentMutation.isPending
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FarmerEquipmentPage;
