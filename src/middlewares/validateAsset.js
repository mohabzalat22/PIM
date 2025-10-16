import z from "zod";
import { errorMessage } from "../utils/message.js";
import { findById, findByFilePath } from "../models/assetModel.js";

const assetSchema = z.object({
  filePath: z.string().min(1, "File path is required"),
  mimeType: z.string().min(1, "MIME type is required"),
});

export const validateAssetCreation = async (req, res, next) => {
  const result = assetSchema.safeParse(req.body);

  if (!result.success) {
    return res.json(
      errorMessage("Failed to validate asset", 500, result.error)
    );
  }

  // Check if already saved record with the same file path
  const assetExists = await findByFilePath(result.data.filePath);

  if (assetExists) {
    return res.json(
      errorMessage("Asset with the same file path already exists", 500, {
        error: `filePath-${result.data.filePath}`,
      })
    );
  }
  next();
};

export const validateAssetUpdate = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.json(errorMessage("ID not defined"));
  }

  const result = assetSchema.safeParse(req.body);
  const assetExists = await findById(id);

  if (!result.success) {
    return res.json(errorMessage("Failed to validate asset update"));
  }

  if (!assetExists) {
    return res.json(errorMessage("Unable to find asset to update"));
  }
  next();
};

export const validateAssetDelete = async (req, res, next) => {
  const id = Number(req.params.id);
  const assetExists = await findById(id);

  if (!id) {
    return res.json(errorMessage("ID not defined"));
  }

  if (!assetExists) {
    return res.json(errorMessage("Unable to find asset to delete"));
  }
  next();
};
