import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users, qrCodes } from "../src/db/schema";
import { eq, isNull } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
config({ path: ".env.local" });

async function seed() {
  const email = process.env.AUTH_EMAIL;
  const password = process.env.AUTH_PASSWORD;

  if (!email || !password) {
    console.error("Set AUTH_EMAIL and AUTH_PASSWORD in .env.local");
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error("Set DATABASE_URL in .env.local");
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  // Check if admin already exists
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  if (existing) {
    console.log(`Admin user ${email} already exists (id: ${existing.id})`);

    // Still assign orphaned QR codes
    const result = await db
      .update(qrCodes)
      .set({ userId: existing.id })
      .where(isNull(qrCodes.userId));

    console.log("Assigned orphaned QR codes to admin user");
    return;
  }

  // Create admin user
  const passwordHash = await bcrypt.hash(password, 12);

  const [admin] = await db
    .insert(users)
    .values({
      email: email.toLowerCase(),
      name: "Thomas Lund",
      passwordHash,
      role: "super_admin",
      plan: "business",
    })
    .returning();

  console.log(`Created admin user: ${admin.email} (id: ${admin.id})`);

  // Assign all existing QR codes to admin
  await db
    .update(qrCodes)
    .set({ userId: admin.id })
    .where(isNull(qrCodes.userId));

  console.log("Assigned all existing QR codes to admin user");
}

seed()
  .then(() => {
    console.log("Seed complete!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
