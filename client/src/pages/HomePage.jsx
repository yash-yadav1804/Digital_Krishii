import { Link } from "react-router-dom";
import BrandLogo from "../components/common/BrandLogo.jsx";
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
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-slate-100">
      <section className="mx-auto max-w-7xl px-5 py-6">
        <nav className="flex items-center justify-between rounded-3xl bg-white/80 px-5 py-4 shadow-sm ring-1 ring-slate-200 backdrop-blur">
          <BrandLogo dark />

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to={getDashboardPath(user)}
                className="rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white hover:bg-green-800"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl border border-green-700 px-5 py-3 text-sm font-bold text-green-700 hover:bg-green-50"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white hover:bg-green-800"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </nav>

        <section className="grid min-h-[calc(100vh-120px)] items-center gap-12 py-14 lg:grid-cols-2">
          <div>
            <p className="mb-5 inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-bold uppercase tracking-wide text-green-700 ring-1 ring-green-200">
              Contract Farming + Equipment Rental Platform
            </p>

            <h1 className="text-4xl font-black leading-tight text-slate-950 md:text-6xl">
              Empowering Farmers, Bridging Markets.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Digital Krishii connects farmers and buyers through transparent
              contract farming workflows, land listings, equipment rentals,
              notifications, and admin-managed trust controls.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="rounded-xl bg-green-700 px-7 py-4 text-sm font-bold text-white shadow-sm hover:bg-green-800"
              >
                Start as Farmer or Buyer
              </Link>

              <Link
                to="/login"
                className="rounded-xl border border-slate-300 bg-white px-7 py-4 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                Login to Platform
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-3xl font-black text-green-800">3</p>
                <p className="mt-1 text-sm font-semibold text-slate-600">
                  User Roles
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-3xl font-black text-green-800">2</p>
                <p className="mt-1 text-sm font-semibold text-slate-600">
                  Core Markets
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-3xl font-black text-green-800">100%</p>
                <p className="mt-1 text-sm font-semibold text-slate-600">
                  Digital Flow
                </p>
              </div>
            </div>
          </div>

          <section className="rounded-[2rem] bg-green-50 p-4 shadow-2xl ring-1 ring-slate-200">
            <img
              src="/assets/farmer-buyer-connection.jpg"
              alt="Digital Krishii farmer and buyer connection"
              className="w-full rounded-[1.5rem] object-contain"
            />

            <div className="mt-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm font-bold uppercase tracking-wide text-green-700">
                Connected Farming Network
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-950">
                Farmers, buyers, contracts, and equipment in one digital
                platform.
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Digital Krishii bridges the gap between agricultural producers
                and reliable market opportunities.
              </p>
            </div>
          </section>
        </section>

        <section className="grid gap-6 py-10 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-2xl">
              🌾
            </div>

            <h3 className="mt-5 text-xl font-black text-slate-950">
              For Farmers
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              List lands, upload land images, rent equipment, receive contract
              requests, approve rentals, and manage notifications.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
              🧑‍💼
            </div>

            <h3 className="mt-5 text-xl font-black text-slate-950">
              For Buyers
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Browse available farming lands, view farmer details, select
              contract templates, and track proposal status.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-2xl">
              🛡️
            </div>

            <h3 className="mt-5 text-xl font-black text-slate-950">
              For Admin
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Monitor users, manage blocked accounts, view platform stats, and
              upload contract PDF documents.
            </p>
          </div>
        </section>

        <section className="my-10 rounded-[2rem] bg-green-950 p-8 text-white shadow-sm">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-green-200">
                Why Digital Krishii?
              </p>

              <h2 className="mt-3 text-3xl font-black">
                Built for trust, transparency, and faster agricultural
                collaboration.
              </h2>

              <p className="mt-4 text-sm leading-6 text-green-50">
                The platform brings land listings, equipment rentals, digital
                contract requests, notifications, and admin governance into one
                structured workflow.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
                <p className="text-2xl">📄</p>
                <h3 className="mt-3 font-bold">Digital Contracts</h3>
                <p className="mt-2 text-sm text-green-50">
                  Buyers send structured contract requests to farmers.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
                <p className="text-2xl">🚜</p>
                <h3 className="mt-3 font-bold">Equipment Rental</h3>
                <p className="mt-2 text-sm text-green-50">
                  Farmers can list and rent farming equipment.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
                <p className="text-2xl">🔔</p>
                <h3 className="mt-3 font-bold">Smart Notifications</h3>
                <p className="mt-2 text-sm text-green-50">
                  Users stay updated about requests and actions.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
                <p className="text-2xl">👥</p>
                <h3 className="mt-3 font-bold">Admin Governance</h3>
                <p className="mt-2 text-sm text-green-50">
                  Admin can monitor platform health and user access.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="mb-8 text-center">
            <p className="text-sm font-bold uppercase tracking-wide text-green-700">
              Platform Workflow
            </p>

            <h2 className="mt-3 text-3xl font-black text-slate-950">
              Simple journey from listing to agreement
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-4">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm font-black text-green-700">01</p>
              <h3 className="mt-3 font-black text-slate-950">Register</h3>
              <p className="mt-2 text-sm text-slate-600">
                Farmer or buyer creates account.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm font-black text-green-700">02</p>
              <h3 className="mt-3 font-black text-slate-950">List or Browse</h3>
              <p className="mt-2 text-sm text-slate-600">
                Farmers list lands and buyers browse opportunities.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm font-black text-green-700">03</p>
              <h3 className="mt-3 font-black text-slate-950">Request</h3>
              <p className="mt-2 text-sm text-slate-600">
                Buyer sends contract proposal or rental request.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm font-black text-green-700">04</p>
              <h3 className="mt-3 font-black text-slate-950">Approve</h3>
              <p className="mt-2 text-sm text-slate-600">
                Farmer accepts or rejects and both users are notified.
              </p>
            </div>
          </div>
        </section>

        <section className="my-10 rounded-[2rem] bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <h2 className="text-3xl font-black text-slate-950">
            Ready to build better farming partnerships?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600">
            Join Digital Krishii to manage contract farming opportunities,
            equipment rentals, and agriculture workflows in one platform.
          </p>

          <div className="mt-7 flex justify-center gap-4">
            <Link
              to="/register"
              className="rounded-xl bg-green-700 px-7 py-4 text-sm font-bold text-white hover:bg-green-800"
            >
              Create Account
            </Link>

            <Link
              to="/login"
              className="rounded-xl border border-slate-300 px-7 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Login
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
};

export default HomePage;
