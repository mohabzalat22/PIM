import express from "express";

import {
  getProductAttributes,
  getProductAttribute,
  createProductAttribute,
  updateProductAttribute,
  deleteProductAttribute,
  deleteProductAttributeByCompositeKey,
} from "../controllers/productAttributeController.js";
import {
  validateProductAttributeCreation,
  validateProductAttributeUpdate,
  validateProductAttributeDelete,
  validateProductAttributeDeleteByCompositeKey,
} from "../middlewares/validateProductAttribute.js";
const router = express.Router();

router.get("/", getProductAttributes);
router.get("/:id", getProductAttribute);
router.post("/", validateProductAttributeCreation, createProductAttribute);
router.put("/:id", validateProductAttributeUpdate, updateProductAttribute);
router.delete("/:id", validateProductAttributeDelete, deleteProductAttribute);

// Composite key delete routes
// For global scope (no store view)
router.delete(
  "/products/:productId/attributes/:attributeId",
  validateProductAttributeDeleteByCompositeKey,
  deleteProductAttributeByCompositeKey
);
// For specific store view
router.delete(
  "/products/:productId/attributes/:attributeId/store-views/:storeViewId",
  validateProductAttributeDeleteByCompositeKey,
  deleteProductAttributeByCompositeKey
);

export default router;
