import z from "zod";
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
    return res.error("Product category validation failed. Please check the provided data.", 500, result.error);
  }

  // Check if product exists
  const productExists = await findProductById(result.data.productId);
  if (!productExists) {
    return res.notFound(`Product with ID ${result.data.productId} was not found in the system.`);
  }

  // Check if category exists
  const categoryExists = await findCategoryById(result.data.categoryId);
  if (!categoryExists) {
    return res.notFound(`Category with ID ${result.data.categoryId} was not found in the system.`);
  }

  // Check if product category relationship already exists
  const productCategoryExists = await findByCompositeKey(
    result.data.productId,
    result.data.categoryId
  );

  if (productCategoryExists) {
    return res.error(`Product is already assigned to this category.`, 409);
  }
  next();
};

export const validateProductCategoryDelete = async (req, res, next) => {
  const productId = Number(req.params.productId);
  const categoryId = Number(req.params.categoryId);

  const productCategoryExists = await findByCompositeKey(productId, categoryId);

  if (!productId || !categoryId) {
    return res.error("Both Product ID and Category ID are required parameters.", 500);
  }

  if (!productCategoryExists) {
    return res.error(`Product category relationship not found for product ID ${productId} and category ID ${categoryId}.`, 500);
  }
  next();
};
