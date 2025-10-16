import express from "express";
import {
  getAssets,
  getAsset,
  createAsset,
  updateAsset,
  deleteAsset,
} from "../controllers/assetController.js";
import {
  validateAssetCreation,
  validateAssetDelete,
  validateAssetUpdate,
} from "../middlewares/validateAsset.js";

const router = express.Router();

router.get("/", getAssets);
router.get("/:id", getAsset);
router.post("/", validateAssetCreation, createAsset);
router.put("/:id", validateAssetUpdate, updateAsset);
router.delete("/:id", validateAssetDelete, deleteAsset);

export default router;
