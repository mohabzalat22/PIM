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
import { asyncWrapper } from "../utils/asyncWrapper.js";

const router = express.Router();

router.get("/", asyncWrapper(getCategoryTranslations));
router.get(
  "/category/:categoryId",
  asyncWrapper(getCategoryTranslationsByCategory)
);
router.get(
  "/storeview/:storeViewId",
  asyncWrapper(getCategoryTranslationsByStoreView)
);
router.get(
  "/composite/:categoryId/:storeViewId",
  asyncWrapper(getCategoryTranslationByComposite)
);
router.get("/:id", asyncWrapper(getCategoryTranslation));
router.post(
  "/",
  validateCategoryTranslationCreation,
  asyncWrapper(createCategoryTranslation)
);
router.put(
  "/:id",
  validateCategoryTranslationUpdate,
  asyncWrapper(updateCategoryTranslation)
);
router.delete(
  "/:id",
  validateCategoryTranslationDelete,
  asyncWrapper(deleteCategoryTranslation)
);

export default router;
