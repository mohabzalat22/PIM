import {
  findAll,
  create,
  update,
  deleteById,
  findById,
  findByCode,
} from "../models/storeModel.js";
import { errorMessage, successMessage } from "../utils/message.js";

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

  res.json(successMessage(stores, 200, "Success fetching stores", meta));
};

export const getStore = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    res.json(errorMessage("ID not found"));
  }
  const store = (await findById(id)) ?? {};
  res.json(successMessage(store));
};

export const getStoreByCode = async (req, res) => {
  const code = req.params.code;
  if (!code) {
    res.json(errorMessage("Code not found"));
  }
  const store = (await findByCode(code)) ?? {};
  res.json(successMessage(store));
};

export const createStore = async (req, res) => {
  const result = await create(req.body);
  if (!result) {
    res.json(errorMessage("Failed to create new store", 500, result.error));
  }
  res.json(successMessage(result));
};

export const updateStore = async (req, res) => {
  const id = Number(req.params.id);
  const result = await update(id, req.body);
  if (!result) {
    res.json(errorMessage("Failed to update store"));
  }
  res.json(successMessage("Store updated successfully"));
};

export const deleteStore = async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteById(id);
  if (!result) {
    res.json(errorMessage("Failed to delete store"));
  }
  res.json(successMessage("Store deleted successfully"));
};
