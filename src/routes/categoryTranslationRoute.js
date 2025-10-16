import express from "express";
import {
  getCategoryTranslations,
  getCategoryTranslation,
  createCategoryTranslation,
  updateCategoryTranslation,
  deleteCategoryTranslation,
  getCategoryTranslationsByCategory,
  getCategoryTranslationsByStoreView,
  getCategoryTranslationByComposite,
} from "../controllers/categoryTranslationController.js";
import {
  validateCategoryTranslationCreation,
  validateCategoryTranslationDelete,
  validateCategoryTranslationUpdate,
} from "../middlewares/validateCategoryTranslation.js";

const router = express.Router();

router.get("/", getCategoryTranslations);
router.get("/category/:categoryId", getCategoryTranslationsByCategory);
router.get("/storeview/:storeViewId", getCategoryTranslationsByStoreView);
router.get(
  "/composite/:categoryId/:storeViewId",
  getCategoryTranslationByComposite
);
router.get("/:id", getCategoryTranslation);
router.post(
  "/",
  validateCategoryTranslationCreation,
  createCategoryTranslation
);
router.put(
  "/:id",
  validateCategoryTranslationUpdate,
  updateCategoryTranslation
);
router.delete(
  "/:id",
  validateCategoryTranslationDelete,
  deleteCategoryTranslation
);

export default router;
