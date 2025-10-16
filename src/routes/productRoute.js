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

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", validateProductCreation, createProduct);
router.put("/:id", validateProductUpdate, updateProduct);
router.delete("/:id", validateProductDelete, deleteProduct);

export default router;
