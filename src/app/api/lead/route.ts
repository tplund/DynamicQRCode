import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { sendMail } from "@/lib/notify";
import { leadWelcomeEmailHtml } from "@/lib/email-templates";

export async function POST(req: NextRequest) {
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
