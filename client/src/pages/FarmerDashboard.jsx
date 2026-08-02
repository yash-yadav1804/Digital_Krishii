import { useAuth } from "../hooks/useAuth";

const FarmerDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-green-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-8">
        <h1 className="text-3xl font-bold text-green-800">Farmer Dashboard</h1>

        <p className="mt-3 text-slate-600">
          Welcome, {user?.firstName} {user?.lastName}
        </p>

        <button
          onClick={logout}
          className="mt-6 rounded-lg bg-red-600 px-5 py-3 text-white font-semibold hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </main>
  );
};

export default FarmerDashboard;
