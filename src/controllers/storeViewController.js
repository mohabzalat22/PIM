import {
  findAll,
  create,
  update,
  deleteById,
  findById,
  findByCode,
  findByStoreId,
} from "../models/storeViewModel.js";

export const getStoreViews = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // current page
  const limit = parseInt(req.query.limit) || 10; // items per page
  const skip = (page - 1) * limit;

  // Extract filter parameters
  const filters = {
    search: req.query.search || null,
    storeId: req.query.storeId || null,
    localeId: req.query.localeId || null,
    sortBy: req.query.sortBy || 'createdAt',
    sortOrder: req.query.sortOrder || 'desc'
  };

  const [storeViews, total] = (await findAll(skip, limit, filters)) ?? [];

  // meta data
  const meta = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  res.success(storeViews, "Store views retrieved successfully", meta);
};

export const getStoreViewsByStore = async (req, res) => {
  const storeId = Number(req.params.storeId);
  if (!storeId) {
    return res.badRequest("Store ID is required");
  }
  const storeViews = (await findByStoreId(storeId)) ?? [];
  res.success(storeViews, "Store views retrieved successfully");
};

export const getStoreView = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.badRequest("Store view ID is required");
  }
  const storeView = (await findById(id)) ?? {};
  res.success(storeView, "Store view retrieved successfully");
};

export const getStoreViewByCode = async (req, res) => {
  const code = req.params.code;
  if (!code) {
    return res.badRequest("Store view code is required");
  }
  const storeView = (await findByCode(code)) ?? {};
  res.success(storeView, "Store view retrieved successfully");
};

export const createStoreView = async (req, res) => {
  const result = await create(req.body);
  if (!result) {
    return res.error("Failed to create new store view", 500, result.error);
  }
  res.created(result, "Store view created successfully");
};

export const updateStoreView = async (req, res) => {
  const id = Number(req.params.id);
  const result = await update(id, req.body);
  if (!result) {
    return res.error("Failed to update store view");
  }
  res.success(result, "Store view updated successfully");
};

export const deleteStoreView = async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteById(id);
  if (!result) {
    return res.error("Failed to delete store view");
  }
  res.success(result, "Store view deleted successfully");
};
