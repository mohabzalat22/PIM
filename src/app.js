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
import localeRoutes from "./routes/localeRoute.js";
import attributeSetRoutes from "./routes/attributeSetRoute.js";
import attributeGroupRoutes from "./routes/attributeGroupRoute.js";
import analyticsRoutes from "./routes/analyticsRoute.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { responseHelper } from "./middlewares/responseHelper.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { csrfMiddleware } from "./middlewares/csrfMiddleware.js";
import csrfRoute from "./routes/csrfRoute.js";

const PORT = 3000;

const app = express();
// cors options
const CorsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "csrf-token"],
  credentials: true, // Allow credentials (cookies) to be sent
};
app.use(cors(CorsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(responseHelper);
app.use(csrfMiddleware);

const apiEndpoint = "/api/v1";
// CSRF route
app.use(apiEndpoint, csrfRoute);
// Product related routes
app.use(`${apiEndpoint}/products`, productRoutes);
app.use(`${apiEndpoint}/attributes`, attributeRoutes);
app.use(`${apiEndpoint}/product-attributes`, productAttributeRoute);
app.use(`${apiEndpoint}/attribute-sets`, attributeSetRoutes);
app.use(`${apiEndpoint}/attribute-groups`, attributeGroupRoutes);

// Asset related routes
app.use(`${apiEndpoint}/assets`, assetRoutes);
app.use(`${apiEndpoint}/product-assets`, productAssetRoutes);
// Category related routes
app.use(`${apiEndpoint}/categories`, categoryRoutes);
app.use(`${apiEndpoint}/category-translations`, categoryTranslationRoutes);
app.use(`${apiEndpoint}/product-categories`, productCategoryRoutes);
// Store related routes
app.use(`${apiEndpoint}/stores`, storeRoutes);
app.use(`${apiEndpoint}/store-views`, storeViewRoutes);

// Locale related routes
app.use(`${apiEndpoint}/locales`, localeRoutes);

// Analytics routes
app.use(`${apiEndpoint}/analytics`, analyticsRoutes);

// grouped routes

// error handler middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Listening on port: ", PORT);
});
