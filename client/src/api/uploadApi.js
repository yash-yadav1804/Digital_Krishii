import apiClient from "./apiClient";

export const uploadImage = async (imageFile) => {
  const formData = new FormData();

  formData.append("image", imageFile);

  const response = await apiClient.post("/uploads/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const uploadPdf = async (pdfFile) => {
  const formData = new FormData();

  formData.append("pdf", pdfFile);

  const response = await apiClient.post("/uploads/pdf", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
