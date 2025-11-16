import express from "express";
import {
  getAttributeGroups,
  getAttributeGroup,
  createAttributeGroup,
  updateAttributeGroup,
  deleteAttributeGroup,
  getAttributeGroupAttributes,
} from "../controllers/attributeGroupController.js";
import {
  validateAttributeGroupCreation,
  validateAttributeGroupUpdate,
  validateAttributeGroupDelete,
} from "../middlewares/validateAttributeSet.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";

const router = express.Router();

router.get("/", asyncWrapper(getAttributeGroups));
router.get("/:id", asyncWrapper(getAttributeGroup));
router.get("/:id/attributes", asyncWrapper(getAttributeGroupAttributes));
router.post(
  "/",
  validateAttributeGroupCreation,
  asyncWrapper(createAttributeGroup)
);
router.put(
  "/:id",
  validateAttributeGroupUpdate,
  asyncWrapper(updateAttributeGroup)
);
router.delete(
  "/:id",
  validateAttributeGroupDelete,
  asyncWrapper(deleteAttributeGroup)
);

export default router;
