import express from "express";
import {
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
} from "../controllers/teamController.js";
import {
  validateTeamCreation,
  validateTeamUpdate,
} from "../middlewares/validateTeam.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";

const router = express.Router();

router.get("/", asyncWrapper(getTeams));
router.get("/:id", asyncWrapper(getTeam));
router.post("/", validateTeamCreation, asyncWrapper(createTeam));
router.put("/:id", validateTeamUpdate, asyncWrapper(updateTeam));
router.delete("/:id", asyncWrapper(deleteTeam));

export default router;
