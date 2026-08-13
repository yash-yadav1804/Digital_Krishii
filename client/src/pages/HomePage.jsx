import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const getDashboardPath = (user) => {
  if (user?.roles?.includes("ADMIN")) return "/admin/dashboard";
  if (user?.roles?.includes("FARMER")) return "/farmer/dashboard";
  if (user?.roles?.includes("BUYER")) return "/buyer/dashboard";

  return "/login";
};

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <main className="min-h-screen bg-slate-100">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-5 py-12">
        <nav className="mb-12 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-800">Digital Krishii</h1>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to={getDashboardPath(user)}
                className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg border border-green-700 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </nav>

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <section>
            <p className="mb-4 inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              Contract Farming Platform
            </p>

            <h2 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
              Connect farmers and buyers through digital farming contracts.
            </h2>

            <p className="mt-5 max-w-xl text-lg text-slate-600">
              Digital Krishii helps farmers list lands and equipment, while
              buyers can browse lands, send contract requests, and manage
              farming agreements.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="rounded-lg bg-green-700 px-6 py-3 text-sm font-semibold text-white hover:bg-green-800"
              >
                Start Now
              </Link>

              <Link
                to="/login"
                className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Login to Account
              </Link>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="grid gap-4">
              <div className="rounded-2xl bg-green-50 p-5">
                <h3 className="text-lg font-bold text-green-800">
                  For Farmers
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  Add land listings, rent equipment, receive contract requests,
                  and manage buyer negotiations.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <h3 className="text-lg font-bold text-slate-900">For Buyers</h3>

                <p className="mt-2 text-sm text-slate-600">
                  Browse available farming lands, select contract templates, and
                  send contract farming proposals.
                </p>
              </div>

              <div className="rounded-2xl bg-yellow-50 p-5">
                <h3 className="text-lg font-bold text-yellow-800">For Admin</h3>

                <p className="mt-2 text-sm text-slate-600">
                  Manage users, monitor platform stats, and upload contract PDF
                  templates.
                </p>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-14 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="font-bold text-slate-900">Land Listings</h3>
            <p className="mt-2 text-sm text-slate-500">
              Farmers can list land for contract farming or rental use.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="font-bold text-slate-900">Equipment Rental</h3>
            <p className="mt-2 text-sm text-slate-500">
              Farmers can list tractors, tools, and machines for rental.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="font-bold text-slate-900">Digital Contracts</h3>
            <p className="mt-2 text-sm text-slate-500">
              Buyers can send contract requests using predefined templates.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
};

export default HomePage;
