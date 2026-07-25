import { eq, and, isNull } from "drizzle-orm";
import { db } from "#config/db.js";
import { refreshTokens, users } from "./users.schema.js";
import type { NewRefreshToken, NewUser, RefreshToken, User } from "./users.schema.js";
import type { UpdateUserInput } from "./users.schemas.js";

export async function create(data: NewUser): Promise<User> {
    const [item] = await db.insert(users).values(data).returning();
    if (!item) throw new Error("Failed to create user");
    return item;
}

export async function update(id: string, data: Partial<UpdateUserInput>): Promise<User | undefined> {
    const [updated] = await db.update(users).set({ ...data, updatedAt: new Date()}).where(and(eq(users.id, id), isNull(users.deletedAt))).returning();

    return updated;
}

export async function softDelete(id: string): Promise<void> {
    await db.update(users).set({ deletedAt: new Date()}).where(eq(users.id, id));
}

export async function findById(id: string): Promise<User | undefined>{
    return db.query.users.findFirst({
        where: and(eq(users.id, id), isNull(users.deletedAt))
    });
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
    return db.query.users.findFirst({
        where: and(eq(users.email, email), isNull(users.deletedAt))
    });
}

export async function findUserByUsername(username: string): Promise<User | undefined> {
    return db.query.users.findFirst({
        where: and(eq(users.username, username), isNull(users.deletedAt))
    });
}

export async function createRefreshToken(data: NewRefreshToken): Promise<string> {
    const rows = await db.insert(refreshTokens).values(data).returning({ token: refreshTokens.token });

    const item = rows[0];

    if (!item) {
        throw new Error("Failed to create refresh token");
    }

    return item.token;
}

export async function findRefreshToken(token: string): Promise<RefreshToken | undefined> {
    return db.query.refreshTokens.findFirst({
        where: eq(refreshTokens.token, token),
    });
}

export async function deleteRefreshToken(token: string): Promise<void> {
    await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
}

export async function deleteAllRefreshTokensForUser(userId: string): Promise<void> {
    await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
}