import express from "express";
import { getLocales, getLocale, createLocale, updateLocale, deleteLocale } from "../controllers/localeController.js";
import { validateLocaleCreation, validateLocaleDelete, validateLocaleUpdate } from "../middlewares/validateLocale.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";

const router = express.Router();

router.get("/", asyncWrapper(getLocales));
router.get("/:id", asyncWrapper(getLocale));
router.post("/", validateLocaleCreation, asyncWrapper(createLocale));
router.put("/:id", validateLocaleUpdate, asyncWrapper(updateLocale));
router.delete("/:id", validateLocaleDelete, asyncWrapper(deleteLocale));

export default router;
