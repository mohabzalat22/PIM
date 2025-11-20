import {
  findAll,
  create,
  deleteByCompositeKey,
  findByProductId,
  findByCategoryId,
  findByCompositeKey,
} from "../models/productCategoryModel.js";

export const getProductCategories = async (req, res) => {
  const productCategories = (await findAll()) ?? [];
  res.success(productCategories, "Product categories retrieved successfully");
};

export const getProductCategoriesByProduct = async (req, res) => {
  const productId = Number(req.params.productId);
  if (!productId) {
    return res.badRequest("Product ID is required");
  }
  const productCategories = (await findByProductId(productId)) ?? [];
  res.success(productCategories, "Product categories retrieved successfully");
};

export const getProductCategoriesByCategory = async (req, res) => {
  const categoryId = Number(req.params.categoryId);
  if (!categoryId) {
    return res.badRequest("Category ID is required");
  }
  const productCategories = (await findByCategoryId(categoryId)) ?? [];
  res.success(productCategories, "Product categories retrieved successfully");
};

export const getProductCategory = async (req, res) => {
  const productId = Number(req.params.productId);
  const categoryId = Number(req.params.categoryId);

  if (!productId || !categoryId) {
    return res.badRequest("Product ID and category ID are required");
  }

  const productCategory =
    (await findByCompositeKey(productId, categoryId)) ?? {};
  res.success(productCategory, "Product category retrieved successfully");
};

export const createProductCategory = async (req, res) => {
  const result = await create(req.body);
  if (!result) {
    return res.error("Failed to create new product category", 500, result.error);
  }
  res.created(result, "Product category created successfully");
};

export const deleteProductCategory = async (req, res) => {
  const productId = Number(req.params.productId);
  const categoryId = Number(req.params.categoryId);

  const result = await deleteByCompositeKey(productId, categoryId);
  if (!result) {
    return res.error("Failed to delete product category");
  }
  res.success(result, "Product category deleted successfully");
};
