import z from "zod";
import { findById, findByFilePath } from "../models/assetModel.js";

const assetSchema = z.object({
  filePath: z.string().min(1, "File path is required"),
  mimeType: z.string().min(1, "MIME type is required"),
});

export const validateAssetCreation = async (req, res, next) => {
  const result = assetSchema.safeParse(req.body);

  if (!result.success) {
    return res.error("Asset validation failed. Please check the provided data.", 500, result.error);
  }

  // Check if already saved record with the same file path
  const assetExists = await findByFilePath(result.data.filePath);

  if (assetExists) {
    return res.error(`An asset with file path '${result.data.filePath}' already exists in the system.`, 500, {
      error: `filePath-${result.data.filePath}`,
    });
  }
  next();
};

export const validateAssetUpdate = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.error("Asset ID is required and must be a valid number.", 500);
  }

  const result = assetSchema.safeParse(req.body);
  const assetExists = await findById(id);

  if (!result.success) {
    return res.error("Asset update validation failed. Please check the provided data.", 500);
  }

  if (!assetExists) {
    return res.error(`Asset with ID ${id} was not found in the system.`, 500);
  }
  next();
};

export const validateAssetDelete = async (req, res, next) => {
  const id = Number(req.params.id);
  const assetExists = await findById(id);

  if (!id) {
    return res.error("Asset ID is required and must be a valid number.", 500);
  }

  if (!assetExists) {
    return res.error(`Asset with ID ${id} was not found and cannot be deleted.`, 500);
  }
  next();
};
