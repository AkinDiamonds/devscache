import type { Request, Response, NextFunction } from "express";
import { sendSuccess } from "#shared/utils/response.js";
import * as authService from "#features/auth/auth.service.js";
import type { RegisterInput, LoginInput, RefreshInput } from "./auth.schemas.js";

export async function register(
    req: Request<{}, {}, RegisterInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const result = await authService.register(req.body);
        sendSuccess(res, result, "User registered successfully", 201);
    } catch (err) {
        next(err);
    }
}

export async function login(
    req: Request<{}, {}, LoginInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const result = await authService.login(req.body);
        sendSuccess(res, result, "Logged in successfully");
    } catch (err) {
        next(err);
    }
}

export async function refresh(
    req: Request<{}, {}, RefreshInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const result = await authService.refresh(req.body.refreshToken);
        sendSuccess(res, result, "Tokens refreshed successfully");
    } catch (err) {
        next(err);
    }
}

export async function logout(
    req: Request<{}, {}, RefreshInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        await authService.logout(req.body.refreshToken);
        sendSuccess(res, null, "Logged out successfully");
    } catch (err) {
        next(err);
    }
}

export async function logoutAll(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // req.user is populated by authenticate middleware
        await authService.logoutAll(req.user!.id);
        sendSuccess(res, null, "Logged out from all devices successfully");
    } catch (err) {
        next(err);
    }
}