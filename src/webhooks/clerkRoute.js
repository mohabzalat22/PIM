import express from "express";
import clerkController from "./clerkController.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { verifyClerkSignature } from "./verifyClerkSignature.middleware.js";
const router = express.Router();

// Define your clerk webhook route handlers here
router.post("/", verifyClerkSignature, asyncWrapper(clerkController));

export default router;