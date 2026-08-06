import apiClient from "./apiClient";

export const getUserProfile = async () => {
  const response = await apiClient.get("/profile");
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await apiClient.put("/profile", profileData);
  return response.data;
};
