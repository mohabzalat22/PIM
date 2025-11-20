import z from "zod";
import { findById } from "../models/categoryModel.js";

const categorySchema = z.object({
  parentId: z.number().int().positive().optional().nullable(),
});

export const validateCategoryCreation = async (req, res, next) => {
  const result = categorySchema.safeParse(req.body);

  if (!result.success) {
    return res.error("Category validation failed. Please check the provided data.", 500, result.error);
  }

  // Check if parent category exists (if parentId is provided)
  if (result.data.parentId) {
    const parentExists = await findById(result.data.parentId);
    if (!parentExists) {
      return res.notFound(`Parent category with ID ${result.data.parentId} was not found.`);
    }
  }

  next();
};

export const validateCategoryUpdate = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.error("Category ID is required and must be a valid number.", 500);
  }

  const result = categorySchema.safeParse(req.body);
  const categoryExists = await findById(id);

  if (!result.success) {
    return res.error("Category update validation failed. Please check the provided data.", 500);
  }

  if (!categoryExists) {
    return res.error(`Category with ID ${id} was not found in the system.`, 500);
  }

  // Check if parent category exists (if parentId is provided)
  if (result.data.parentId) {
    const parentExists = await findById(result.data.parentId);
    if (!parentExists) {
      return res.notFound(`Parent category with ID ${result.data.parentId} was not found.`);
    }

    // Prevent setting parent to itself
    if (result.data.parentId === id) {
      return res.badRequest("A category cannot be set as its own parent.");
    }
  }

  next();
};

export const validateCategoryDelete = async (req, res, next) => {
  const id = Number(req.params.id);
  const categoryExists = await findById(id);

  if (!id) {
    return res.error("Category ID is required and must be a valid number.", 500);
  }

  if (!categoryExists) {
    return res.error(`Category with ID ${id} was not found and cannot be deleted.`, 500);
  }

  // Check if category has subcategories
  if (categoryExists.subcategory && categoryExists.subcategory.length > 0) {
    return res.badRequest(`Cannot delete category because it contains ${categoryExists.subcategory.length} subcategory(ies). Please delete or reassign subcategories first.`);
  }

  next();
};
