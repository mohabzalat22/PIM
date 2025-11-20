import z from "zod";
import {
  findById,
  findByCompositeKey,
} from "../models/categoryTranslationModel.js";
import { findById as findCategoryById } from "../models/categoryModel.js";
import { findById as findStoreViewById } from "../models/storeViewModel.js";

const categoryTranslationSchema = z.object({
  categoryId: z
    .number()
    .int()
    .positive("Category ID must be a positive integer"),
  storeViewId: z
    .number()
    .int()
    .positive("Store View ID must be a positive integer"),
  name: z.string().optional().nullable(),
  slug: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export const validateCategoryTranslationCreation = async (req, res, next) => {
  const result = categoryTranslationSchema.safeParse(req.body);

  if (!result.success) {
    return res.error("Category translation validation failed. Please check the provided data.", 500, result.error);
  }

  // Check if category exists
  const categoryExists = await findCategoryById(result.data.categoryId);
  if (!categoryExists) {
    return res.notFound(`Category with ID ${result.data.categoryId} was not found in the system.`);
  }

  // Check if store view exists
  const storeViewExists = await findStoreViewById(result.data.storeViewId);
  if (!storeViewExists) {
    return res.notFound(`Store view with ID ${result.data.storeViewId} was not found in the system.`);
  }

  // Check if translation already exists for this category and store view
  const translationExists = await findByCompositeKey(
    result.data.categoryId,
    result.data.storeViewId
  );

  if (translationExists) {
    return res.error(
      `A translation for category ID ${result.data.categoryId} and store view ID ${result.data.storeViewId} already exists.`,
      409
    );
  }
  next();
};

export const validateCategoryTranslationUpdate = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.error("Translation ID is required and must be a valid number.", 500);
  }

  const result = categoryTranslationSchema.safeParse(req.body);
  const translationExists = await findById(id);

  if (!result.success) {
    return res.error("Category translation update validation failed. Please check the provided data.", 500);
  }

  if (!translationExists) {
    return res.error(`Category translation with ID ${id} was not found in the system.`, 500);
  }

  // Check if category exists
  if (result.data.categoryId) {
    const categoryExists = await findCategoryById(result.data.categoryId);
    if (!categoryExists) {
      return res.notFound(`Category with ID ${result.data.categoryId} was not found in the system.`);
    }
  }

  // Check if store view exists
  if (result.data.storeViewId) {
    const storeViewExists = await findStoreViewById(result.data.storeViewId);
    if (!storeViewExists) {
      return res.notFound(`Store view with ID ${result.data.storeViewId} was not found in the system.`);
    }
  }

  next();
};

export const validateCategoryTranslationDelete = async (req, res, next) => {
  const id = Number(req.params.id);
  const translationExists = await findById(id);

  if (!id) {
    return res.error("Translation ID is required and must be a valid number.", 500);
  }

  if (!translationExists) {
    return res.error(`Category translation with ID ${id} was not found and cannot be deleted.`, 500);
  }
  next();
};
