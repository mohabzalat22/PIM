import z from "zod";
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
    return res.error("Product asset validation failed. Please check the provided data.", 500, result.error);
  }

  // Check if product exists
  const productExists = await findProductById(result.data.productId);
  if (!productExists) {
    return res.notFound(`Product with ID ${result.data.productId} was not found in the system.`);
  }

  // Check if asset exists
  const assetExists = await findAssetById(result.data.assetId);
  if (!assetExists) {
    return res.notFound(`Asset with ID ${result.data.assetId} was not found in the system.`);
  }

  // Check if product asset relationship already exists
  const productAssetExists = await findByCompositeKey(
    result.data.productId,
    result.data.assetId,
    result.data.type
  );

  if (productAssetExists) {
    return res.error(`This asset is already associated with the product as type '${result.data.type}'.`, 409);
  }
  next();
};

export const validateProductAssetUpdate = async (req, res, next) => {
  const productId = Number(req.params.productId);
  const assetId = Number(req.params.assetId);
  const type = req.params.type;

  if (!productId || !assetId || !type) {
    return res.error("Product ID, Asset ID, and Type are all required parameters.", 500);
  }

  const result = productAssetSchema.safeParse(req.body);
  console.log(result);

  const productAssetExists = await findByCompositeKey(productId, assetId, type);

  if (!result.success) {
    return res.badRequest(
      "Product asset update validation failed. Please check the provided data.",
      result.error?.message
    );
  }

  if (!productAssetExists) {
    return res.error(`Product asset relationship not found for product ID ${productId}, asset ID ${assetId}, and type '${type}'.`, 500);
  }
  next();
};

export const validateProductAssetDelete = async (req, res, next) => {
  const productId = Number(req.params.productId);
  const assetId = Number(req.params.assetId);
  const type = req.params.type;

  const productAssetExists = await findByCompositeKey(productId, assetId, type);

  if (!productId || !assetId || !type) {
    return res.error("Product ID, Asset ID, and Type are all required parameters.", 500);
  }

  if (!productAssetExists) {
    return res.error(`Product asset relationship not found for product ID ${productId}, asset ID ${assetId}, and type '${type}' and cannot be deleted.`, 500);
  }
  next();
};
