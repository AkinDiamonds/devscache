import type { Request, Response, NextFunction } from "express";
import { env } from "#config/env.js";
import { UnauthorizedError } from "#shared/utils/errors.js";

export function requireFrontendSecret(req: Request, _res: Response, next: NextFunction) {
  if (!env.FRONTEND_API_SECRET || req.method === "OPTIONS") {
    return next();
  }

  const providedSecret = req.header("x-api-secret");

  if (providedSecret !== env.FRONTEND_API_SECRET) {
    return next(new UnauthorizedError("Missing or invalid API secret"));
  }

  next();
}