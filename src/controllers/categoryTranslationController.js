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
import { errorMessage, successMessage } from "../utils/message.js";

export const getCategoryTranslations = async (req, res) => {
  const translations = (await findAll()) ?? [];
  res.json(successMessage(translations));
};

export const getCategoryTranslationsByCategory = async (req, res) => {
  const categoryId = Number(req.params.categoryId);
  if (!categoryId) {
    res.json(errorMessage("Category ID not found"));
  }
  const translations = (await findByCategoryId(categoryId)) ?? [];
  res.json(successMessage(translations));
};

export const getCategoryTranslationsByStoreView = async (req, res) => {
  const storeViewId = Number(req.params.storeViewId);
  if (!storeViewId) {
    res.json(errorMessage("Store View ID not found"));
  }
  const translations = (await findByStoreViewId(storeViewId)) ?? [];
  res.json(successMessage(translations));
};

export const getCategoryTranslationByComposite = async (req, res) => {
  const categoryId = Number(req.params.categoryId);
  const storeViewId = Number(req.params.storeViewId);

  if (!categoryId || !storeViewId) {
    res.json(errorMessage("Category ID and Store View ID not found"));
  }

  const translation = (await findByCompositeKey(categoryId, storeViewId)) ?? {};
  res.json(successMessage(translation));
};

export const getCategoryTranslation = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    res.json(errorMessage("ID not found"));
  }
  const translation = (await findById(id)) ?? {};
  res.json(successMessage(translation));
};

export const createCategoryTranslation = async (req, res) => {
  const result = await create(req.body);
  if (!result) {
    res.json(
      errorMessage(
        "Failed to create new category translation",
        500,
        result.error
      )
    );
  }
  res.json(successMessage(result));
};

export const updateCategoryTranslation = async (req, res) => {
  const id = Number(req.params.id);
  const result = await update(id, req.body);
  if (!result) {
    res.json(errorMessage("Failed to update category translation"));
  }
  res.json(successMessage("Category translation updated successfully"));
};

export const deleteCategoryTranslation = async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteById(id);
  if (!result) {
    res.json(errorMessage("Failed to delete category translation"));
  }
  res.json(successMessage("Category translation deleted successfully"));
};
