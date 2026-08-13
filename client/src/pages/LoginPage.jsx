import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandLogo from "../components/common/BrandLogo.jsx";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getDashboardPath = (roles = []) => {
    if (roles.includes("ADMIN")) return "/admin/dashboard";
    if (roles.includes("FARMER")) return "/farmer/dashboard";
    if (roles.includes("BUYER")) return "/buyer/dashboard";

    return "/";
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const loggedInUser = await login(formData);
      const redirectPath = getDashboardPath(loggedInUser.roles);

      navigate(redirectPath, {
        replace: true,
      });
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-slate-100 px-5 py-8">
      <section className="mx-auto grid min-h-[calc(100vh-64px)] max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-slate-200 lg:grid-cols-2">
        <div className="flex flex-col justify-center p-8 md:p-12">
          <Link to="/" className="mb-10 inline-flex">
            <BrandLogo dark />
          </Link>

          <div>
            <p className="inline-flex rounded-full bg-green-100 px-4 py-2 text-xs font-bold uppercase tracking-wide text-green-700 ring-1 ring-green-200">
              Welcome Back
            </p>

            <h1 className="mt-5 text-4xl font-black text-slate-950">
              Login to your Digital Krishii account.
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Manage land listings, equipment rentals, contract requests,
              notifications, and platform workflows from your dashboard.
            </p>
          </div>

          {errorMessage && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="yash@test.com"
                required
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="123456"
                required
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-green-700 px-4 py-3 font-bold text-white shadow-sm hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-green-400"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-green-700 hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>

        <div className="hidden bg-green-950 p-8 lg:block">
          <div className="flex h-full flex-col justify-between overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-green-900 to-emerald-700 p-8 text-white">
            <div>
              <p className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wide text-green-50 ring-1 ring-white/20">
                Contract Farming Platform
              </p>

              <h2 className="mt-5 text-4xl font-black leading-tight">
                Building trust between farmers and buyers.
              </h2>

              <p className="mt-4 text-sm leading-6 text-green-50">
                Digital Krishii brings contract farming, equipment rentals,
                notifications, and admin governance into one connected platform.
              </p>
            </div>

            <img
              src="/assets/farmer-buyer-connection.jpg"
              alt="Digital Krishii platform preview"
              className="mt-8 rounded-3xl bg-white/10 object-contain shadow-2xl ring-1 ring-white/20"
            />

            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-2xl font-black">🌾</p>
                <p className="mt-2 text-xs font-semibold text-green-50">
                  Land Listings
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-2xl font-black">📄</p>
                <p className="mt-2 text-xs font-semibold text-green-50">
                  Contracts
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-2xl font-black">🚜</p>
                <p className="mt-2 text-xs font-semibold text-green-50">
                  Rentals
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
