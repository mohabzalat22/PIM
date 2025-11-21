import z from "zod";
import { findById, findByFilePath } from "../models/assetModel.js";

const assetSchema = z.object({
  filePath: z.string().min(1, "File path is required"),
  mimeType: z.string().min(1, "MIME type is required"),
});

export const validateAssetCreation = async (req, res, next) => {
  const result = assetSchema.safeParse(req.body);

  if (!result.success) {
    return res.badRequest("Asset validation failed. Please check the provided data.", result.error);
  }

  // Check if already saved record with the same file path
  const assetExists = await findByFilePath(result.data.filePath);

  if (assetExists) {
    return res.error(`An asset with file path '${result.data.filePath}' already exists in the system.`, 409, {
      error: `filePath-${result.data.filePath}`,
    });
  }
  next();
};

export const validateAssetUpdate = async (req, res, next) => {
  const id = Number(req.params.id);
  
  if (!id) {
    return res.badRequest("Asset ID is required and must be a valid number.");
  }

  const result = assetSchema.safeParse(req.body);

  if (!result.success) {
    return res.badRequest("Asset update validation failed. Please check the provided data.", result.error);
  }

  const assetExists = await findById(id);

  if (!assetExists) {
    return res.notFound(`Asset with ID ${id} was not found in the system.`);
  }
  
  next();
};

export const validateAssetDelete = async (req, res, next) => {
  const id = Number(req.params.id);
  
  if (!id) {
    return res.badRequest("Asset ID is required and must be a valid number.");
  }

  const assetExists = await findById(id);

  if (!assetExists) {
    return res.notFound(`Asset with ID ${id} was not found and cannot be deleted.`);
  }
  
  next();
};
