import DashboardLayout from "../layouts/DashboardLayout";

const FarmerDashboard = () => {
  return (
    <DashboardLayout title="Farmer Dashboard">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Land Listings</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">0</h3>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Equipment Listings</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">0</h3>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Contract Requests</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">0</h3>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FarmerDashboard;
