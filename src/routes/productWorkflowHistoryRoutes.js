import express from "express";
import {
  getProductWorkflowHistory,
  getAllWorkflowHistory,
} from "../controllers/productWorkflowHistoryController.js";

const router = express.Router();

// Get workflow history for a specific product
router.get("/products/:productId/workflow-history", getProductWorkflowHistory);

// Get all workflow history with optional filtering
router.get("/workflow-history", getAllWorkflowHistory);

export default router;
