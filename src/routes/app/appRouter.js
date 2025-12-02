import express from "express";
import productRoutes from "../../routes/productRoute.js";
import attributeRoutes from "../../routes/attributeRoute.js";
import productAttributeRoute from "../../routes/productAttributeRoute.js";
import assetRoutes from "../../routes/assetRoute.js";
import productAssetRoutes from "../../routes/productAssetRoute.js";
import categoryRoutes from "../../routes/categoryRoute.js";
import categoryTranslationRoutes from "../../routes/categoryTranslationRoute.js";
import productCategoryRoutes from "../../routes/productCategoryRoute.js";
import storeRoutes from "../../routes/storeRoute.js";
import storeViewRoutes from "../../routes/storeViewRoute.js";
import localeRoutes from "../../routes/localeRoute.js";
import attributeSetRoutes from "../../routes/attributeSetRoute.js";
import attributeGroupRoutes from "../../routes/attributeGroupRoute.js";
import analyticsRoutes from "../../routes/analyticsRoute.js";
import userRoutes from "../../routes/userRoute.js";
import workspaceRoutes from "../../routes/workspaceRoute.js";
import workspaceMemberRoutes from "../../routes/workspaceMemberRoute.js";
import workspaceInviteRoutes from "../../routes/workspaceInviteRoute.js";
import productWorkflowHistoryRoutes from "../../routes/productWorkflowHistoryRoutes.js";
import {
  authMiddleware,
  requireAuthentication,
} from "../../middlewares/authMiddleware.js";
import { csrfMiddleware } from "../../middlewares/csrfMiddleware.js";
import paymentRoutes from "../../routes/paymentRoute.js";

const router = express.Router();
router.use(authMiddleware);
router.use(requireAuthentication);
router.use(csrfMiddleware);
// Product related routes
router.use(`/products`, productRoutes);
router.use(`/attributes`, attributeRoutes);
router.use(`/product-attributes`, productAttributeRoute);
router.use(`/attribute-sets`, attributeSetRoutes);
router.use(`/attribute-groups`, attributeGroupRoutes);

// Payment related routes
router.use(`/payment/checkout`, paymentRoutes);

// Asset related routes
router.use(`/assets`, assetRoutes);
router.use(`/product-assets`, productAssetRoutes);
// Category related routes
router.use(`/categories`, categoryRoutes);
router.use(`/category-translations`, categoryTranslationRoutes);
router.use(`/product-categories`, productCategoryRoutes);
// Store related routes
router.use(`/stores`, storeRoutes);
router.use(`/store-views`, storeViewRoutes);

// Locale related routes
router.use(`/locales`, localeRoutes);

// Analytics routes
router.use(`/analytics`, analyticsRoutes);

// User and Workspace related routes
router.use(`/users`, userRoutes);
router.use(`/workspaces`, workspaceRoutes);
router.use(`/workspace-members`, workspaceMemberRoutes);
router.use(`/workspace-invites`, workspaceInviteRoutes);

// Workflow history routes
router.use(`/`, productWorkflowHistoryRoutes);

export default router;