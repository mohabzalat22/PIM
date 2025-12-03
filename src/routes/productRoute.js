import express from "express";
import multer from "multer";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { exportProducts } from "../controllers/productExportController.js";
import { importProducts } from "../controllers/productImportController.js";
import {
  validateProductCreation,
  validateProductDelete,
  validateProductUpdate,
} from "../middlewares/validateProduct.js";
import { validateFileUpload } from "../middlewares/validateProductImport.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";

const router = express.Router();

// Configure multer for file upload (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Export/Import routes (must be before /:id to avoid conflicts)
router.get("/export", asyncWrapper(exportProducts));
router.post(
  "/import",
  upload.single("file"),
  validateFileUpload,
  asyncWrapper(importProducts)
);

// Standard CRUD routes
router.get("/", asyncWrapper(getProducts));
router.get("/:id", asyncWrapper(getProduct));
router.post("/", validateProductCreation, asyncWrapper(createProduct));
router.put("/:id", validateProductUpdate, asyncWrapper(updateProduct));
router.delete("/:id", validateProductDelete, asyncWrapper(deleteProduct));

export default router;
