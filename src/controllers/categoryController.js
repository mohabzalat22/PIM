import {
  findAll,
  create,
  update,
  deleteById,
  findById,
  findByParentId,
  findRootCategories,
} from "../models/categoryModel.js";
import { errorMessage, successMessage } from "../utils/message.js";

export const getCategories = async (req, res) => {
  const categories = (await findAll()) ?? [];
  res.json(successMessage(categories));
};

export const getRootCategories = async (req, res) => {
  const categories = (await findRootCategories()) ?? [];
  res.json(successMessage(categories));
};

export const getCategoriesByParent = async (req, res) => {
  const parentId = Number(req.params.parentId);
  if (!parentId) {
    res.json(errorMessage("Parent ID not found"));
  }
  const categories = (await findByParentId(parentId)) ?? [];
  res.json(successMessage(categories));
};

export const getCategory = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    res.json(errorMessage("ID not found"));
  }
  const category = (await findById(id)) ?? {};
  res.json(successMessage(category));
};

export const createCategory = async (req, res) => {
  const result = await create(req.body);
  if (!result) {
    res.json(errorMessage("Failed to create new category", 500, result.error));
  }
  res.json(successMessage(result));
};

export const updateCategory = async (req, res) => {
  const id = Number(req.params.id);
  const result = await update(id, req.body);
  if (!result) {
    res.json(errorMessage("Failed to update category"));
  }
  res.json(successMessage("Category updated successfully"));
};

export const deleteCategory = async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteById(id);
  if (!result) {
    res.json(errorMessage("Failed to delete category"));
  }
  res.json(successMessage("Category deleted successfully"));
};
