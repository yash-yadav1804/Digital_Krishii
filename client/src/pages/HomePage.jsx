import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <section className="max-w-2xl bg-white rounded-2xl shadow-lg p-10 text-center">
        <h1 className="text-4xl font-bold text-green-800">Digital Krishii</h1>

        <p className="mt-4 text-slate-600">
          A contract farming platform connecting farmers and buyers through land
          listings, contract workflows, equipment rentals, notifications, and
          reviews.
        </p>

        <Link
          to="/login"
          className="inline-block mt-8 rounded-lg bg-green-700 px-6 py-3 text-white font-semibold hover:bg-green-800"
        >
          Login
        </Link>
      </section>
    </main>
  );
};

export default HomePage;
