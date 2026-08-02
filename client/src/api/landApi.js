import apiClient from "./apiClient";

export const createLand = async (landData) => {
  const response = await apiClient.post("/lands", landData);
  return response.data;
};

export const getLands = async (params = {}) => {
  const response = await apiClient.get("/lands", {
    params,
  });

  return response.data;
};

export const getMyLands = async () => {
  const response = await apiClient.get("/lands/my");
  return response.data;
};

export const getLandById = async (landId) => {
  const response = await apiClient.get(`/lands/${landId}`);
  return response.data;
};

export const updateLand = async (landId, landData) => {
  const response = await apiClient.put(`/lands/${landId}`, landData);
  return response.data;
};

export const deleteLand = async (landId) => {
  const response = await apiClient.delete(`/lands/${landId}`);
  return response.data;
};
