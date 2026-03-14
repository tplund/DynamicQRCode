import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { qrCodes, scans } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
    .orderBy(desc(qrCodes.createdAt));

  return NextResponse.json(codes);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { slug, destinationUrl, label, styleConfig } = body;

  try {
    const [created] = await db
      .insert(qrCodes)
      .values({
        slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, ""),
        destinationUrl,
        label,
        styleConfig,
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
