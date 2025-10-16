import express from "express";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getRootCategories,
  getCategoriesByParent,
} from "../controllers/categoryController.js";
import {
  validateCategoryCreation,
  validateCategoryDelete,
  validateCategoryUpdate,
} from "../middlewares/validateCategory.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";

const router = express.Router();

router.get("/", asyncWrapper(getCategories));
router.get("/root", asyncWrapper(getRootCategories));
router.get("/parent/:parentId", asyncWrapper(getCategoriesByParent));
router.get("/:id", asyncWrapper(getCategory));
router.post("/", validateCategoryCreation, asyncWrapper(createCategory));
router.put("/:id", validateCategoryUpdate, asyncWrapper(updateCategory));
router.delete("/:id", validateCategoryDelete, asyncWrapper(deleteCategory));

export default router;
