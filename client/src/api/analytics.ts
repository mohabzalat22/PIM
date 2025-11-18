import client from "./apiClient";

export const AnalyticsApi = {
  getDashboard: async () => {
    const response = await client.get("/analytics/dashboard");
    return response.data;
  },
};
