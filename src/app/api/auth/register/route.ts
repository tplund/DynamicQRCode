import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { isRegistrationEnabled } from "@/lib/env";

const registerSchema = z.object({
  email: z.string().email("Ugyldig email"),
  password: z.string().min(8, "Adgangskode skal være mindst 8 tegn"),
  name: z.string().min(1, "Navn er påkrævet"),
});

export async function POST(request: NextRequest) {
  if (!isRegistrationEnabled()) {
    return NextResponse.json(
      { error: "Registrering er ikke aktiveret" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    const issues = parsed.error.issues || [];
    const firstError = issues[0]?.message || "Ugyldige data";
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  const { email, password, name } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  // Check for existing user
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (existing) {
    return NextResponse.json(
      { error: "Der findes allerede en konto med denne email" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.insert(users).values({
    email: normalizedEmail,
    name,
    passwordHash,
    role: "user",
    plan: "free",
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
