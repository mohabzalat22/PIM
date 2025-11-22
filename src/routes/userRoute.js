import express from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import {
  validateUserCreation,
  validateUserUpdate,
} from "../middlewares/validateUser.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";

const router = express.Router();

router.get("/", asyncWrapper(getUsers));
router.get("/:id", asyncWrapper(getUser));
router.post("/", validateUserCreation, asyncWrapper(createUser));
router.put("/:id", validateUserUpdate, asyncWrapper(updateUser));
router.delete("/:id", asyncWrapper(deleteUser));

export default router;
