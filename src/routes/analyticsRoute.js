import express from "express";
import { getDashboard } from "../controllers/analyticsController.js";

const router = express.Router();

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Get comprehensive dashboard analytics
 * @access  Public (add authentication middleware if needed)
 */
router.get("/dashboard", getDashboard);

export default router;
