import {
  findAll,
  create,
  update,
  deleteById,
  findById,
} from "../models/productModel.js";

export const getProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // current page
  const limit = parseInt(req.query.limit) || 10; // items per page
  const skip = (page - 1) * limit;
  
  // Extract filter parameters
  const filters = {
    search: req.query.search || null,
    type: req.query.type || null,
    categoryId: req.query.categoryId || null,
    attributeFilters: req.query.attributes ? JSON.parse(req.query.attributes) : null,
    sortBy: req.query.sortBy || 'createdAt',
    sortOrder: req.query.sortOrder || 'desc'
  };

  const [products, total] = (await findAll(skip, limit, filters)) ?? [];

  // meta data
  const meta = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  res.success(products, "Products retrieved successfully", meta);
};

export const getProduct = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.badRequest("Product ID is required");
  }
  const product = (await findById(id)) ?? [];
  res.success(product, "Product retrieved successfully");
};

export const createProduct = async (req, res) => {
  const result = create(req.body);
  if (!result) {
    return res.error("Failed to create new product", 500, result.error);
  }
  res.created(result, "Product created successfully");
};

export const updateProduct = async (req, res) => {
  const id = Number(req.params.id);
  const result = await update(id, req.body);
  if (!result) {
    return res.error("Failed to update product");
  }
  res.success(result, "Product updated successfully");
};

export const deleteProduct = async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteById(id);
  if (!result) {
    return res.error("Failed to delete product");
  }
  res.success(result, "Product deleted successfully");
};
