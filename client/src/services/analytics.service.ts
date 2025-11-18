import { AnalyticsApi } from "@/api/analytics";

export const AnalyticsService = {
  async getDashboard() {
    return AnalyticsApi.getDashboard();
  },
};
