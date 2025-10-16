import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import {
  validateProductCreation,
  validateProductDelete,
  validateProductUpdate,
} from "../middlewares/validateProduct.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";

const router = express.Router();

router.get("/", asyncWrapper(getProducts));
router.get("/:id", asyncWrapper(getProduct));
router.post("/", validateProductCreation, asyncWrapper(createProduct));
router.put("/:id", validateProductUpdate, asyncWrapper(updateProduct));
router.delete("/:id", validateProductDelete, asyncWrapper(deleteProduct));

export default router;
