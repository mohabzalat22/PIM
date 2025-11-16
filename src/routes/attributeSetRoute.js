import express from "express";
import {
  getAttributeSets,
  getAttributeSet,
  createAttributeSet,
  updateAttributeSet,
  deleteAttributeSet,
  addAttributeToAttributeSet,
  removeAttributeFromAttributeSet,
  addAttributeToAttributeGroupInSet,
  removeAttributeFromAttributeGroupInSet,
} from "../controllers/attributeSetController.js";
import {
  validateAttributeSetCreation,
  validateAttributeSetUpdate,
  validateAttributeSetDelete,
} from "../middlewares/validateAttributeSet.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";

const router = express.Router();

router.get("/", asyncWrapper(getAttributeSets));
router.get("/:id", asyncWrapper(getAttributeSet));
router.post("/", validateAttributeSetCreation, asyncWrapper(createAttributeSet));
router.put("/:id", validateAttributeSetUpdate, asyncWrapper(updateAttributeSet));
router.delete("/:id", validateAttributeSetDelete, asyncWrapper(deleteAttributeSet));

router.post(
  "/:id/attributes",
  asyncWrapper(addAttributeToAttributeSet)
);
router.delete(
  "/:id/attributes/:relationId",
  asyncWrapper(removeAttributeFromAttributeSet)
);

router.post(
  "/:id/groups/:groupId/attributes",
  asyncWrapper(addAttributeToAttributeGroupInSet)
);
router.delete(
  "/:id/groups/:groupId/attributes/:relationId",
  asyncWrapper(removeAttributeFromAttributeGroupInSet)
);

export default router;
