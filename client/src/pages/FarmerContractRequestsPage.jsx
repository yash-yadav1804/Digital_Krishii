import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import StatusBadge from "../components/common/StatusBadge.jsx";
import {
  getReceivedContractRequests,
  updateContractRequestStatus,
} from "../api/contractApi";
import EmptyState from "../components/common/EmptyState.jsx";

const FarmerContractRequestsPage = () => {
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const queryClient = useQueryClient();

  const {
    data: requestsResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["farmer-contract-requests"],
    queryFn: getReceivedContractRequests,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ requestId, status }) =>
      updateContractRequestStatus(requestId, status),

    onSuccess: async (_, variables) => {
      setActionError("");
      setSuccessMessage(
        `Contract request ${variables.status.toLowerCase()} successfully.`,
      );

      await queryClient.invalidateQueries({
        queryKey: ["farmer-contract-requests"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["farmer-lands"],
      });
    },

    onError: (error) => {
      const message =
        error.response?.data?.message ||
        "Failed to update contract request status.";

      setSuccessMessage("");
      setActionError(message);
    },
  });

  const requests = requestsResponse?.data || [];

  const errorMessage =
    error?.response?.data?.message || "Failed to load contract requests.";

  const handleUpdateStatus = (requestId, status) => {
    const shouldUpdate = window.confirm(
      `Are you sure you want to ${status.toLowerCase()} this contract request?`,
    );

    if (!shouldUpdate) {
      return;
    }

    updateStatusMutation.mutate({
      requestId,
      status,
    });
  };

  return (
    <DashboardLayout title="Contract Requests">
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
            Received Contract Requests
          </h3>

          <p className="text-sm text-slate-500">
            Review buyer contract requests for your land listings.
          </p>
        </div>

        {isLoading ? (
          <div className="px-6 py-10 text-center text-slate-500">
            Loading contract requests...
          </div>
        ) : requests.length === 0 ? (
          <EmptyState
            icon="📄"
            title="No contract requests yet"
            description="When buyers send contract farming requests for your land listings, they will appear here for review."
          />
        ) : (
          <div className="divide-y divide-slate-200">
            {requests.map((request) => (
              <article key={request.id} className="px-6 py-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="text-lg font-semibold text-slate-900">
                        {request.land?.title}
                      </h4>

                      <StatusBadge status={request.status} />
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      Buyer: {request.buyer?.firstName}{" "}
                      {request.buyer?.lastName}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Template:{" "}
                      {request.template?.title ||
                        request.template?.type?.replaceAll("_", " ")}
                    </p>
                  </div>

                  {request.status === "PENDING" && (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        disabled={updateStatusMutation.isPending}
                        onClick={() =>
                          handleUpdateStatus(request.id, "ACCEPTED")
                        }
                        className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-green-400"
                      >
                        Accept
                      </button>

                      <button
                        type="button"
                        disabled={updateStatusMutation.isPending}
                        onClick={() =>
                          handleUpdateStatus(request.id, "REJECTED")
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
                    <p className="text-xs text-slate-500">Crop</p>
                    <p className="font-semibold text-slate-900">
                      {request.cropName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Quantity</p>
                    <p className="font-semibold text-slate-900">
                      {request.quantity}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Proposed Price</p>
                    <p className="font-semibold text-slate-900">
                      ₹{request.proposedPrice}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Land Location</p>
                    <p className="font-semibold text-slate-900">
                      {request.land?.district}, {request.land?.state}
                    </p>
                  </div>
                </div>

                {request.message && (
                  <div className="mt-5 rounded-lg bg-slate-50 px-4 py-3">
                    <p className="text-xs font-medium text-slate-500">
                      Buyer Message
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      {request.message}
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

export default FarmerContractRequestsPage;
