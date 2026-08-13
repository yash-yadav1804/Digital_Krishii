import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const roleLinks = {
  FARMER: [
    { label: "Dashboard", path: "/farmer/dashboard" },
    { label: "My Lands", path: "/farmer/lands" },
    { label: "My Equipment", path: "/farmer/equipment" },
    { label: "Browse Equipment", path: "/farmer/equipment/browse" },
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

const getPrimaryRole = (user) => {
  if (user?.roles?.includes("ADMIN")) return "ADMIN";
  if (user?.roles?.includes("FARMER")) return "FARMER";
  if (user?.roles?.includes("BUYER")) return "BUYER";

  return "USER";
};

const DashboardLayout = ({ title, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { user, logout } = useAuth();

  const primaryRole = getPrimaryRole(user);
  const links = roleLinks[primaryRole] || [];

  const fullName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User";

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={closeSidebar}
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-green-900 text-white transition-transform duration-200 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-green-800 px-6 py-6">
          <h1 className="text-2xl font-bold">Digital Krishii</h1>

          <p className="mt-1 text-sm font-medium text-green-100">
            {primaryRole}
          </p>
        </div>

        <nav className="space-y-2 px-4 py-6">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-white text-green-900 shadow-sm"
                    : "text-green-50 hover:bg-green-800"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-4 px-5 py-4 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 lg:hidden"
              >
                Menu
              </button>

              <div>
                <h2 className="text-xl font-bold text-slate-900">{title}</h2>

                <p className="text-sm text-slate-500">Welcome, {fullName}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="px-5 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
