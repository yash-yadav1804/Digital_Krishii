import { useState } from "react";
import { NavLink } from "react-router-dom";
import BrandLogo from "../components/common/BrandLogo.jsx";
import { useAuth } from "../hooks/useAuth";

const roleLinks = {
  FARMER: [
    { label: "Dashboard", path: "/farmer/dashboard", icon: "🏠" },
    { label: "My Lands", path: "/farmer/lands", icon: "🌾" },
    { label: "My Equipment", path: "/farmer/equipment", icon: "🚜" },
    {
      label: "Browse Equipment",
      path: "/farmer/equipment/browse",
      icon: "🔍",
    },
    { label: "Contract Requests", path: "/farmer/contracts", icon: "📄" },
    { label: "Rental Requests", path: "/farmer/rentals", icon: "📦" },
    { label: "Notifications", path: "/notifications", icon: "🔔" },
    { label: "Profile", path: "/profile", icon: "👤" },
  ],

  BUYER: [
    { label: "Dashboard", path: "/buyer/dashboard", icon: "🏠" },
    { label: "Browse Lands", path: "/buyer/lands", icon: "🌾" },
    { label: "Sent Contracts", path: "/buyer/contracts", icon: "📄" },
    { label: "Notifications", path: "/notifications", icon: "🔔" },
    { label: "Profile", path: "/profile", icon: "👤" },
  ],

  ADMIN: [
    { label: "Dashboard", path: "/admin/dashboard", icon: "🏠" },
    { label: "Users", path: "/admin/users", icon: "👥" },
    { label: "Stats", path: "/admin/stats", icon: "📊" },
    { label: "Upload PDFs", path: "/admin/uploads", icon: "📁" },
  ],
};

const roleLabels = {
  FARMER: "Farmer Workspace",
  BUYER: "Buyer Workspace",
  ADMIN: "Admin Console",
  USER: "User Workspace",
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

  const initials =
    `${user?.firstName?.charAt(0) || ""}${user?.lastName?.charAt(0) || ""}` ||
    "U";

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
          className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 transform flex-col bg-gradient-to-b from-green-950 via-green-900 to-green-800 text-white shadow-xl transition-transform duration-200 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/10 px-5 py-6">
          <BrandLogo />

          <div className="mt-5 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-100">
              {roleLabels[primaryRole]}
            </p>

            <p className="mt-1 text-sm font-semibold text-white">{fullName}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-5">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                  isActive
                    ? "bg-white text-green-950 shadow-sm"
                    : "text-green-50 hover:bg-white/10"
                }`
              }
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-base group-hover:bg-white/15">
                {link.icon}
              </span>

              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-100">
              Need attention?
            </p>

            <p className="mt-1 text-sm text-green-50">
              Check notifications and pending requests regularly.
            </p>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-5 py-4 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 lg:hidden"
              >
                Menu
              </button>

              <div>
                <h2 className="text-xl font-black text-slate-950">{title}</h2>

                <p className="text-sm text-slate-500">Welcome, {fullName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-100 text-sm font-black text-green-800">
                  {initials}
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">{fullName}</p>

                  <p className="text-xs font-medium text-slate-500">
                    {primaryRole}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="px-5 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
