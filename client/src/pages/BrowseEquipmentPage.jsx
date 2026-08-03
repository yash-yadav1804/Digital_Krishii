import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import StatusBadge from "../components/common/StatusBadge.jsx";
import RentalRequestModal from "../components/equipment/RentalRequestModal.jsx";
import { getEquipment } from "../api/equipmentApi";

const BrowseEquipmentPage = () => {
  const [page, setPage] = useState(1);
  const [district, setDistrict] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const queryClient = useQueryClient();

  const limit = 6;

  const {
    data: equipmentResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["browse-equipment", page, district],
    queryFn: () =>
      getEquipment({
        page,
        limit,
        status: "AVAILABLE",
        district: district || undefined,
      }),
  });

  const equipmentList = equipmentResponse?.data || [];
  const totalPages = equipmentResponse?.totalPages || 1;

  const errorMessage =
    error?.response?.data?.message || "Failed to load equipment listings.";

  const handleDistrictChange = (event) => {
    setDistrict(event.target.value);
    setPage(1);
  };

  const handleRequestCreated = async () => {
    setSelectedEquipment(null);
    setSuccessMessage("Rental request sent successfully.");

    await queryClient.invalidateQueries({
      queryKey: ["browse-equipment"],
    });

    await queryClient.invalidateQueries({
      queryKey: ["farmer-rental-requests"],
    });
  };

  return (
    <DashboardLayout title="Browse Equipment">
      {selectedEquipment && (
        <RentalRequestModal
          equipment={selectedEquipment}
          onClose={() => setSelectedEquipment(null)}
          onRequestCreated={handleRequestCreated}
        />
      )}

      <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-slate-900">
              Available Equipment
            </h3>

            <p className="text-sm text-slate-500">
              Browse equipment listings and send rental requests to owners.
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
          Loading equipment listings...
        </div>
      ) : equipmentList.length === 0 ? (
        <div className="rounded-2xl bg-white px-6 py-10 text-center text-slate-500 shadow-sm ring-1 ring-slate-200">
          No available equipment found.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {equipmentList.map((equipment) => (
            <article
              key={equipment.id}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {equipment.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {equipment.equipmentType}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {equipment.district}, {equipment.state}
                  </p>
                </div>

                <StatusBadge status={equipment.status} />
              </div>

              <p className="mt-4 text-sm text-slate-600">
                {equipment.description}
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-slate-500">Brand</p>
                  <p className="font-semibold text-slate-900">
                    {equipment.brand || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Model</p>
                  <p className="font-semibold text-slate-900">
                    {equipment.modelName || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Rent</p>
                  <p className="font-semibold text-slate-900">
                    ₹{equipment.rentPrice} /{" "}
                    {equipment.priceUnit?.replaceAll("_", " ")}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs text-slate-500">Owner</p>
                <p className="font-semibold text-slate-900">
                  {equipment.owner?.firstName} {equipment.owner?.lastName}
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setSuccessMessage("");
                    setSelectedEquipment(equipment);
                  }}
                  className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
                >
                  Request Rental
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

export default BrowseEquipmentPage;
