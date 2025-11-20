import {
  findAll,
  create,
  update,
  deleteById,
  findById,
  findByCode,
} from "../models/storeModel.js";

export const getStores = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // current page
  const limit = parseInt(req.query.limit) || 10; // items per page
  const skip = (page - 1) * limit;

  // Extract filter parameters
  const filters = {
    search: req.query.search || null,
    sortBy: req.query.sortBy || 'createdAt',
    sortOrder: req.query.sortOrder || 'desc'
  };

  const [stores, total] = (await findAll(skip, limit, filters)) ?? [];

  // meta data
  const meta = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  res.success(stores, "Stores retrieved successfully", meta);
};

export const getStore = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.badRequest("Store ID is required");
  }
  const store = (await findById(id)) ?? {};
  res.success(store, "Store retrieved successfully");
};

export const getStoreByCode = async (req, res) => {
  const code = req.params.code;
  if (!code) {
    return res.badRequest("Store code is required");
  }
  const store = (await findByCode(code)) ?? {};
  res.success(store, "Store retrieved successfully");
};

export const createStore = async (req, res) => {
  const result = await create(req.body);
  if (!result) {
    return res.error("Failed to create new store", 500, result.error);
  }
  res.created(result, "Store created successfully");
};

export const updateStore = async (req, res) => {
  const id = Number(req.params.id);
  const result = await update(id, req.body);
  if (!result) {
    return res.error("Failed to update store");
  }
  res.success(result, "Store updated successfully");
};

export const deleteStore = async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteById(id);
  if (!result) {
    return res.error("Failed to delete store");
  }
  res.success(result, "Store deleted successfully");
};
