import z from "zod";
import { errorMessage } from "../utils/message.js";
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
    return res.json(
      errorMessage("Failed to validate category translation", 500, result.error)
    );
  }

  // Check if category exists
  const categoryExists = await findCategoryById(result.data.categoryId);
  if (!categoryExists) {
    return res.json(errorMessage("Category not found", 404));
  }

  // Check if store view exists
  const storeViewExists = await findStoreViewById(result.data.storeViewId);
  if (!storeViewExists) {
    return res.json(errorMessage("Store view not found", 404));
  }

  // Check if translation already exists for this category and store view
  const translationExists = await findByCompositeKey(
    result.data.categoryId,
    result.data.storeViewId
  );

  if (translationExists) {
    return res.json(
      errorMessage(
        "Translation for this category and store view already exists",
        409
      )
    );
  }
  next();
};

export const validateCategoryTranslationUpdate = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.json(errorMessage("ID not defined"));
  }

  const result = categoryTranslationSchema.safeParse(req.body);
  const translationExists = await findById(id);

  if (!result.success) {
    return res.json(
      errorMessage("Failed to validate category translation update")
    );
  }

  if (!translationExists) {
    return res.json(
      errorMessage("Unable to find category translation to update")
    );
  }

  // Check if category exists
  if (result.data.categoryId) {
    const categoryExists = await findCategoryById(result.data.categoryId);
    if (!categoryExists) {
      return res.json(errorMessage("Category not found", 404));
    }
  }

  // Check if store view exists
  if (result.data.storeViewId) {
    const storeViewExists = await findStoreViewById(result.data.storeViewId);
    if (!storeViewExists) {
      return res.json(errorMessage("Store view not found", 404));
    }
  }

  next();
};

export const validateCategoryTranslationDelete = async (req, res, next) => {
  const id = Number(req.params.id);
  const translationExists = await findById(id);

  if (!id) {
    return res.json(errorMessage("ID not defined"));
  }

  if (!translationExists) {
    return res.json(
      errorMessage("Unable to find category translation to delete")
    );
  }
  next();
};
