import express from "express";
import {
  getProductCategories,
  getProductCategory,
  createProductCategory,
  deleteProductCategory,
  getProductCategoriesByProduct,
  getProductCategoriesByCategory,
} from "../controllers/productCategoryController.js";
import {
  validateProductCategoryCreation,
  validateProductCategoryDelete,
} from "../middlewares/validateProductCategory.js";

const router = express.Router();

router.get("/", getProductCategories);
router.get("/product/:productId", getProductCategoriesByProduct);
router.get("/category/:categoryId", getProductCategoriesByCategory);
router.get("/:productId/:categoryId", getProductCategory);
router.post("/", validateProductCategoryCreation, createProductCategory);
router.delete(
  "/:productId/:categoryId",
  validateProductCategoryDelete,
  deleteProductCategory
);

export default router;
