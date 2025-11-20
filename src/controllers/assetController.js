import {
  findAll,
  create,
  update,
  deleteById,
  findById,
} from "../models/assetModel.js";

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
  
  res.success(assets, "Assets retrieved successfully", meta);
};

export const getAsset = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.badRequest("Asset ID is required");
  }
  const asset = (await findById(id)) ?? {};
  res.success(asset, "Asset retrieved successfully");
};

export const createAsset = async (req, res) => {
  const result = await create(req.body);
  if (!result) {
    return res.error("Failed to create new asset", 500, result.error);
  }
  res.created(result, "Asset created successfully");
};

export const updateAsset = async (req, res) => {
  const id = Number(req.params.id);
  const result = await update(id, req.body);
  if (!result) {
    return res.error("Failed to update asset");
  }
  res.success(result, "Asset updated successfully");
};

export const deleteAsset = async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteById(id);
  if (!result) {
    return res.error("Failed to delete asset");
  }
  res.success(result, "Asset deleted successfully");
};
