import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { sendMail } from "@/lib/notify";
import { leadWelcomeEmailHtml } from "@/lib/email-templates";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // Rate limit: 5 requests per IP per 15 minutes
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success } = rateLimit({ key: `lead:${ip}`, limit: 5, windowMs: 15 * 60 * 1000 });
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Upsert — if they already exist, just return success
    await db
      .insert(leads)
      .values({ email: normalizedEmail })
      .onConflictDoNothing({ target: leads.email });

    // Send welcome email (fire-and-forget)
    sendMail({
      to: { email: normalizedEmail },
      subject: "Your QR code is ready 🎉",
      htmlContent: leadWelcomeEmailHtml(),
    }).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
