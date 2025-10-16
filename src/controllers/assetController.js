import {
  findAll,
  create,
  update,
  deleteById,
  findById,
} from "../models/assetModel.js";
import { errorMessage, successMessage } from "../utils/message.js";

export const getAssets = async (req, res) => {
  const assets = (await findAll()) ?? [];
  res.json(successMessage(assets));
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
