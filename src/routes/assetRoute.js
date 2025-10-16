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
import { asyncWrapper } from "../utils/asyncWrapper.js";

const router = express.Router();

router.get("/", asyncWrapper(getAssets));
router.get("/:id", asyncWrapper(getAsset));
router.post("/", validateAssetCreation, asyncWrapper(createAsset));
router.put("/:id", validateAssetUpdate, asyncWrapper(updateAsset));
router.delete("/:id", validateAssetDelete, asyncWrapper(deleteAsset));

export default router;
