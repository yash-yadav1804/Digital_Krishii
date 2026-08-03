import apiClient from "./apiClient";

export const createEquipment = async (equipmentData) => {
  const response = await apiClient.post("/equipment", equipmentData);
  return response.data;
};

export const getEquipment = async (params = {}) => {
  const response = await apiClient.get("/equipment", {
    params,
  });

  return response.data;
};

export const getMyEquipment = async () => {
  const response = await apiClient.get("/equipment/my");
  return response.data;
};

export const getEquipmentById = async (equipmentId) => {
  const response = await apiClient.get(`/equipment/${equipmentId}`);
  return response.data;
};

export const updateEquipment = async (equipmentId, equipmentData) => {
  const response = await apiClient.put(
    `/equipment/${equipmentId}`,
    equipmentData,
  );
  return response.data;
};

export const deleteEquipment = async (equipmentId) => {
  const response = await apiClient.delete(`/equipment/${equipmentId}`);
  return response.data;
};

export const createRentalRequest = async (rentalData) => {
  const response = await apiClient.post("/equipment/rentals", rentalData);
  return response.data;
};
export const createEquipmentRentalRequest = async (rentalData) => {
  const response = await apiClient.post("/equipment/rentals", rentalData);
  return response.data;
};

export const getMyEquipmentRentalRequests = async () => {
  const response = await apiClient.get("/equipment/rentals/my");
  return response.data;
};

export const getReceivedEquipmentRentalRequests = async () => {
  const response = await apiClient.get("/equipment/rentals/received");
  return response.data;
};

export const updateEquipmentRentalStatus = async (rentalId, status) => {
  const response = await apiClient.patch(
    `/equipment/rentals/${rentalId}/status`,
    {
      status,
    },
  );

  return response.data;
};
