import DashboardLayout from "../layouts/DashboardLayout";

const AdminDashboard = () => {
  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Users</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">0</h3>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Farmers</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">0</h3>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Buyers</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">0</h3>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Lands</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">0</h3>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
