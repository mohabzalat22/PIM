import express from "express";
import productRoutes from "./routes/productRoute.js";
import attributeRoutes from "./routes/attributeRoute.js";
import productAttributeRoute from "./routes/productAttributeRoute.js";
import assetRoutes from "./routes/assetRoute.js";
import productAssetRoutes from "./routes/productAssetRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import categoryTranslationRoutes from "./routes/categoryTranslationRoute.js";
import productCategoryRoutes from "./routes/productCategoryRoute.js";
import storeRoutes from "./routes/storeRoute.js";
import storeViewRoutes from "./routes/storeViewRoute.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const PORT = 3000;

const app = express();

app.use(express.json());

// Product related routes
app.use("/api/products", productRoutes);
app.use("/api/attributes", attributeRoutes);
app.use("/api/product-attributes", productAttributeRoute);

// Asset related routes
app.use("/api/assets", assetRoutes);
app.use("/api/product-assets", productAssetRoutes);

// Category related routes
app.use("/api/categories", categoryRoutes);
app.use("/api/category-translations", categoryTranslationRoutes);
app.use("/api/product-categories", productCategoryRoutes);

// Store related routes
app.use("/api/stores", storeRoutes);
app.use("/api/store-views", storeViewRoutes);

// grouped routes

// error handler middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Listening on port: ", PORT);
});
