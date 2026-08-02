import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <section className="max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-red-600">Unauthorized</h1>

        <p className="mt-3 text-slate-600">
          You do not have permission to access this page.
        </p>

        <Link
          to="/login"
          className="inline-block mt-6 rounded-lg bg-green-700 px-5 py-3 text-white font-semibold hover:bg-green-800"
        >
          Go to Login
        </Link>
      </section>
    </main>
  );
};

export default UnauthorizedPage;
