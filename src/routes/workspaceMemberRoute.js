import express from "express";
import {
  getWorkspaceMembers,
  getWorkspaceMember,
  getMembersByWorkspace,
  getWorkspacesByUser,
  createWorkspaceMember,
  updateWorkspaceMember,
  deleteWorkspaceMember,
} from "../controllers/workspaceMemberController.js";
import {
  validateWorkspaceMemberCreation,
  validateWorkspaceMemberUpdate,
} from "../middlewares/validateWorkspaceMember.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";

const router = express.Router();

router.get("/", asyncWrapper(getWorkspaceMembers));
router.get("/workspace/:workspaceId", asyncWrapper(getMembersByWorkspace));
router.get("/user/:userId", asyncWrapper(getWorkspacesByUser));
router.get("/:id", asyncWrapper(getWorkspaceMember));
router.post("/", validateWorkspaceMemberCreation, asyncWrapper(createWorkspaceMember));
router.put("/:id", validateWorkspaceMemberUpdate, asyncWrapper(updateWorkspaceMember));
router.delete("/:id", asyncWrapper(deleteWorkspaceMember));

export default router;