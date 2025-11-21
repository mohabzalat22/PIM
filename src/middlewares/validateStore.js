import z from "zod";
import { findById, findByCode } from "../models/storeModel.js";

const storeSchema = z.object({
  code: z.string().min(1, "Store code is required"),
  name: z.string().optional().nullable(),
});

export const validateStoreCreation = async (req, res, next) => {
  const result = storeSchema.safeParse(req.body);

  if (!result.success) {
    return res.badRequest("Store validation failed. Please check the provided data.", result.error);
  }

  // Check if already saved record with the same code
  const storeExists = await findByCode(result.data.code);

  if (storeExists) {
    return res.error(`A store with code '${result.data.code}' already exists in the system.`, 409, {
      error: `code-${result.data.code}`,
    });
  }
  next();
};

export const validateStoreUpdate = async (req, res, next) => {
  const id = Number(req.params.id);
  
  if (!id) {
    return res.badRequest("Store ID is required and must be a valid number.");
  }

  const result = storeSchema.safeParse(req.body);

  if (!result.success) {
    return res.badRequest("Store update validation failed. Please check the provided data.", result.error);
  }

  const storeExists = await findById(id);

  if (!storeExists) {
    return res.notFound(`Store with ID ${id} was not found in the system.`);
  }

  // Check if code already exists (excluding current store)
  if (result.data.code) {
    const codeExists = await findByCode(result.data.code);
    if (codeExists && codeExists.id !== id) {
      return res.error(`Store code '${result.data.code}' is already in use by another store.`, 409);
    }
  }

  next();
};

export const validateStoreDelete = async (req, res, next) => {
  const id = Number(req.params.id);
  
  if (!id) {
    return res.badRequest("Store ID is required and must be a valid number.");
  }

  const storeExists = await findById(id);

  if (!storeExists) {
    return res.notFound(`Store with ID ${id} was not found and cannot be deleted.`);
  }

  // Check if store has store views
  if (storeExists.storeViews && storeExists.storeViews.length > 0) {
    return res.badRequest(`Cannot delete store because it has ${storeExists.storeViews.length} associated store view(s). Please delete or reassign store views first.`);
  }

  next();
};
