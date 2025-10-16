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

const router = express.Router();

router.get("/", getCategories);
router.get("/root", getRootCategories);
router.get("/parent/:parentId", getCategoriesByParent);
router.get("/:id", getCategory);
router.post("/", validateCategoryCreation, createCategory);
router.put("/:id", validateCategoryUpdate, updateCategory);
router.delete("/:id", validateCategoryDelete, deleteCategory);

export default router;
