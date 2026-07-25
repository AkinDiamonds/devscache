import { z } from "zod";

export const registerSchema =z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Minimum 8 characters").regex(/[A-Z]/, "Must contain an uppercase letter").regex(/[0-9]/, "Must contain a number"),
    username: z.string().min(2).max(30).regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers, and underscores only"),
}) // Please note the numbers. minimum for username is always 2 and max is 30, so we wont make conflicts in other places

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
})

export const refreshSchema =z.object({
    refreshToken: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;