import z from "zod";
import { errorMessage } from "../utils/message.js";
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
    return res.status(400).json(
      errorMessage("Failed to validate store view", 400, result.error)
    );
  }

  // Check if store exists
  const storeExists = await findStoreById(result.data.storeId);
  if (!storeExists) {
    return res.status(404).json(errorMessage("Store not found", 404));
  }

  // Check if locale exists
  const localeExists = await findLocaleById(result.data.localeId);
  if (!localeExists) {
    return res.status(404).json(errorMessage("Locale not found", 404));
  }

  // Check if already saved record with the same code
  const storeViewExists = await findByCode(result.data.code);

  if (storeViewExists) {
    return res.status(409).json(
      errorMessage("Store view with the same code already exists", 409, {
        error: `code-${result.data.code}`,
      })
    );
  }
  next();
};

export const validateStoreViewUpdate = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.status(400).json(errorMessage("ID not defined", 400));
  }

  const result = storeViewSchema.safeParse(req.body);
  const storeViewExists = await findById(id);

  if (!result.success) {
    return res.status(400).json(errorMessage("Failed to validate store view update", 400));
  }

  if (!storeViewExists) {
    return res.status(404).json(errorMessage("Unable to find store view to update", 404));
  }

  // Check if store exists
  if (result.data.storeId) {
    const storeExists = await findStoreById(result.data.storeId);
    if (!storeExists) {
      return res.status(404).json(errorMessage("Store not found", 404));
    }
  }

  // Check if locale exists
  if (result.data.localeId) {
    const localeExists = await findLocaleById(result.data.localeId);
    if (!localeExists) {
      return res.status(404).json(errorMessage("Locale not found", 404));
    }
  }

  // Check if code already exists (excluding current store view)
  if (result.data.code) {
    const codeExists = await findByCode(result.data.code);
    if (codeExists && codeExists.id !== id) {
      return res.status(409).json(
        errorMessage("Store view with the same code already exists", 409)
      );
    }
  }

  next();
};

export const validateStoreViewDelete = async (req, res, next) => {
  const id = Number(req.params.id);
  const storeViewExists = await findById(id);

  if (!id) {
    return res.status(400).json(errorMessage("ID not defined", 400));
  }

  if (!storeViewExists) {
    return res.status(404).json(errorMessage("Unable to find store view to delete", 404));
  }

  // Check if store view has associated data
  if (
    storeViewExists.productAttributeValues &&
    storeViewExists.productAttributeValues.length > 0
  ) {
    return res.status(400).json(
      errorMessage(
        "Cannot delete store view with associated product attribute values",
        400
      )
    );
  }

  if (
    storeViewExists.categoryTranslations &&
    storeViewExists.categoryTranslations.length > 0
  ) {
    return res.status(400).json(
      errorMessage(
        "Cannot delete store view with associated category translations",
        400
      )
    );
  }

  next();
};
