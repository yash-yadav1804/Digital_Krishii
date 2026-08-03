import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import StatusBadge from "../components/common/StatusBadge.jsx";
import {
  getReceivedEquipmentRentalRequests,
  updateEquipmentRentalStatus,
} from "../api/equipmentApi";

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const FarmerRentalRequestsPage = () => {
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const queryClient = useQueryClient();

  const {
    data: rentalsResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["farmer-rental-requests"],
    queryFn: getReceivedEquipmentRentalRequests,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ rentalId, status }) =>
      updateEquipmentRentalStatus(rentalId, status),

    onSuccess: async (_, variables) => {
      setActionError("");
      setSuccessMessage(
        `Rental request ${variables.status.toLowerCase()} successfully.`,
      );

      await queryClient.invalidateQueries({
        queryKey: ["farmer-rental-requests"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["farmer-equipment"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },

    onError: (error) => {
      const message =
        error.response?.data?.message ||
        "Failed to update rental request status.";

      setSuccessMessage("");
      setActionError(message);
    },
  });

  const rentals = rentalsResponse?.data || [];

  const errorMessage =
    error?.response?.data?.message || "Failed to load rental requests.";

  const handleUpdateStatus = (rentalId, status) => {
    const shouldUpdate = window.confirm(
      `Are you sure you want to ${status.toLowerCase()} this rental request?`,
    );

    if (!shouldUpdate) {
      return;
    }

    setActionError("");
    setSuccessMessage("");

    updateStatusMutation.mutate({
      rentalId,
      status,
    });
  };

  return (
    <DashboardLayout title="Rental Requests">
      {successMessage && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {(isError || actionError) && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError || errorMessage}
        </div>
      )}

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Received Rental Requests
          </h3>

          <p className="text-sm text-slate-500">
            Review rental requests received for your equipment listings.
          </p>
        </div>

        {isLoading ? (
          <div className="px-6 py-10 text-center text-slate-500">
            Loading rental requests...
          </div>
        ) : rentals.length === 0 ? (
          <div className="px-6 py-10 text-center text-slate-500">
            No rental requests found.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {rentals.map((rental) => (
              <article key={rental.id} className="px-6 py-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="text-lg font-semibold text-slate-900">
                        {rental.equipment?.title}
                      </h4>

                      <StatusBadge status={rental.status} />
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      Requested by: {rental.requester?.firstName}{" "}
                      {rental.requester?.lastName}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Equipment Type: {rental.equipment?.equipmentType}
                    </p>
                  </div>

                  {rental.status === "PENDING" && (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        disabled={updateStatusMutation.isPending}
                        onClick={() =>
                          handleUpdateStatus(rental.id, "APPROVED")
                        }
                        className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-green-400"
                      >
                        Approve
                      </button>

                      <button
                        type="button"
                        disabled={updateStatusMutation.isPending}
                        onClick={() =>
                          handleUpdateStatus(rental.id, "REJECTED")
                        }
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-xs text-slate-500">Start Date</p>
                    <p className="font-semibold text-slate-900">
                      {formatDate(rental.startDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">End Date</p>
                    <p className="font-semibold text-slate-900">
                      {formatDate(rental.endDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Rent Price</p>
                    <p className="font-semibold text-slate-900">
                      ₹{rental.equipment?.rentPrice} /{" "}
                      {rental.equipment?.priceUnit?.replaceAll("_", " ")}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Location</p>
                    <p className="font-semibold text-slate-900">
                      {rental.equipment?.district}, {rental.equipment?.state}
                    </p>
                  </div>
                </div>

                {rental.message && (
                  <div className="mt-5 rounded-lg bg-slate-50 px-4 py-3">
                    <p className="text-xs font-medium text-slate-500">
                      Request Message
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {rental.message}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FarmerRentalRequestsPage;
