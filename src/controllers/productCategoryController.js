import {
  findAll,
  create,
  deleteByCompositeKey,
  findByProductId,
  findByCategoryId,
  findByCompositeKey,
} from "../models/productCategoryModel.js";
import { errorMessage, successMessage } from "../utils/message.js";

export const getProductCategories = async (req, res) => {
  const productCategories = (await findAll()) ?? [];
  res.json(successMessage(productCategories));
};

export const getProductCategoriesByProduct = async (req, res) => {
  const productId = Number(req.params.productId);
  if (!productId) {
    res.json(errorMessage("Product ID not found"));
  }
  const productCategories = (await findByProductId(productId)) ?? [];
  res.json(successMessage(productCategories));
};

export const getProductCategoriesByCategory = async (req, res) => {
  const categoryId = Number(req.params.categoryId);
  if (!categoryId) {
    res.json(errorMessage("Category ID not found"));
  }
  const productCategories = (await findByCategoryId(categoryId)) ?? [];
  res.json(successMessage(productCategories));
};

export const getProductCategory = async (req, res) => {
  const productId = Number(req.params.productId);
  const categoryId = Number(req.params.categoryId);

  if (!productId || !categoryId) {
    res.json(errorMessage("Product ID and Category ID not found"));
  }

  const productCategory =
    (await findByCompositeKey(productId, categoryId)) ?? {};
  res.json(successMessage(productCategory));
};

export const createProductCategory = async (req, res) => {
  const result = await create(req.body);
  if (!result) {
    res.json(
      errorMessage("Failed to create new product category", 500, result.error)
    );
  }
  res.json(successMessage(result));
};

export const deleteProductCategory = async (req, res) => {
  const productId = Number(req.params.productId);
  const categoryId = Number(req.params.categoryId);

  const result = await deleteByCompositeKey(productId, categoryId);
  if (!result) {
    res.json(errorMessage("Failed to delete product category"));
  }
  res.json(successMessage("Product category deleted successfully"));
};
