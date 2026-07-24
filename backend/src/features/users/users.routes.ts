import { Router } from "express";
import { authenticate } from "#shared/middleware/authenticate.js";
import { validate } from "#shared/middleware/validate.js";
import { updateUserSchema, getUserByIdSchema } from "./users.schemas.js";
import * as controller from "./users.controller.js";

export const usersRouter = Router();

// Protect all user profile routes
usersRouter.use(authenticate);

// GET /api/v1/users/me
usersRouter.get("/me", controller.getMyProfile);

// PATCH /api/v1/users/me
usersRouter.patch("/me", validate(updateUserSchema), controller.updateMyProfile);

// DELETE /api/v1/users/me
usersRouter.delete("/me", controller.deleteMyAccount);

// GET /api/v1/users/:id This will be used to get another user profile
usersRouter.get("/:id", validate(getUserByIdSchema, "params"), controller.getById);