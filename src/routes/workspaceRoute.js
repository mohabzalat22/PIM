import express from "express";
import {
  getWorkspaces,
  getWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
} from "../controllers/workspaceController.js";
import {
  validateWorkspaceCreation,
  validateWorkspaceUpdate,
} from "../middlewares/validateWorkspace.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";

const router = express.Router();

router.get("/", asyncWrapper(getWorkspaces));
router.get("/:id", asyncWrapper(getWorkspace));
router.post("/", validateWorkspaceCreation, asyncWrapper(createWorkspace));
router.put("/:id", validateWorkspaceUpdate, asyncWrapper(updateWorkspace));
router.delete("/:id", asyncWrapper(deleteWorkspace));

export default router;