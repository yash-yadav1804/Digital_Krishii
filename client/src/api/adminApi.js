import apiClient from "./apiClient";

export const getAdminStats = async () => {
  const response = await apiClient.get("/admin/stats");
  return response.data;
};

export const getAdminUsers = async (params = {}) => {
  const response = await apiClient.get("/admin/users", {
    params,
  });

  return response.data;
};

export const getAdminUserById = async (userId) => {
  const response = await apiClient.get(`/admin/users/${userId}`);
  return response.data;
};

export const blockUser = async (userId) => {
  const response = await apiClient.patch(`/admin/users/${userId}/block`);
  return response.data;
};

export const unblockUser = async (userId) => {
  const response = await apiClient.patch(`/admin/users/${userId}/unblock`);
  return response.data;
};
