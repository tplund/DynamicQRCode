import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  // Auth (used by seed script to create initial admin)
  AUTH_EMAIL: z.string().optional(),
  AUTH_PASSWORD: z.string().optional(),
  // LemonSqueezy (all optional — app works without payments)
  LEMONSQUEEZY_API_KEY: z.string().optional(),
  LEMONSQUEEZY_STORE_ID: z.string().optional(),
  LEMONSQUEEZY_WEBHOOK_SECRET: z.string().optional(),
  // Registration
  REGISTRATION_ENABLED: z.enum(["true", "false"]).optional(),
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

export function isRegistrationEnabled(): boolean {
  // Explicit opt-out via REGISTRATION_ENABLED=false, otherwise enabled
  return process.env.REGISTRATION_ENABLED !== "false";
}
