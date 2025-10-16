import express from "express";
import {
  getProductAssets,
  getProductAsset,
  createProductAsset,
  updateProductAsset,
  deleteProductAsset,
  getProductAssetsByProduct,
  getProductAssetsByAsset,
} from "../controllers/productAssetController.js";
import {
  validateProductAssetCreation,
  validateProductAssetDelete,
  validateProductAssetUpdate,
} from "../middlewares/validateProductAsset.js";

const router = express.Router();

router.get("/", getProductAssets);
router.get("/product/:productId", getProductAssetsByProduct);
router.get("/asset/:assetId", getProductAssetsByAsset);
router.get("/:productId/:assetId/:type", getProductAsset);
router.post("/", validateProductAssetCreation, createProductAsset);
router.put(
  "/:productId/:assetId/:type",
  validateProductAssetUpdate,
  updateProductAsset
);
router.delete(
  "/:productId/:assetId/:type",
  validateProductAssetDelete,
  deleteProductAsset
);

export default router;
