import type { User } from "./users.schema.js";

export type UserPublic = Omit<User, "passwordHash" | "deletedAt">;

export function toUserPublic(user: User): UserPublic {
    const { passwordHash: _, deletedAt: __, ...publicUser } = user;
    return publicUser;
}