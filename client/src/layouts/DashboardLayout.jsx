import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const roleLinks = {
  FARMER: [
    { label: "Dashboard", path: "/farmer/dashboard" },
    { label: "My Lands", path: "/farmer/lands" },
    { label: "My Equipment", path: "/farmer/equipment" },
    { label: "Contract Requests", path: "/farmer/contracts" },
    { label: "Rental Requests", path: "/farmer/rentals" },
    { label: "Notifications", path: "/notifications" },
    { label: "Profile", path: "/profile" },
  ],
  BUYER: [
    { label: "Dashboard", path: "/buyer/dashboard" },
    { label: "Browse Lands", path: "/buyer/lands" },
    { label: "Sent Contracts", path: "/buyer/contracts" },
    { label: "Notifications", path: "/notifications" },
    { label: "Profile", path: "/profile" },
  ],
  ADMIN: [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Stats", path: "/admin/stats" },
    { label: "Upload PDFs", path: "/admin/uploads" },
  ],
};

const DashboardLayout = ({ title, children }) => {
  const { user, logout } = useAuth();

  const primaryRole = user?.roles?.[0];
  const links = roleLinks[primaryRole] || [];

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed left-0 top-0 h-screen w-64 bg-green-900 text-white">
        <div className="px-6 py-6 border-b border-green-800">
          <h1 className="text-2xl font-bold">Digital Krishii</h1>
          <p className="mt-1 text-sm text-green-200">{primaryRole}</p>
        </div>

        <nav className="px-4 py-6 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-white text-green-900"
                    : "text-green-100 hover:bg-green-800"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="ml-64">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500">
              Welcome, {user?.firstName} {user?.lastName}
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Logout
          </button>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
