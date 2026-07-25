import { Router } from "express";
import { authLimiter } from "#shared/middleware/rateLimiter.js";
import { authenticate } from "#shared/middleware/authenticate.js";
import { validate } from "#shared/middleware/validate.js";
import { registerSchema, loginSchema, refreshSchema } from "./auth.schemas.js";
import * as controller from "./auth.controller.js";

export const authRouter = Router();

authRouter.post("/register", authLimiter, validate(registerSchema), controller.register);
authRouter.post("/login", authLimiter, validate(loginSchema), controller.login);
authRouter.post("/refresh", validate(refreshSchema), controller.refresh);
authRouter.post("/logout", validate(refreshSchema), controller.logout);
authRouter.post("/logout-all", authenticate, controller.logoutAll);