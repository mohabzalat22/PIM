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
  const storeViews = (await findAll()) ?? [];
  res.json(successMessage(storeViews));
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
    res.json(errorMessage("Failed to update store view"));
  }
  res.json(successMessage("Store view updated successfully"));
};

export const deleteStoreView = async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteById(id);
  if (!result) {
    res.json(errorMessage("Failed to delete store view"));
  }
  res.json(successMessage("Store view deleted successfully"));
};
