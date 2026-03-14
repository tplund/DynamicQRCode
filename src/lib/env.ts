import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  AUTH_PASSWORD_HASH: z.string().min(1, "AUTH_PASSWORD_HASH is required"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

function validateEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.format());
    throw new Error("Missing required environment variables. Check .env.local");
  }
  return parsed.data;
}

export const env = validateEnv();
