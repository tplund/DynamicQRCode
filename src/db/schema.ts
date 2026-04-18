import { pgTable, uuid, text, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import type { QRStyleConfig } from "@/lib/types";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  passwordHash: text("password_hash"), // nullable — OAuth users won't have one
  role: text("role").notNull().default("user"), // 'user' | 'super_admin'
  plan: text("plan").notNull().default("free"), // 'free' | 'pro' | 'business'
  stripeCustomerId: text("stripe_customer_id").unique(),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripePriceId: text("stripe_price_id"),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),
  lemonSqueezyCustomerId: text("lemonsqueezy_customer_id").unique(),
  lemonSqueezySubscriptionId: text("lemonsqueezy_subscription_id"),
  lemonSqueezyVariantId: text("lemonsqueezy_variant_id"),
  lemonSqueezyCurrentPeriodEnd: timestamp("lemonsqueezy_current_period_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const qrCodes = pgTable("qr_codes", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  destinationUrl: text("destination_url").notNull(),
  label: text("label").notNull().default(""),
  styleConfig: jsonb("style_config").$type<QRStyleConfig>().notNull().default({
    dot_type: "classy-rounded",
    fg_color: "#1A2332",
    bg_color: "#FFFFFF",
    size: 300,
  }),
  logoData: text("logo_data"),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const scans = pgTable("scans", {
  id: uuid("id").defaultRandom().primaryKey(),
  qrCodeId: uuid("qr_code_id")
    .notNull()
    .references(() => qrCodes.id, { onDelete: "cascade" }),
  scannedAt: timestamp("scanned_at").defaultNow().notNull(),
  userAgent: text("user_agent"),
  country: text("country"),
  referer: text("referer"),
});

export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  source: text("source").notNull().default("landing_qr_generator"),
  dripStep: integer("drip_step").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  convertedAt: timestamp("converted_at"), // set when they register
});
