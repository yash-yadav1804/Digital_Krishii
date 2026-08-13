import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import StatusBadge from "../components/common/StatusBadge.jsx";
import {
  cancelContractRequest,
  getSentContractRequests,
} from "../api/contractApi";
import EmptyState from "../components/common/EmptyState.jsx";

const BuyerSentContractsPage = () => {
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const queryClient = useQueryClient();

  const {
    data: requestsResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["buyer-contract-requests"],
    queryFn: getSentContractRequests,
  });

  const cancelRequestMutation = useMutation({
    mutationFn: cancelContractRequest,

    onSuccess: async () => {
      setActionError("");
      setSuccessMessage("Contract request cancelled successfully.");

      await queryClient.invalidateQueries({
        queryKey: ["buyer-contract-requests"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["buyer-lands"],
      });
    },

    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to cancel contract request.";

      setSuccessMessage("");
      setActionError(message);
    },
  });

  const requests = requestsResponse?.data || [];

  const errorMessage =
    error?.response?.data?.message || "Failed to load sent contract requests.";

  const handleCancelRequest = (requestId) => {
    const shouldCancel = window.confirm(
      "Are you sure you want to cancel this contract request?",
    );

    if (!shouldCancel) {
      return;
    }

    setActionError("");
    setSuccessMessage("");
    cancelRequestMutation.mutate(requestId);
  };

  return (
    <DashboardLayout title="Sent Contracts">
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
            Sent Contract Requests
          </h3>

          <p className="text-sm text-slate-500">
            Track your contract farming requests sent to farmers.
          </p>
        </div>

        {isLoading ? (
          <div className="px-6 py-10 text-center text-slate-500">
            Loading sent contract requests...
          </div>
        ) : requests.length === 0 ? (
          <EmptyState
            icon="📑"
            title="No contract requests sent yet"
            description="Browse available land listings and send your first contract farming proposal to a farmer."
            actionLabel="Browse Lands"
            actionTo="/buyer/lands"
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
                      Farmer: {request.farmer?.firstName}{" "}
                      {request.farmer?.lastName}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Template:{" "}
                      {request.template?.title ||
                        request.template?.type?.replaceAll("_", " ")}
                    </p>
                  </div>

                  {request.status === "PENDING" && (
                    <button
                      type="button"
                      disabled={cancelRequestMutation.isPending}
                      onClick={() => handleCancelRequest(request.id)}
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {cancelRequestMutation.isPending
                        ? "Cancelling..."
                        : "Cancel Request"}
                    </button>
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

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs text-slate-500">Start Date</p>
                    <p className="font-semibold text-slate-900">
                      {request.startDate
                        ? new Date(request.startDate).toLocaleDateString(
                            "en-IN",
                          )
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">End Date</p>
                    <p className="font-semibold text-slate-900">
                      {request.endDate
                        ? new Date(request.endDate).toLocaleDateString("en-IN")
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {request.message && (
                  <div className="mt-5 rounded-lg bg-slate-50 px-4 py-3">
                    <p className="text-xs font-medium text-slate-500">
                      Your Message
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

export default BuyerSentContractsPage;
