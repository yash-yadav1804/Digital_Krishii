import apiClient from "./apiClient";

export const getContractTemplates = async () => {
  const response = await apiClient.get("/contracts/templates");
  return response.data;
};

export const getContractTemplateById = async (templateId) => {
  const response = await apiClient.get(`/contracts/templates/${templateId}`);
  return response.data;
};

export const createContractRequest = async (contractData) => {
  const response = await apiClient.post("/contracts/requests", contractData);
  return response.data;
};

export const getSentContractRequests = async () => {
  const response = await apiClient.get("/contracts/requests/sent");
  return response.data;
};

export const getReceivedContractRequests = async () => {
  const response = await apiClient.get("/contracts/requests/received");
  return response.data;
};

export const getContractRequestById = async (requestId) => {
  const response = await apiClient.get(`/contracts/requests/${requestId}`);
  return response.data;
};

export const updateContractRequestStatus = async (requestId, status) => {
  const response = await apiClient.patch(
    `/contracts/requests/${requestId}/status`,
    {
      status,
    },
  );

  return response.data;
};

export const cancelContractRequest = async (requestId, reason) => {
  const response = await apiClient.patch(
    `/contracts/requests/${requestId}/cancel`,
    {
      reason,
    },
  );

  return response.data;
};
