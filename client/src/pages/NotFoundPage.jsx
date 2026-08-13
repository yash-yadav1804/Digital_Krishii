import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const getDashboardPath = (user) => {
  if (user?.roles?.includes("ADMIN")) return "/admin/dashboard";
  if (user?.roles?.includes("FARMER")) return "/farmer/dashboard";
  if (user?.roles?.includes("BUYER")) return "/buyer/dashboard";

  return "/login";
};

const NotFoundPage = () => {
  const { user } = useAuth();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
          404 Error
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Page not found
        </h1>

        <p className="mt-3 text-sm text-slate-500">
          The page you are trying to open does not exist or the route has not
          been added yet.
        </p>

        <Link
          to={getDashboardPath(user)}
          className="mt-6 inline-flex rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
        >
          Go to Dashboard
        </Link>
      </section>
    </main>
  );
};

export default NotFoundPage;
