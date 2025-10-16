import z from "zod";
import { errorMessage } from "../utils/message.js";
import { findById } from "../models/categoryModel.js";

const categorySchema = z.object({
  parentId: z.number().int().positive().optional().nullable(),
});

export const validateCategoryCreation = async (req, res, next) => {
  const result = categorySchema.safeParse(req.body);

  if (!result.success) {
    return res.json(
      errorMessage("Failed to validate category", 500, result.error)
    );
  }

  // Check if parent category exists (if parentId is provided)
  if (result.data.parentId) {
    const parentExists = await findById(result.data.parentId);
    if (!parentExists) {
      return res.json(errorMessage("Parent category not found", 404));
    }
  }

  next();
};

export const validateCategoryUpdate = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.json(errorMessage("ID not defined"));
  }

  const result = categorySchema.safeParse(req.body);
  const categoryExists = await findById(id);

  if (!result.success) {
    return res.json(errorMessage("Failed to validate category update"));
  }

  if (!categoryExists) {
    return res.json(errorMessage("Unable to find category to update"));
  }

  // Check if parent category exists (if parentId is provided)
  if (result.data.parentId) {
    const parentExists = await findById(result.data.parentId);
    if (!parentExists) {
      return res.json(errorMessage("Parent category not found", 404));
    }

    // Prevent setting parent to itself
    if (result.data.parentId === id) {
      return res.json(errorMessage("Category cannot be its own parent", 400));
    }
  }

  next();
};

export const validateCategoryDelete = async (req, res, next) => {
  const id = Number(req.params.id);
  const categoryExists = await findById(id);

  if (!id) {
    return res.json(errorMessage("ID not defined"));
  }

  if (!categoryExists) {
    return res.json(errorMessage("Unable to find category to delete"));
  }

  // Check if category has subcategories
  if (categoryExists.subcategory && categoryExists.subcategory.length > 0) {
    return res.json(
      errorMessage("Cannot delete category with subcategories", 400)
    );
  }

  next();
};
