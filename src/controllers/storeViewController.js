import {
  findAll,
  create,
  update,
  deleteById,
  findById,
  findByCode,
  findByStoreId,
} from "../models/storeViewModel.js";
import { errorMessage, successMessage } from "../utils/message.js";

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

  res.json(successMessage(storeViews, 200, "Success fetching store views", meta));
};

export const getStoreViewsByStore = async (req, res) => {
  const storeId = Number(req.params.storeId);
  if (!storeId) {
    res.json(errorMessage("Store ID not found"));
  }
  const storeViews = (await findByStoreId(storeId)) ?? [];
  res.json(successMessage(storeViews));
};

export const getStoreView = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    res.json(errorMessage("ID not found"));
  }
  const storeView = (await findById(id)) ?? {};
  res.json(successMessage(storeView));
};

export const getStoreViewByCode = async (req, res) => {
  const code = req.params.code;
  if (!code) {
    res.json(errorMessage("Code not found"));
  }
  const storeView = (await findByCode(code)) ?? {};
  res.json(successMessage(storeView));
};

export const createStoreView = async (req, res) => {
  const result = await create(req.body);
  if (!result) {
    res.json(
      errorMessage("Failed to create new store view", 500, result.error)
    );
  }
  res.json(successMessage(result));
};

export const updateStoreView = async (req, res) => {
  const id = Number(req.params.id);
  const result = await update(id, req.body);
  if (!result) {
    return res.json(errorMessage("Failed to update store view"));
  }
  res.json(successMessage("Store view updated successfully"));
};

export const deleteStoreView = async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteById(id);
  if (!result) {
    return res.json(errorMessage("Failed to delete store view"));
  }
  res.json(successMessage("Store view deleted successfully"));
};
