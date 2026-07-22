// New Dev? Please leave it as it is : Consult me and tell me why

// most important imports...
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan"
import { generalLimiter } from "shared/middleware/rateLimiter.js";
import { errorHandler } from "shared/middleware/errorHandler.js";

// import feature routers (Please add new ones here as you build extra features)

const app = express()

// Security middlewares: pls leave as is in the same order
app.use(helmet())
app.use(cors())

// parsing middleware
app.use(express.json({ limit: "10kb"})) // against large payload attacks
app.use(express.urlencoded({ extended: true }))

// request logging
app.use(morgan('combined'))

// General rate limiting
app.use(generalLimiter);

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok",  timestamp: new Date().toISOString(), service: "devscache"})
})

// API routes: keep it versioned

// add new feature routes here:
// app.use("/api/v1/<feature-name>", <feature>Router);


// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, statusCode: 404, message: "Route not found"});
});

// Global error handler: MUST ALWAYS BE LAST
app.use(errorHandler)


// I am keeping both exports for flexibility
export { app }
export default app