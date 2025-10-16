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
import { asyncWrapper } from "../utils/asyncWrapper.js";

const router = express.Router();

router.get("/", asyncWrapper(getProductAssets));
router.get("/product/:productId", asyncWrapper(getProductAssetsByProduct));
router.get("/asset/:assetId", asyncWrapper(getProductAssetsByAsset));
router.get("/:productId/:assetId/:type", asyncWrapper(getProductAsset));
router.post(
  "/",
  validateProductAssetCreation,
  asyncWrapper(createProductAsset)
);
router.put(
  "/:productId/:assetId/:type",
  validateProductAssetUpdate,
  asyncWrapper(updateProductAsset)
);
router.delete(
  "/:productId/:assetId/:type",
  validateProductAssetDelete,
  deleteProductAsset
);

export default router;
