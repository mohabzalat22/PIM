import {
  findAll,
  create,
  update,
  deleteById,
  findById,
  findByParentId,
  findRootCategories,
} from "../models/categoryModel.js";

export const getCategories = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const filters = {
    search: req.query.search || null,
    parentId: req.query.parentId || null,
    sortBy: req.query.sortBy || 'createdAt',
    sortOrder: req.query.sortOrder || 'desc'
  };

  const [categories, total] = (await findAll(skip, limit, filters)) ?? [];
  
  const meta = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
  
  res.success(categories, "Categories retrieved successfully", meta);
};

export const getRootCategories = async (req, res) => {
  const categories = (await findRootCategories()) ?? [];
  res.success(categories, "Root categories retrieved successfully");
};

export const getCategoriesByParent = async (req, res) => {
  const parentId = Number(req.params.parentId);
  if (!parentId) {
    return res.badRequest("Parent category ID is required");
  }
  const categories = (await findByParentId(parentId)) ?? [];
  res.success(categories, "Child categories retrieved successfully");
};

export const getCategory = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.badRequest("Category ID is required");
  }
  const category = (await findById(id)) ?? {};
  res.success(category, "Category retrieved successfully");
};

export const createCategory = async (req, res) => {
  const result = await create(req.body);
  if (!result) {
    return res.error("Failed to create new category", 500, result.error);
  }
  res.created(result, "Category created successfully");
};

export const updateCategory = async (req, res) => {
  const id = Number(req.params.id);
  const result = await update(id, req.body);
  if (!result) {
    return res.error("Failed to update category");
  }
  res.success(result, "Category updated successfully");
};

export const deleteCategory = async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteById(id);
  if (!result) {
    return res.error("Failed to delete category");
  }
  res.success(result, "Category deleted successfully");
};
