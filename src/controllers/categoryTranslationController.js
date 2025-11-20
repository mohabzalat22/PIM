import {
  findAll,
  create,
  update,
  deleteById,
  findById,
  findByCategoryId,
  findByStoreViewId,
  findByCompositeKey,
} from "../models/categoryTranslationModel.js";

export const getCategoryTranslations = async (req, res) => {
  const translations = (await findAll()) ?? [];
  res.success(translations, "Category translations retrieved successfully");
};

export const getCategoryTranslationsByCategory = async (req, res) => {
  const categoryId = Number(req.params.categoryId);
  if (!categoryId) {
    return res.badRequest("Category ID is required");
  }
  const translations = (await findByCategoryId(categoryId)) ?? [];
  res.success(translations, "Category translations retrieved successfully");
};

export const getCategoryTranslationsByStoreView = async (req, res) => {
  const storeViewId = Number(req.params.storeViewId);
  if (!storeViewId) {
    return res.badRequest("Store view ID is required");
  }
  const translations = (await findByStoreViewId(storeViewId)) ?? [];
  res.success(translations, "Category translations retrieved successfully");
};

export const getCategoryTranslationByComposite = async (req, res) => {
  const categoryId = Number(req.params.categoryId);
  const storeViewId = Number(req.params.storeViewId);

  if (!categoryId || !storeViewId) {
    return res.badRequest("Category ID and store view ID are required");
  }

  const translation = (await findByCompositeKey(categoryId, storeViewId)) ?? {};
  res.success(translation, "Category translation retrieved successfully");
};

export const getCategoryTranslation = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.badRequest("Translation ID is required");
  }
  const translation = (await findById(id)) ?? {};
  res.success(translation, "Category translation retrieved successfully");
};

export const createCategoryTranslation = async (req, res) => {
  const result = await create(req.body);
  if (!result) {
    return res.error("Failed to create new category translation", 500, result.error);
  }
  res.created(result, "Category translation created successfully");
};

export const updateCategoryTranslation = async (req, res) => {
  const id = Number(req.params.id);
  const result = await update(id, req.body);
  if (!result) {
    return res.error("Failed to update category translation");
  }
  res.success(result, "Category translation updated successfully");
};

export const deleteCategoryTranslation = async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteById(id);
  if (!result) {
    return res.error("Failed to delete category translation");
  }
  res.success(result, "Category translation deleted successfully");
};
