import { pgTable, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import type { QRStyleConfig } from "@/lib/types";

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
