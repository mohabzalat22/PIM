import { getDashboardAnalytics } from "../models/analyticsModel.js";
import { errorMessage, successMessage } from "../utils/message.js";

/**
 * Get dashboard analytics data
 * Returns comprehensive analytics for dashboard charts and metrics
 */
export const getDashboard = async (req, res) => {
  try {
    const analytics = await getDashboardAnalytics();
    res.json(successMessage(analytics, 200, "Successfully fetched dashboard analytics"));
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error);
    res.json(errorMessage("Failed to fetch dashboard analytics", 500, error.message));
  }
};
