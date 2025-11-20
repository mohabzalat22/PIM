import z from "zod";
import { findById, findByCode } from "../models/storeViewModel.js";
import { findById as findStoreById } from "../models/storeModel.js";
import { findById as findLocaleById } from "../models/localeModel.js";

const storeViewSchema = z.object({
  storeId: z.coerce.number().int().positive("Store ID must be a positive integer"),
  code: z.string().min(1, "Store view code is required"),
  name: z.string().min(1, "Store view name is required"),
  localeId: z.coerce.number().int().positive("Locale ID must be a positive integer"),
});

export const validateStoreViewCreation = async (req, res, next) => {
  const result = storeViewSchema.safeParse(req.body);

  if (!result.success) {
    return res.badRequest("Store view validation failed. Please check the provided data.", result.error);
  }

  // Check if store exists
  const storeExists = await findStoreById(result.data.storeId);
  if (!storeExists) {
    return res.notFound(`Store with ID ${result.data.storeId} was not found in the system.`);
  }

  // Check if locale exists
  const localeExists = await findLocaleById(result.data.localeId);
  if (!localeExists) {
    return res.notFound(`Locale with ID ${result.data.localeId} was not found in the system.`);
  }

  // Check if already saved record with the same code
  const storeViewExists = await findByCode(result.data.code);

  if (storeViewExists) {
    return res.error(`A store view with code '${result.data.code}' already exists in the system.`, 409, {
      error: `code-${result.data.code}`,
    });
  }
  next();
};

export const validateStoreViewUpdate = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.badRequest("Store view ID is required and must be a valid number.");
  }

  const result = storeViewSchema.safeParse(req.body);
  const storeViewExists = await findById(id);

  if (!result.success) {
    return res.badRequest("Store view update validation failed. Please check the provided data.");
  }

  if (!storeViewExists) {
    return res.notFound(`Store view with ID ${id} was not found in the system.`);
  }

  // Check if store exists
  if (result.data.storeId) {
    const storeExists = await findStoreById(result.data.storeId);
    if (!storeExists) {
      return res.notFound(`Store with ID ${result.data.storeId} was not found in the system.`);
    }
  }

  // Check if locale exists
  if (result.data.localeId) {
    const localeExists = await findLocaleById(result.data.localeId);
    if (!localeExists) {
      return res.notFound(`Locale with ID ${result.data.localeId} was not found in the system.`);
    }
  }

  // Check if code already exists (excluding current store view)
  if (result.data.code) {
    const codeExists = await findByCode(result.data.code);
    if (codeExists && codeExists.id !== id) {
      return res.error(`Store view code '${result.data.code}' is already in use by another store view.`, 409);
    }
  }

  next();
};

export const validateStoreViewDelete = async (req, res, next) => {
  const id = Number(req.params.id);
  const storeViewExists = await findById(id);

  if (!id) {
    return res.badRequest("Store view ID is required and must be a valid number.");
  }

  if (!storeViewExists) {
    return res.notFound(`Store view with ID ${id} was not found and cannot be deleted.`);
  }

  // Check if store view has associated data
  if (
    storeViewExists.productAttributeValues &&
    storeViewExists.productAttributeValues.length > 0
  ) {
    return res.badRequest(
      `Cannot delete store view '${storeViewExists.name}' because it has ${storeViewExists.productAttributeValues.length} associated product attribute value(s). Please remove these associations first.`
    );
  }

  if (
    storeViewExists.categoryTranslations &&
    storeViewExists.categoryTranslations.length > 0
  ) {
    return res.badRequest(
      `Cannot delete store view '${storeViewExists.name}' because it has ${storeViewExists.categoryTranslations.length} associated category translation(s). Please remove these translations first.`
    );
  }

  next();
};
