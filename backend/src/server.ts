import { env } from "./config/env.js";
import app from "./app.js";
import { logger } from "shared/utils/logger.js";
import { pool } from "config/db.js";

const port = env.PORT

const server = app.listen(port, () => {
  logger.info(`Server running on port ${env.PORT}[${env.NODE_ENV}]`);
});

const shutdown = async (signal:string) => {
  logger.info(`${signal} received -- shutting down...`);
  server.close(async () => {
    await pool.end();
    logger.info("DB pool closed. Process exiting.");
    process.exit(0);
  })
}

process.on("SIGINT", () => shutdown("SIGINT"));    // Ctrl C
process.on("SIGTERM", () => shutdown("SIGTERM"));  // Docker / deployment stop