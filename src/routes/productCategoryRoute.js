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
import { asyncWrapper } from "../utils/asyncWrapper.js";

const router = express.Router();

router.get("/", asyncWrapper(getProductCategories));
router.get("/product/:productId", asyncWrapper(getProductCategoriesByProduct));
router.get(
  "/category/:categoryId",
  asyncWrapper(getProductCategoriesByCategory)
);
router.get("/:productId/:categoryId", asyncWrapper(getProductCategory));
router.post(
  "/",
  validateProductCategoryCreation,
  asyncWrapper(createProductCategory)
);
router.delete(
  "/:productId/:categoryId",
  validateProductCategoryDelete,
  asyncWrapper(deleteProductCategory)
);

export default router;
