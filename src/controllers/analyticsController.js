import { getDashboardAnalytics } from "../models/analyticsModel.js";

/**
 * Get dashboard analytics data
 * Returns comprehensive analytics for dashboard charts and metrics
 */
export const getDashboard = async (req, res) => {
  try {
    const analytics = await getDashboardAnalytics();
    res.success(analytics, "Dashboard analytics retrieved successfully");
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error);
    res.error("Failed to retrieve dashboard analytics", 500, error.message);
  }
};
