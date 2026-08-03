import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getMyLands } from "../api/landApi";

const FarmerLandsPage = () => {
  const [lands, setLands] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchMyLands = async () => {
      try {
        const response = await getMyLands();
        setLands(response.data || []);
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to load land listings.";

        setErrorMessage(message);
      }
    };

    fetchMyLands();
  }, []);

  return (
    <DashboardLayout title="My Lands">
      {errorMessage && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
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

          <button className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800">
            Add Land
          </button>
        </div>

        {lands.length === 0 ? (
          <div className="px-6 py-10 text-center text-slate-500">
            No land listings found.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {lands.map((land) => (
              <article
                key={land.id}
                className="grid gap-4 px-6 py-5 md:grid-cols-4"
              >
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-slate-900">{land.title}</h4>

                  <p className="mt-1 text-sm text-slate-500">
                    {land.district}, {land.state}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Area</p>
                  <p className="font-medium text-slate-900">
                    {land.area} {land.areaUnit}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    {land.status}
                  </span>
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
