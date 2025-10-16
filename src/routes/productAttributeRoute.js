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
import { asyncWrapper } from "../utils/asyncWrapper.js";
const router = express.Router();

router.get("/", asyncWrapper(getProductAttributes));
router.get("/:id", asyncWrapper(getProductAttribute));
router.post(
  "/",
  validateProductAttributeCreation,
  asyncWrapper(createProductAttribute)
);
router.put(
  "/:id",
  validateProductAttributeUpdate,
  asyncWrapper(updateProductAttribute)
);
router.delete(
  "/:id",
  validateProductAttributeDelete,
  asyncWrapper(deleteProductAttribute)
);

// Composite key delete routes
// For global scope (no store view)
router.delete(
  "/products/:productId/attributes/:attributeId",
  validateProductAttributeDeleteByCompositeKey,
  asyncWrapper(deleteProductAttributeByCompositeKey)
);
// For specific store view
router.delete(
  "/products/:productId/attributes/:attributeId/store-views/:storeViewId",
  validateProductAttributeDeleteByCompositeKey,
  deleteProductAttributeByCompositeKey
);

export default router;
