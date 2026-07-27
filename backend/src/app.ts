// New Dev? Please leave it as it is : Consult me and tell me why

// most important imports...
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan"
import { generalLimiter } from "#shared/middleware/rateLimiter.js";
import { errorHandler } from "#shared/middleware/errorHandler.js";

import swaggerUi from "swagger-ui-express";
import { generateOpenAPIDocument } from "#config/swagger.js";
import { env } from "#config/env.js";

// import feature routers (Please add new ones here as you build extra features)
import { usersRouter } from "#features/users/index.js";
import { authRouter } from "#features/auth/index.js";

const app = express()

// Security middlewares: pls leave as is in the same order
app.use(helmet())
app.use(cors())

// parsing middleware
app.use(express.json({ limit: "10kb" })) // against large payload attacks
app.use(express.urlencoded({ extended: true }))

// request logging
app.use(morgan('combined'))

// General rate limiting
app.use(generalLimiter);

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString(), service: "devscache" })
})

// Swagger API Documentation (Controlled by ENABLE_SWAGGER env flag)
if (env.ENABLE_SWAGGER) {
  const swaggerDocument = generateOpenAPIDocument();
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.get("/docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDocument);
  });
}

// API routes: keep it versioned
app.use("/api/v1/users", usersRouter)
app.use("/api/v1/auth", authRouter)
// add new feature routes here in this form:
// app.use("/api/v1/<feature-name>", <feature>Router);


// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, statusCode: 404, message: "Route not found" });
});

// Global error handler: MUST ALWAYS BE LAST
app.use(errorHandler)


// I am keeping both exports for flexibility
export { app }
export default app