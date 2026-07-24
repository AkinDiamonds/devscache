import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "#config/env.js";
import * as schema from "#db/schema.js";

const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: 2000,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 2_000,
})

pool.on("error", (err)=> {
    console.error("Unexpected DB pool error:", err);
    process.exit(1);
});

export const db = drizzle(pool, { schema, logger: false});
export type DB =typeof db;
export { pool };