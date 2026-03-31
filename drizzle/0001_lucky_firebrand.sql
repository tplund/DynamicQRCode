CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"source" text DEFAULT 'landing_qr_generator' NOT NULL,
	"drip_step" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"converted_at" timestamp,
	CONSTRAINT "leads_email_unique" UNIQUE("email")
);
