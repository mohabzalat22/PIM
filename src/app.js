import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import { responseHelper } from "./middlewares/responseHelper.js";
import { authMiddleware, requireAuthentication } from "./middlewares/authMiddleware.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { csrfMiddleware } from "./middlewares/csrfMiddleware.js";
import csrfRoute from "./routes/csrfRoute.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger.js";
import corsOptions from "./config/corsOptions.Config.js";
import rateLimiter from "./config/rateLimiterConfig.js";
import dotenv from "dotenv";
import appRouter from "./routes/app/appRouter.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const apiEndpoint = process.env.API_ENDPOINT || "/api/v1";

const app = express();

// configurations
app.use(cors(corsOptions));
app.use(rateLimiter);
// parsers
app.use(express.json());
app.use(cookieParser());
// middlewares
app.use(responseHelper);
app.use(authMiddleware);
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

// Main application routes (protected)
app.use(apiEndpoint, requireAuthentication, appRouter);

// error handler middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Listening on port: ", PORT);
});
