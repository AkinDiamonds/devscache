import { z } from "zod";

export const createUserSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    username: z.string().min(2, "Username must be at least 2 characters long"),
});

export const updateUserSchema = z.object({
    email: z.string().email("Invalid email format").optional(),
    password: z.string().min(8, "Password must be at least 8 characters long").optional(),
    username: z.string().min(2, "Username must be at least 2 characters long").optional(),
    bio: z.string().max(500).optional(),
}).partial();

export const getUserByIdSchema = z.object({
    id: z.string().uuid("Must be a valid UUID"),
});


// We are using the following types in controllers and services instead of raw zod
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;