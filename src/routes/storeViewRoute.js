import express from "express";
import {
  getStoreViews,
  getStoreView,
  createStoreView,
  updateStoreView,
  deleteStoreView,
  getStoreViewByCode,
  getStoreViewsByStore,
} from "../controllers/storeViewController.js";
import {
  validateStoreViewCreation,
  validateStoreViewDelete,
  validateStoreViewUpdate,
} from "../middlewares/validateStoreView.js";

const router = express.Router();

router.get("/", getStoreViews);
router.get("/store/:storeId", getStoreViewsByStore);
router.get("/code/:code", getStoreViewByCode);
router.get("/:id", getStoreView);
router.post("/", validateStoreViewCreation, createStoreView);
router.put("/:id", validateStoreViewUpdate, updateStoreView);
router.delete("/:id", validateStoreViewDelete, deleteStoreView);

export default router;
