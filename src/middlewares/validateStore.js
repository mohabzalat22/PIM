import z from "zod";
import { errorMessage } from "../utils/message.js";
import { findById, findByCode } from "../models/storeModel.js";

const storeSchema = z.object({
  code: z.string().min(1, "Store code is required"),
  name: z.string().optional().nullable(),
});

export const validateStoreCreation = async (req, res, next) => {
  const result = storeSchema.safeParse(req.body);

  if (!result.success) {
    return res.json(
      errorMessage("Failed to validate store", 500, result.error)
    );
  }

  // Check if already saved record with the same code
  const storeExists = await findByCode(result.data.code);

  if (storeExists) {
    return res.json(
      errorMessage("Store with the same code already exists", 500, {
        error: `code-${result.data.code}`,
      })
    );
  }
  next();
};

export const validateStoreUpdate = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.json(errorMessage("ID not defined"));
  }

  const result = storeSchema.safeParse(req.body);
  const storeExists = await findById(id);

  if (!result.success) {
    return res.json(errorMessage("Failed to validate store update"));
  }

  if (!storeExists) {
    return res.json(errorMessage("Unable to find store to update"));
  }

  // Check if code already exists (excluding current store)
  if (result.data.code) {
    const codeExists = await findByCode(result.data.code);
    if (codeExists && codeExists.id !== id) {
      return res.json(
        errorMessage("Store with the same code already exists", 409)
      );
    }
  }

  next();
};

export const validateStoreDelete = async (req, res, next) => {
  const id = Number(req.params.id);
  const storeExists = await findById(id);

  if (!id) {
    return res.json(errorMessage("ID not defined"));
  }

  if (!storeExists) {
    return res.json(errorMessage("Unable to find store to delete"));
  }

  // Check if store has store views
  if (storeExists.storeViews && storeExists.storeViews.length > 0) {
    return res.json(
      errorMessage("Cannot delete store with associated store views", 400)
    );
  }

  next();
};
