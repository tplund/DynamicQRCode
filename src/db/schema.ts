import { pgTable, uuid, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";

export const qrCodes = pgTable("qr_codes", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  destinationUrl: text("destination_url").notNull(),
  label: text("label").notNull().default(""),
  styleConfig: jsonb("style_config").$type<{
    dot_type: string;
    fg_color: string;
    bg_color: string;
    corner_dot_type?: string;
    corner_square_type?: string;
    size: number;
  }>().notNull().default({
    dot_type: "classy-rounded",
    fg_color: "#1A2332",
    bg_color: "#FFFFFF",
    size: 300,
  }),
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
