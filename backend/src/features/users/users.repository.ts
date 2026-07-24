import { eq, and, isNull } from "drizzle-orm";
import { db } from "#config/db.js";
import { users } from "./users.schema.js";
import type { NewUser, User } from "./users.schema.js";
import type { UpdateUserInput } from "./users.schemas.js";

export async function create(data: NewUser): Promise<User> {
    const [item] = await db.insert(users).values(data).returning();
    if (!item) throw new Error("Failed to create user");
    return item
}

export async function update(id: string, data: Partial<UpdateUserInput>): Promise<User | undefined> {
    const [updated] = await db.update(users).set({ ...data, updatedAt: new Date()}).where(and(eq(users.id, id), isNull(users.deletedAt))).returning();

    return updated
}

export async function softDelete(id: string): Promise<void> {
    await db.update(users).set({ deletedAt: new Date()}).where(eq(users.id, id))
}

export async function findById(id: string): Promise<User | undefined>{
    return db.query.users.findFirst({
        where: and(eq(users.id, id), isNull(users.deletedAt))
    })
}