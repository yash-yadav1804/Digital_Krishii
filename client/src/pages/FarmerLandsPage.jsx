import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import AddLandForm from "../components/lands/AddLandForm.jsx";
import StatusBadge from "../components/common/StatusBadge.jsx";
import { deleteLand, getMyLands } from "../api/landApi";

const FarmerLandsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [actionError, setActionError] = useState("");

  const queryClient = useQueryClient();

  const {
    data: landsResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["farmer-lands"],
    queryFn: getMyLands,
  });

  const deleteLandMutation = useMutation({
    mutationFn: deleteLand,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["farmer-lands"],
      });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to delete land listing.";

      setActionError(message);
    },
  });

  const lands = landsResponse?.data || [];

  const errorMessage =
    error?.response?.data?.message || "Failed to load land listings.";

  const handleLandCreated = async () => {
    setShowForm(false);

    await queryClient.invalidateQueries({
      queryKey: ["farmer-lands"],
    });
  };

  const handleDeleteLand = async (landId) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this land listing?",
    );

    if (!shouldDelete) {
      return;
    }

    setActionError("");
    deleteLandMutation.mutate(landId);
  };

  return (
    <DashboardLayout title="My Lands">
      {showForm && (
        <AddLandForm
          onLandCreated={handleLandCreated}
          onCancel={() => setShowForm(false)}
        />
      )}

      {(isError || actionError) && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError || errorMessage}
        </div>
      )}

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Land Listings
            </h3>

            <p className="text-sm text-slate-500">
              Manage your contract farming and rental land listings.
            </p>
          </div>

          <button
            onClick={() => setShowForm((prevValue) => !prevValue)}
            className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
          >
            {showForm ? "Close Form" : "Add Land"}
          </button>
        </div>

        {isLoading ? (
          <div className="px-6 py-10 text-center text-slate-500">
            Loading land listings...
          </div>
        ) : lands.length === 0 ? (
          <div className="px-6 py-10 text-center text-slate-500">
            No land listings found.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {lands.map((land) => (
              <article
                key={land.id}
                className="grid gap-4 px-6 py-5 md:grid-cols-6"
              >
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-slate-900">{land.title}</h4>

                  <p className="mt-1 text-sm text-slate-500">
                    {land.district}, {land.state}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {land.listingType?.replaceAll("_", " ")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Area</p>
                  <p className="font-medium text-slate-900">
                    {land.area} {land.areaUnit}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Price</p>
                  <p className="font-medium text-slate-900">
                    ₹{land.price} / {land.priceUnit?.replaceAll("_", " ")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <div className="mt-1">
                    <StatusBadge status={land.status} />
                  </div>
                </div>

                <div className="flex items-center justify-start md:justify-end">
                  <button
                    type="button"
                    onClick={() => handleDeleteLand(land.id)}
                    disabled={deleteLandMutation.isPending}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deleteLandMutation.isPending ? "Deleting..." : "Delete"}
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

export default FarmerLandsPage;
