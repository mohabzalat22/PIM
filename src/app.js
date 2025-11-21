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
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger.js";
import corsOptions from "./config/corsOptions.Config.js";
import rateLimiter from "./config/rateLimiterConfig.js";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 3000;
const apiEndpoint = process.env.API_ENDPOINT || "/api/v1";

const app = express();

app.use(cors(corsOptions));
app.use(rateLimiter);
app.use(express.json());
app.use(cookieParser());
app.use(responseHelper);
app.use(csrfMiddleware);

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "MOLAB PIM API Documentation"
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

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
