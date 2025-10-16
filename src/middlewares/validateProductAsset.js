import z from "zod";
import { errorMessage } from "../utils/message.js";
import { findByCompositeKey } from "../models/productAssetModel.js";
import { findById as findProductById } from "../models/productModel.js";
import { findById as findAssetById } from "../models/assetModel.js";

const productAssetSchema = z.object({
  productId: z.number().int().positive("Product ID must be a positive integer"),
  assetId: z.number().int().positive("Asset ID must be a positive integer"),
  type: z.string().min(1, "Type is required"),
  position: z.number().int().positive().optional(),
});

export const validateProductAssetCreation = async (req, res, next) => {
  const result = productAssetSchema.safeParse(req.body);

  if (!result.success) {
    return res.json(
      errorMessage("Failed to validate product asset", 500, result.error)
    );
  }

  // Check if product exists
  const productExists = await findProductById(result.data.productId);
  if (!productExists) {
    return res.json(errorMessage("Product not found", 404));
  }

  // Check if asset exists
  const assetExists = await findAssetById(result.data.assetId);
  if (!assetExists) {
    return res.json(errorMessage("Asset not found", 404));
  }

  // Check if product asset relationship already exists
  const productAssetExists = await findByCompositeKey(
    result.data.productId,
    result.data.assetId,
    result.data.type
  );

  if (productAssetExists) {
    return res.json(
      errorMessage("Product asset relationship already exists", 409)
    );
  }
  next();
};

export const validateProductAssetUpdate = async (req, res, next) => {
  const productId = Number(req.params.productId);
  const assetId = Number(req.params.assetId);
  const type = req.params.type;

  if (!productId || !assetId || !type) {
    return res.json(
      errorMessage("Product ID, Asset ID, and Type are required")
    );
  }

  const result = productAssetSchema.safeParse(req.body);
  console.log(result);

  const productAssetExists = await findByCompositeKey(productId, assetId, type);

  if (!result.success) {
    return res.json(
      errorMessage(
        "Failed to validate product asset update",
        400,
        result.error?.message
      )
    );
  }

  if (!productAssetExists) {
    return res.json(errorMessage("Unable to find product asset to update"));
  }
  next();
};

export const validateProductAssetDelete = async (req, res, next) => {
  const productId = Number(req.params.productId);
  const assetId = Number(req.params.assetId);
  const type = req.params.type;

  const productAssetExists = await findByCompositeKey(productId, assetId, type);

  if (!productId || !assetId || !type) {
    return res.json(
      errorMessage("Product ID, Asset ID, and Type are required")
    );
  }

  if (!productAssetExists) {
    return res.json(errorMessage("Unable to find product asset to delete"));
  }
  next();
};
