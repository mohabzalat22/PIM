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

const router = express.Router();

router.get("/", getAttributes);
router.get("/:id", getAttribute);
router.post("/", validateAttributeCreation, createAttribute);
router.put("/:id", validateAttributeUpdate, updateAttribute);
router.delete("/:id", validateAttributeDelete, deleteAttribute);

export default router;
