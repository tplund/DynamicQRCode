import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { qrCodes } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { canCreateQrCode } from "@/lib/plan-limits";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isSuperAdmin = session.user.role === "super_admin";

  const codes = await db
    .select({
      id: qrCodes.id,
      slug: qrCodes.slug,
      destinationUrl: qrCodes.destinationUrl,
      label: qrCodes.label,
      styleConfig: qrCodes.styleConfig,
      createdAt: qrCodes.createdAt,
      updatedAt: qrCodes.updatedAt,
      scanCount: sql<number>`(select count(*) from scans where scans.qr_code_id = ${qrCodes.id})`,
    })
    .from(qrCodes)
    .where(isSuperAdmin ? undefined : eq(qrCodes.userId, session.user.id))
    .orderBy(desc(qrCodes.createdAt));

  return NextResponse.json(codes);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check plan limits
  const limits = await canCreateQrCode(session.user.id);
  if (!limits.allowed) {
    return NextResponse.json(
      {
        error: limits.reason || "QR-kode limit nået",
        current: limits.current,
        max: limits.max,
        needsUpgrade: true,
      },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { slug, destinationUrl, label, styleConfig, logoData } = body;

  try {
    const [created] = await db
      .insert(qrCodes)
      .values({
        slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, ""),
        destinationUrl,
        label,
        styleConfig,
        userId: session.user.id,
        ...(logoData !== undefined && { logoData }),
      })
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message.includes("unique")) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
