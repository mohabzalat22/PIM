import express from "express";
import {
  getAttributes,
  getAttribute,
  createAttribute,
  updateAttribute,
  deleteAttribute,
} from "../controllers/attributeController.js";
import {
  validateAttributeCreation,
  validateAttributeUpdate,
  validateAttributeDelete,
} from "../middlewares/validateAttribute.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";

const router = express.Router();

router.get("/", asyncWrapper(getAttributes));
router.get("/:id", asyncWrapper(getAttribute));
router.post("/", validateAttributeCreation, asyncWrapper(createAttribute));
router.put("/:id", validateAttributeUpdate, asyncWrapper(updateAttribute));
router.delete("/:id", validateAttributeDelete, asyncWrapper(deleteAttribute));

export default router;
