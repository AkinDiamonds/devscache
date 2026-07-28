// imports
import dotenv from "dotenv";
import { z } from "zod";

// init dotenv
dotenv.config();

// create zod object
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  CORS_ORIGINS: z.string().default("http://localhost:5173"),
  DATABASE_URL: z.string().min(1).optional(),

  // DB
  DB_USER: z.string().min(1).optional(),
  DB_PASSWORD: z.string().min(1).optional(),
  DB_NAME: z.string().min(1).optional(),
  DB_PORT: z.coerce.number().default(5432),

  // Auth
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("1h"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  FRONTEND_API_SECRET: z.string().default(""),

  // Swagger Documentation
  ENABLE_SWAGGER: z.preprocess((val) => {
    if (val === undefined || val === "") return true;
    if (val === "false" || val === "0") return false;
    return Boolean(val);
  }, z.boolean()).default(true),
});

export type Env = Omit<z.infer<typeof envSchema>, "CORS_ORIGINS"> & {
  CORS_ORIGINS: string[];
}

// Error handling for failed env variables
let _env: z.infer<typeof envSchema>

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

if (!_env.DATABASE_URL) {
  if (!_env.DB_USER || !_env.DB_PASSWORD || !_env.DB_NAME) {
    throw new Error("Set DATABASE_URL or DB_USER, DB_PASSWORD, and DB_NAME");
  }
}

const env = {
  ..._env,
  CORS_ORIGINS: _env.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean),
  DATABASE_URL:
    _env.DATABASE_URL ??
    `postgresql://${_env.DB_USER}:${_env.DB_PASSWORD}@localhost:${_env.DB_PORT}/${_env.DB_NAME}`,
};

if (_env.NODE_ENV === "production") {
  if (_env.CORS_ORIGINS === "http://localhost:5173") {
    throw new Error("CORS_ORIGINS must be set in production");
  }

  if (!_env.FRONTEND_API_SECRET) {
    throw new Error("FRONTEND_API_SECRET must be set in production");
  }
}

// Helpers to check current environment
export const isProd = ()=>env.NODE_ENV === "production";
export const isDev = ()=>env.NODE_ENV === "development";
export const isTest = ()=>env.NODE_ENV === "test";


export { env }
export default env