import express from "express";
import {
  getTeamMembers,
  getTeamMember,
  getMembersByTeam,
  getTeamsByUser,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../controllers/teamMemberController.js";
import {
  validateTeamMemberCreation,
  validateTeamMemberUpdate,
} from "../middlewares/validateTeamMember.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";

const router = express.Router();

router.get("/", asyncWrapper(getTeamMembers));
router.get("/team/:teamId", asyncWrapper(getMembersByTeam));
router.get("/user/:userId", asyncWrapper(getTeamsByUser));
router.get("/:id", asyncWrapper(getTeamMember));
router.post("/", validateTeamMemberCreation, asyncWrapper(createTeamMember));
router.put("/:id", validateTeamMemberUpdate, asyncWrapper(updateTeamMember));
router.delete("/:id", asyncWrapper(deleteTeamMember));

export default router;
