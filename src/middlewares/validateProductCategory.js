import z from "zod";
import { errorMessage } from "../utils/message.js";
import { findByCompositeKey } from "../models/productCategoryModel.js";
import { findById as findProductById } from "../models/productModel.js";
import { findById as findCategoryById } from "../models/categoryModel.js";

const productCategorySchema = z.object({
  productId: z.number().int().positive("Product ID must be a positive integer"),
  categoryId: z
    .number()
    .int()
    .positive("Category ID must be a positive integer"),
});

export const validateProductCategoryCreation = async (req, res, next) => {
  const result = productCategorySchema.safeParse(req.body);

  if (!result.success) {
    return res.json(
      errorMessage("Failed to validate product category", 500, result.error)
    );
  }

  // Check if product exists
  const productExists = await findProductById(result.data.productId);
  if (!productExists) {
    return res.json(errorMessage("Product not found", 404));
  }

  // Check if category exists
  const categoryExists = await findCategoryById(result.data.categoryId);
  if (!categoryExists) {
    return res.json(errorMessage("Category not found", 404));
  }

  // Check if product category relationship already exists
  const productCategoryExists = await findByCompositeKey(
    result.data.productId,
    result.data.categoryId
  );

  if (productCategoryExists) {
    return res.json(
      errorMessage("Product category relationship already exists", 409)
    );
  }
  next();
};

export const validateProductCategoryDelete = async (req, res, next) => {
  const productId = Number(req.params.productId);
  const categoryId = Number(req.params.categoryId);

  const productCategoryExists = await findByCompositeKey(productId, categoryId);

  if (!productId || !categoryId) {
    return res.json(errorMessage("Product ID and Category ID are required"));
  }

  if (!productCategoryExists) {
    return res.json(errorMessage("Unable to find product category to delete"));
  }
  next();
};
