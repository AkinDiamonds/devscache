// imports
import dotenv from "dotenv";
import { z } from "zod";

// init dotenv
dotenv.config();

// create zod object
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),

  // DB
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),
  DB_PORT: z.coerce.number().default(5432),

  // Auth
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("1h"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

})

export type Env = z.infer<typeof envSchema>

// Error handling for failed env variables
let _env: Env

try {
  _env = envSchema.parse(process.env)
} catch (error) {
  if (error instanceof z.ZodError){
    console.error("Invalid or missing env variables:")
    console.error(JSON.stringify(error.flatten().fieldErrors, null, 2))
    process.exit(1)
  }
  throw error
}

const env = {
  ..._env,
  DATABASE_URL: `postgresql://${_env.DB_USER}:${_env.DB_PASSWORD}@localhost:${_env.DB_PORT}/${_env.DB_NAME}`,
};

// Helpers to check current environment
export const isProd = ()=>env.NODE_ENV === "production";
export const isDev = ()=>env.NODE_ENV === "development";
export const isTest = ()=>env.NODE_ENV === "test";


export { env }
export default env