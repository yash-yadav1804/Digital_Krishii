import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import StatusBadge from "../components/common/StatusBadge.jsx";
import ContractRequestModal from "../components/contracts/ContractRequestModal.jsx";
import { getLands } from "../api/landApi";

const BuyerLandsPage = () => {
  const [page, setPage] = useState(1);
  const [district, setDistrict] = useState("");
  const [selectedLand, setSelectedLand] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const queryClient = useQueryClient();

  const limit = 6;

  const {
    data: landsResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["buyer-lands", page, district],
    queryFn: () =>
      getLands({
        page,
        limit,
        listingType: "CONTRACT_FARMING",
        status: "AVAILABLE",
        district: district || undefined,
      }),
  });

  const lands = landsResponse?.data || [];
  const totalPages = landsResponse?.totalPages || 1;

  const errorMessage =
    error?.response?.data?.message || "Failed to load available lands.";

  const handleDistrictChange = (event) => {
    setDistrict(event.target.value);
    setPage(1);
  };

  const handleRequestCreated = async () => {
    setSelectedLand(null);
    setSuccessMessage("Contract request sent successfully.");

    await queryClient.invalidateQueries({
      queryKey: ["buyer-lands"],
    });
  };

  return (
    <DashboardLayout title="Browse Lands">
      {selectedLand && (
        <ContractRequestModal
          land={selectedLand}
          onClose={() => setSelectedLand(null)}
          onRequestCreated={handleRequestCreated}
        />
      )}

      <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-slate-900">
              Available Contract Farming Lands
            </h3>

            <p className="text-sm text-slate-500">
              Browse farmer land listings and send contract requests.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Filter by District
            </label>

            <input
              type="text"
              value={district}
              onChange={handleDistrictChange}
              placeholder="Bhopal"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {isError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl bg-white px-6 py-10 text-center text-slate-500 shadow-sm ring-1 ring-slate-200">
          Loading available lands...
        </div>
      ) : lands.length === 0 ? (
        <div className="rounded-2xl bg-white px-6 py-10 text-center text-slate-500 shadow-sm ring-1 ring-slate-200">
          No available lands found.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {lands.map((land) => (
            <article
              key={land.id}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="mb-5 h-48 overflow-hidden rounded-xl bg-slate-100">
                {land.imageUrl ? (
                  <img
                    src={land.imageUrl}
                    alt={land.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    No image available
                  </div>
                )}
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {land.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {land.district}, {land.state}
                  </p>
                </div>

                <StatusBadge status={land.status} />
              </div>

              <p className="mt-4 text-sm text-slate-600">{land.description}</p>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-slate-500">Area</p>
                  <p className="font-semibold text-slate-900">
                    {land.area} {land.areaUnit}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Price</p>
                  <p className="font-semibold text-slate-900">
                    ₹{land.price} / {land.priceUnit?.replaceAll("_", " ")}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Farmer</p>
                  <p className="font-semibold text-slate-900">
                    {land.owner?.firstName} {land.owner?.lastName}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setSuccessMessage("");
                    setSelectedLand(land);
                  }}
                  className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
                >
                  Request Contract
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => setPage((prevPage) => prevPage - 1)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <p className="text-sm text-slate-600">
          Page {page} of {totalPages}
        </p>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => setPage((prevPage) => prevPage + 1)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </DashboardLayout>
  );
};

export default BuyerLandsPage;
