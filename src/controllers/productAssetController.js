import {
  findAll,
  create,
  update,
  deleteByCompositeKey,
  findByProductId,
  findByAssetId,
  findByCompositeKey,
} from "../models/productAssetModel.js";
import { errorMessage, successMessage } from "../utils/message.js";

export const getProductAssets = async (req, res) => {
  const productAssets = (await findAll()) ?? [];
  res.json(successMessage(productAssets));
};

export const getProductAssetsByProduct = async (req, res) => {
  const productId = Number(req.params.productId);
  if (!productId) {
    res.json(errorMessage("Product ID not found"));
  }
  const productAssets = (await findByProductId(productId)) ?? [];
  res.json(successMessage(productAssets));
};

export const getProductAssetsByAsset = async (req, res) => {
  const assetId = Number(req.params.assetId);
  if (!assetId) {
    res.json(errorMessage("Asset ID not found"));
  }
  const productAssets = (await findByAssetId(assetId)) ?? [];
  res.json(successMessage(productAssets));
};

export const getProductAsset = async (req, res) => {
  const productId = Number(req.params.productId);
  const assetId = Number(req.params.assetId);
  const type = req.params.type;

  if (!productId || !assetId || !type) {
    res.json(errorMessage("Product ID, Asset ID, and Type not found"));
  }

  const productAsset =
    (await findByCompositeKey(productId, assetId, type)) ?? {};
  res.json(successMessage(productAsset));
};

export const createProductAsset = async (req, res) => {
  const result = await create(req.body);
  if (!result) {
    res.json(
      errorMessage("Failed to create new product asset", 500, result.error)
    );
  }
  res.json(successMessage(result));
};

export const updateProductAsset = async (req, res) => {
  const productId = Number(req.params.productId);
  const assetId = Number(req.params.assetId);
  const type = req.params.type;

  const result = await update(productId, assetId, type, req.body);
  if (!result) {
    res.json(errorMessage("Failed to update product asset"));
  }
  res.json(successMessage("Product asset updated successfully"));
};

export const deleteProductAsset = async (req, res) => {
  const productId = Number(req.params.productId);
  const assetId = Number(req.params.assetId);
  const type = req.params.type;

  const result = await deleteByCompositeKey(productId, assetId, type);
  if (!result) {
    res.json(errorMessage("Failed to delete product asset"));
  }
  res.json(successMessage("Product asset deleted successfully"));
};
