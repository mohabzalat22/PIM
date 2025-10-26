import {
  findAll,
  create,
  update,
  deleteById,
  findById,
} from "../models/assetModel.js";
import { errorMessage, successMessage } from "../utils/message.js";

export const getAssets = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const filters = {
    search: req.query.search || null,
    mimeType: req.query.mimeType || null,
    sortBy: req.query.sortBy || 'createdAt',
    sortOrder: req.query.sortOrder || 'desc'
  };

  const [assets, total] = (await findAll(skip, limit, filters)) ?? [];
  
  const meta = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
  
  res.json(successMessage(assets, 200, "Success fetching assets", meta));
};

export const getAsset = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    res.json(errorMessage("ID not found"));
  }
  const asset = (await findById(id)) ?? {};
  res.json(successMessage(asset));
};

export const createAsset = async (req, res) => {
  const result = await create(req.body);
  if (!result) {
    res.json(errorMessage("Failed to create new asset", 500, result.error));
  }
  res.json(successMessage(result));
};

export const updateAsset = async (req, res) => {
  const id = Number(req.params.id);
  const result = await update(id, req.body);
  if (!result) {
    res.json(errorMessage("Failed to update asset"));
  }
  res.json(successMessage("Asset updated successfully"));
};

export const deleteAsset = async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteById(id);
  if (!result) {
    res.json(errorMessage("Failed to delete asset"));
  }
  res.json(successMessage("Asset deleted successfully"));
};
