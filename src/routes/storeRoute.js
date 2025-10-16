import express from "express";
import {
  getStores,
  getStore,
  createStore,
  updateStore,
  deleteStore,
  getStoreByCode,
} from "../controllers/storeController.js";
import {
  validateStoreCreation,
  validateStoreDelete,
  validateStoreUpdate,
} from "../middlewares/validateStore.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";

const router = express.Router();

router.get("/", asyncWrapper(getStores));
router.get("/code/:code", asyncWrapper(getStoreByCode));
router.get("/:id", asyncWrapper(getStore));
router.post("/", validateStoreCreation, asyncWrapper(createStore));
router.put("/:id", validateStoreUpdate, asyncWrapper(updateStore));
router.delete("/:id", validateStoreDelete, asyncWrapper(deleteStore));

export default router;
