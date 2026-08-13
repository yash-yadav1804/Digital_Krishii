import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import BrandLogo from "../components/common/BrandLogo.jsx";
import { registerUser } from "../api/authApi";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const registerMutation = useMutation({
    mutationFn: registerUser,

    onSuccess: () => {
      setErrorMessage("");
      setSuccessMessage("Account created successfully. Please login.");

      setTimeout(() => {
        navigate("/login");
      }, 800);
    },

    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to create account.";

      setSuccessMessage("");
      setErrorMessage(message);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const password = form.get("password");
    const confirmPassword = form.get("confirmPassword");

    if (password !== confirmPassword) {
      setSuccessMessage("");
      setErrorMessage("Password and confirm password do not match.");
      return;
    }

    const userData = {
      firstName: form.get("firstName")?.trim(),
      lastName: form.get("lastName")?.trim(),
      email: form.get("email")?.trim(),
      password,
      role: form.get("role"),
    };

    setErrorMessage("");
    setSuccessMessage("");

    registerMutation.mutate(userData);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-slate-100 px-5 py-8">
      <section className="mx-auto grid min-h-[calc(100vh-64px)] max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-slate-200 lg:grid-cols-2">
        <div className="hidden bg-green-950 p-8 lg:block">
          <div className="flex h-full flex-col justify-between overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-green-900 to-emerald-700 p-8 text-white">
            <div>
              <p className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wide text-green-50 ring-1 ring-white/20">
                Join Digital Krishii
              </p>

              <h2 className="mt-5 text-4xl font-black leading-tight">
                Start your farming partnership journey.
              </h2>

              <p className="mt-4 text-sm leading-6 text-green-50">
                Farmers can list land and equipment. Buyers can discover
                contract farming opportunities and send structured proposals.
              </p>
            </div>

            <img
              src="/assets/farmer-buyer-connection.jpg"
              alt="Digital Krishii farmer buyer network"
              className="mt-8 rounded-3xl bg-white/10 object-contain shadow-2xl ring-1 ring-white/20"
            />

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-2xl font-black">Farmer</p>
                <p className="mt-2 text-xs font-semibold text-green-50">
                  List lands, equipment, and manage requests.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-2xl font-black">Buyer</p>
                <p className="mt-2 text-xs font-semibold text-green-50">
                  Browse lands and send contract proposals.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center p-8 md:p-12">
          <Link to="/" className="mb-8 inline-flex">
            <BrandLogo dark />
          </Link>

          <div>
            <p className="inline-flex rounded-full bg-green-100 px-4 py-2 text-xs font-bold uppercase tracking-wide text-green-700 ring-1 ring-green-200">
              Create Account
            </p>

            <h1 className="mt-5 text-4xl font-black text-slate-950">
              Register as a farmer or buyer.
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Create your account to access Digital Krishii’s contract farming,
              equipment rental, and notification workflows.
            </p>
          </div>

          {successMessage && (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-8 grid gap-5 md:grid-cols-2"
          >
            <div>
              <label className="block text-sm font-bold text-slate-700">
                First Name
              </label>

              <input
                type="text"
                name="firstName"
                required
                placeholder="Yash"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700">
                Last Name
              </label>

              <input
                type="text"
                name="lastName"
                required
                placeholder="Yadav"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                required
                placeholder="user@example.com"
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
                required
                minLength="6"
                placeholder="Minimum 6 characters"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                required
                minLength="6"
                placeholder="Repeat password"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700">
                Register As
              </label>

              <select
                name="role"
                required
                defaultValue="FARMER"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100"
              >
                <option value="FARMER">Farmer</option>
                <option value="BUYER">Buyer</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full rounded-xl bg-green-700 px-4 py-3 font-bold text-white shadow-sm hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-green-400"
              >
                {registerMutation.isPending ? "Creating..." : "Create Account"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-green-700 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default RegisterPage;
