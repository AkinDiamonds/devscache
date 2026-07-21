// imports
import dotenv from "dotenv";
import { z } from "zod";

// init dotenv
dotenv.config();

// create zod object
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().default("1h")
})

export type Env = z.infer<typeof envSchema>

// Error handling for failed env variables
let env: Env

try {
  env = envSchema.parse(process.env)
} catch (error) {
  if (error instanceof z.ZodError){
    console.error("Invalid Environment Variables:")
    console.error(JSON.stringify(error.flatten().fieldErrors, null, 2))
    process.exit(1)
  }
  throw error
}

// Helpers to check current environment
export const isProd = ()=>env.NODE_ENV === "production"
export const isDev = ()=>env.NODE_ENV === "development"
export const isTest = ()=>env.NODE_ENV === "test"


export { env }
export default env