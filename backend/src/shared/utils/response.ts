import type { Response } from "express";

export function sendSuccess<T>(
    res: Response,
    data: T,
    message = "Success",
    statusCode = 200
): void {
    res.status(statusCode).json({ success: true, statusCode, message, data });
}

export function sendError<T>(
    res: Response,
    message = "Something went wrong",
    statusCode = 500,
    errors?: unknown
): void {
    res.status(statusCode).json({ success: false, statusCode, message, errors })
}