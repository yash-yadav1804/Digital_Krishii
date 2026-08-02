import apiClient from "./apiClient";

export const createReview = async (reviewData) => {
  const response = await apiClient.post("/reviews", reviewData);
  return response.data;
};

export const getReviewsReceived = async () => {
  const response = await apiClient.get("/reviews/received");
  return response.data;
};

export const getReviewsGiven = async () => {
  const response = await apiClient.get("/reviews/given");
  return response.data;
};

export const getUserRatingSummary = async (userId) => {
  const response = await apiClient.get(`/reviews/summary/${userId}`);
  return response.data;
};
