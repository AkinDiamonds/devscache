import type { Request, Response, NextFunction } from "express";
import { AppError } from "shared/utils/errors.js";
import { logger } from "shared/utils/logger.js";
import { isDev } from "config/env.js";

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    // AppError is safe to expose to client
    if(err instanceof AppError) {
        logger.warn(`[${err.statusCode}] ${err.message}`, {
            path: req.path,
            method: req.method,
        });
        res.status(err.statusCode).json({
            success: false,
            statusCode: err.statusCode,
            message: err.message,
        });
        return;
    }

    // Dev Error: We are not exposing these to the client. examples(bugs, crashes)
    logger.error("Unhandled error:", {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    }) // logger.error is for dev; logger.warn is for client

    res.status(500).json({
        success: false,
        statusCode: 500,
        message: "An unexpected error occurred",
        ...(isDev() && { stack: err.stack }) // for debugging in Dev
    })

}