import express from "express";
import {
  getStoreViews,
  getStoreView,
  createStoreView,
  updateStoreView,
  deleteStoreView,
  getStoreViewByCode,
  getStoreViewsByStore,
} from "../controllers/storeViewController.js";
import {
  validateStoreViewCreation,
  validateStoreViewDelete,
  validateStoreViewUpdate,
} from "../middlewares/validateStoreView.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";

const router = express.Router();

router.get("/", asyncWrapper(getStoreViews));
router.get("/store/:storeId", asyncWrapper(getStoreViewsByStore));
router.get("/code/:code", asyncWrapper(getStoreViewByCode));
router.get("/:id", asyncWrapper(getStoreView));
router.post("/", validateStoreViewCreation, asyncWrapper(createStoreView));
router.put("/:id", validateStoreViewUpdate, asyncWrapper(updateStoreView));
router.delete("/:id", validateStoreViewDelete, asyncWrapper(deleteStoreView));

export default router;
