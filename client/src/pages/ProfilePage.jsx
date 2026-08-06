import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import { getUserProfile, updateUserProfile } from "../api/profileApi";

const ProfilePage = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const queryClient = useQueryClient();

  const {
    data: profileResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfile,
  });

  const userProfile = profileResponse?.data || profileResponse?.user || null;

  const updateProfileMutation = useMutation({
    mutationFn: updateUserProfile,

    onSuccess: async () => {
      setActionError("");
      setSuccessMessage("Profile updated successfully.");

      await queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["farmer-dashboard"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["buyer-dashboard"],
      });
    },

    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to update profile.";

      setSuccessMessage("");
      setActionError(message);
    },
  });

  const errorMessage =
    error?.response?.data?.message || "Failed to load profile.";

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const profileData = {
      firstName: form.get("firstName")?.trim() || "",
      lastName: form.get("lastName")?.trim() || "",
      phone: form.get("phone")?.trim() || "",
      address: form.get("address")?.trim() || "",
      district: form.get("district")?.trim() || "",
      state: form.get("state")?.trim() || "",
      pincode: form.get("pincode")?.trim() || "",
    };

    setSuccessMessage("");
    setActionError("");

    updateProfileMutation.mutate(profileData);
  };

  return (
    <DashboardLayout title="Profile">
      {successMessage && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {(isError || actionError) && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError || errorMessage}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-1">
          {isLoading ? (
            <p className="text-sm text-slate-500">Loading profile...</p>
          ) : (
            <>
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-700">
                {userProfile?.firstName?.charAt(0) || "U"}
              </div>

              <h3 className="mt-4 text-xl font-bold text-slate-900">
                {userProfile?.firstName} {userProfile?.lastName}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {userProfile?.email}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {userProfile?.roles?.map((role) => (
                  <span
                    key={role}
                    className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200"
                  >
                    {role}
                  </span>
                ))}
              </div>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Account Status
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {userProfile?.isBlocked ? "Blocked" : "Active"}
                </p>
              </div>
            </>
          )}
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Edit Profile
            </h3>

            <p className="text-sm text-slate-500">
              Update your personal and location details.
            </p>
          </div>

          {isLoading ? (
            <div className="py-10 text-center text-slate-500">
              Loading profile form...
            </div>
          ) : (
            <form
              key={userProfile?.updatedAt || userProfile?.id}
              onSubmit={handleSubmit}
              className="grid gap-5 md:grid-cols-2"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  First Name
                </label>

                <input
                  type="text"
                  name="firstName"
                  defaultValue={userProfile?.firstName || ""}
                  required
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
                  defaultValue={userProfile?.lastName || ""}
                  required
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  defaultValue={userProfile?.phone || ""}
                  placeholder="9876543210"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  defaultValue={userProfile?.pincode || ""}
                  placeholder="462021"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  defaultValue={userProfile?.address || ""}
                  placeholder="Near Indrapuri, Bhopal"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  District
                </label>

                <input
                  type="text"
                  name="district"
                  defaultValue={userProfile?.district || ""}
                  placeholder="Bhopal"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  defaultValue={userProfile?.state || ""}
                  placeholder="Madhya Pradesh"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="rounded-lg bg-green-700 px-6 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-green-400"
                >
                  {updateProfileMutation.isPending
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
