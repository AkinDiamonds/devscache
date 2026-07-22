import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "config/env.js";
import { UnauthorizedError } from "shared/utils/errors.js";
import type { AuthUser } from "shared/types/index.js";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return next(new UnauthorizedError("Missing or malformed Authorization header"));
    }

    const token = authHeader.slice(7); // Remove 'Bearer '

    try {
        const payload = jwt.verify(token, env.JWT_SECRET) as AuthUser;
        req.user = payload;
        next()
    } catch {
        next(new UnauthorizedError("Invalid or expired access token"))
    }
}