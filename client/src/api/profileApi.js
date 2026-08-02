import apiClient from "./apiClient";

export const getMyProfile = async () => {
  const response = await apiClient.get("/profile");
  return response.data;
};

export const updateMyProfile = async (profileData) => {
  const response = await apiClient.put("/profile", profileData);
  return response.data;
};
