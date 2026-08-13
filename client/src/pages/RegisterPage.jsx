import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
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
      roles: [form.get("role")],
    };

    setErrorMessage("");
    setSuccessMessage("");

    registerMutation.mutate(userData);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-green-800">Create Account</h1>

          <p className="mt-2 text-sm text-slate-500">
            Join Digital Krishii as a farmer or buyer.
          </p>
        </div>

        {successMessage && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              First Name
            </label>

            <input
              type="text"
              name="firstName"
              required
              placeholder="Yash"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Last Name
            </label>

            <input
              type="text"
              name="lastName"
              required
              placeholder="Yadav"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              required
              placeholder="user@example.com"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              required
              minLength="6"
              placeholder="Minimum 6 characters"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              required
              minLength="6"
              placeholder="Repeat password"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              Register As
            </label>

            <select
              name="role"
              required
              defaultValue="FARMER"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            >
              <option value="FARMER">Farmer</option>
              <option value="BUYER">Buyer</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-green-400"
            >
              {registerMutation.isPending ? "Creating..." : "Create Account"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-green-700 hover:underline"
          >
            Login
          </Link>
        </p>
      </section>
    </main>
  );
};

export default RegisterPage;
