import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import { blockUser, getAdminUsers, unblockUser } from "../api/adminApi";

const formatRoles = (roles = []) => {
  return roles.join(", ");
};

const AdminUsersPage = () => {
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const queryClient = useQueryClient();

  const limit = 10;

  const {
    data: usersResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-users", page],
    queryFn: () => getAdminUsers({ page, limit }),
  });

  const blockUserMutation = useMutation({
    mutationFn: blockUser,

    onSuccess: async () => {
      setActionError("");
      setSuccessMessage("User blocked successfully.");

      await queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["admin-stats"],
      });
    },

    onError: (error) => {
      const message = error.response?.data?.message || "Failed to block user.";

      setSuccessMessage("");
      setActionError(message);
    },
  });

  const unblockUserMutation = useMutation({
    mutationFn: unblockUser,

    onSuccess: async () => {
      setActionError("");
      setSuccessMessage("User unblocked successfully.");

      await queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["admin-stats"],
      });
    },

    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to unblock user.";

      setSuccessMessage("");
      setActionError(message);
    },
  });

  const users = usersResponse?.data || [];
  const totalPages = usersResponse?.totalPages || 1;

  const errorMessage =
    error?.response?.data?.message || "Failed to load users.";

  const handleBlockUser = (user) => {
    const shouldBlock = window.confirm(
      `Are you sure you want to block ${user.firstName} ${user.lastName}?`,
    );

    if (!shouldBlock) {
      return;
    }

    setActionError("");
    setSuccessMessage("");
    blockUserMutation.mutate(user.id);
  };

  const handleUnblockUser = (user) => {
    const shouldUnblock = window.confirm(
      `Are you sure you want to unblock ${user.firstName} ${user.lastName}?`,
    );

    if (!shouldUnblock) {
      return;
    }

    setActionError("");
    setSuccessMessage("");
    unblockUserMutation.mutate(user.id);
  };

  const isActionPending =
    blockUserMutation.isPending || unblockUserMutation.isPending;

  return (
    <DashboardLayout title="Users">
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

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Platform Users
          </h3>

          <p className="text-sm text-slate-500">
            Manage farmers, buyers, and admin accounts.
          </p>
        </div>

        {isLoading ? (
          <div className="px-6 py-10 text-center text-slate-500">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="px-6 py-10 text-center text-slate-500">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Roles</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {users.map((user) => (
                  <tr key={user.id} className="text-sm">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {user.firstName} {user.lastName}
                        </p>

                        <p className="text-xs text-slate-400">ID: {user.id}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-600">{user.email}</td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {user.roles?.map((role) => (
                          <span
                            key={role}
                            className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200"
                          >
                            {role}
                          </span>
                        ))}

                        {!user.roles?.length && (
                          <span className="text-slate-400">
                            {formatRoles(user.roles)}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {user.isBlocked ? (
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200">
                          Blocked
                        </span>
                      ) : (
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {user.district || "N/A"}, {user.state || "N/A"}
                    </td>

                    <td className="px-6 py-4 text-right">
                      {user.roles?.includes("ADMIN") ? (
                        <span className="text-xs font-medium text-slate-400">
                          Protected
                        </span>
                      ) : user.isBlocked ? (
                        <button
                          type="button"
                          disabled={isActionPending}
                          onClick={() => handleUnblockUser(user)}
                          className="rounded-lg border border-green-200 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isActionPending}
                          onClick={() => handleBlockUser(user)}
                          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Block
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => setPage((prevPage) => prevPage - 1)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <p className="text-sm text-slate-600">
          Page {page} of {totalPages}
        </p>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => setPage((prevPage) => prevPage + 1)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsersPage;
