import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  // Auth (used by seed script to create initial admin)
  AUTH_EMAIL: z.string().optional(),
  AUTH_PASSWORD: z.string().optional(),
  // Stripe (all optional — app works without Stripe)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_PRO: z.string().optional(),
  STRIPE_PRICE_BUSINESS: z.string().optional(),
  // Registration (defaults to enabled when Stripe is configured)
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
  if (process.env.REGISTRATION_ENABLED === "true") return true;
  if (process.env.REGISTRATION_ENABLED === "false") return false;
  // Default: enabled when Stripe is configured
  return !!process.env.STRIPE_SECRET_KEY;
}
