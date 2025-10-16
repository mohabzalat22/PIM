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

const router = express.Router();

router.get("/", getStores);
router.get("/code/:code", getStoreByCode);
router.get("/:id", getStore);
router.post("/", validateStoreCreation, createStore);
router.put("/:id", validateStoreUpdate, updateStore);
router.delete("/:id", validateStoreDelete, deleteStore);

export default router;
