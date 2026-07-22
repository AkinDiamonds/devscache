import { isDev } from "config/env.js";
import winston from "winston";



const { combine, timestamp, printf, colorize, errors } = winston.format;

// Human-readable for dev terminals
const devFormat = combine(
    colorize(),
    timestamp({ format: "HH:mm:ss"}),
    errors({stack: true }),
    printf(({ level, message, timestamp, stack }) =>
    stack?`[${timestamp}] ${level}: ${message}\n${stack}`: `[${timestamp}] ${level}: ${message}`)
)

// JSON for production
const prodFormat = combine(timestamp(), errors({stack: true}), winston.format.json());

export const logger =winston.createLogger({
    level: isDev() ? "debug": "info",
    format: isDev() ? devFormat : prodFormat,
    transports: [
        new winston.transports.Console(),
        // Production additions (we will uncomment when ready):
        // new winston.transports.File({ filename: "logs/error.log", level: "error" }),
        // new winston.transports.File({ filename: "logs/combined.log" }),
    ],
});