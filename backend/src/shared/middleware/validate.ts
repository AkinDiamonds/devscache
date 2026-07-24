import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import { sendError } from "#shared/utils/response.js";

type ValidateTarget = "body" | "query" | "params";

export function validate(schema: ZodSchema, target: ValidateTarget= "body") {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[target]);
        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            sendError(res, "Validation failed", 422, errors)
            return
        }
        req[target] = result.data // replacing with the validated data
        next();
    };
}