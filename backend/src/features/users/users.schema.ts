import { pgTable, uuid, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    username: varchar("username", {length: 50}).notNull().unique(),
    bio: varchar("bio", {length: 500}),
    isEmailVerified: boolean("is_email_verified").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone:true}).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true })
});

export const refreshTokens = pgTable("refresh_tokens", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade"}),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at", {withTimezone: true}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert
export type RefreshToken = typeof refreshTokens.$inferSelect
export type NewRefreshToken = typeof refreshTokens.$inferInsert