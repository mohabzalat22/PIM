import {
  findAll,
  create,
  update,
  deleteByCompositeKey,
  findByProductId,
  findByAssetId,
  findByCompositeKey,
} from "../models/productAssetModel.js";

export const getProductAssets = async (req, res) => {
  const productAssets = (await findAll()) ?? [];
  res.success(productAssets, "Product assets retrieved successfully");
};

export const getProductAssetsByProduct = async (req, res) => {
  const productId = Number(req.params.productId);
  if (!productId) {
    return res.badRequest("Product ID is required");
  }
  const productAssets = (await findByProductId(productId)) ?? [];
  res.success(productAssets, "Product assets retrieved successfully");
};

export const getProductAssetsByAsset = async (req, res) => {
  const assetId = Number(req.params.assetId);
  if (!assetId) {
    return res.badRequest("Asset ID is required");
  }
  const productAssets = (await findByAssetId(assetId)) ?? [];
  res.success(productAssets, "Product assets retrieved successfully");
};

export const getProductAsset = async (req, res) => {
  const productId = Number(req.params.productId);
  const assetId = Number(req.params.assetId);
  const type = req.params.type;

  if (!productId || !assetId || !type) {
    return res.badRequest("Product ID, asset ID, and type are required");
  }

  const productAsset =
    (await findByCompositeKey(productId, assetId, type)) ?? {};
  res.success(productAsset, "Product asset retrieved successfully");
};

export const createProductAsset = async (req, res) => {
  const result = await create(req.body);
  if (!result) {
    return res.error("Failed to create new product asset", 500, result.error);
  }
  res.created(result, "Product asset created successfully");
};

export const updateProductAsset = async (req, res) => {
  const productId = Number(req.params.productId);
  const assetId = Number(req.params.assetId);
  const type = req.params.type;

  const result = await update(productId, assetId, type, req.body);
  if (!result) {
    return res.error("Failed to update product asset");
  }
  res.success(result, "Product asset updated successfully");
};

export const deleteProductAsset = async (req, res) => {
  const productId = Number(req.params.productId);
  const assetId = Number(req.params.assetId);
  const type = req.params.type;

  const result = await deleteByCompositeKey(productId, assetId, type);
  if (!result) {
    return res.error("Failed to delete product asset");
  }
  res.success(result, "Product asset deleted successfully");
};
