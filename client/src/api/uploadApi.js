import apiClient from "./apiClient";

export const uploadImage = async (file) => {
  const formData = new FormData();

  formData.append("image", file);

  const response = await apiClient.post("/uploads/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const uploadPdf = async (file) => {
  const formData = new FormData();

  formData.append("pdf", file);

  const response = await apiClient.post("/uploads/pdf", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
