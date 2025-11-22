import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import { responseHelper } from "./middlewares/responseHelper.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import csrfRoute from "./routes/csrfRoute.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger.js";
import corsOptions from "./config/corsOptions.Config.js";
import rateLimiter from "./config/rateLimiterConfig.js";
import dotenv from "dotenv";
import appRouter from "./routes/app/appRouter.js";
import clerkWebhookRoute from "./webhooks/clerkRoute.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const apiEndpoint = process.env.API_ENDPOINT || "/api/v1";

const app = express();

// Trust proxy - required for rate limiting behind reverse proxies
app.set('trust proxy', 1);

// configurations
app.use(cors(corsOptions));
app.use(rateLimiter);
// parsers
app.use(express.json());
app.use(cookieParser());
// middlewares
app.use(responseHelper);


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

// Webhooks route (unprotected) - MUST come before protected routes
app.use(apiEndpoint, clerkWebhookRoute);

// CSRF route
app.use(apiEndpoint, csrfRoute);

// Main application routes (protected)
app.use(apiEndpoint, appRouter);
  
// error handler middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Listening on port: ", PORT);
});
