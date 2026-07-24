import type { Request, Response, NextFunction } from "express";
import { sendSuccess } from "#shared/utils/response.js";
import * as service from "./users.service.js";
import type { UpdateUserInput } from "./users.schemas.js";

export async function getMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await service.getById(req.user!.id);
    sendSuccess(res, item, "Profile retrieved");
  } catch (err) {
    next(err);
  }
}

export async function updateMyProfile(
  req: Request<{}, {}, UpdateUserInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const item = await service.update(req.user!.id, req.body);
    sendSuccess(res, item, "Profile updated");
  } catch (err) {
    next(err);
  }
}

export async function deleteMyAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await service.remove(req.user!.id);
    sendSuccess(res, null, "Account deleted");
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await service.getById(req.params.id);
    sendSuccess(res, item, "User retrieved");
  } catch (err) {
    next(err);
  }
}