import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { qrCodes, scans } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const [qrCode] = await db
    .select()
    .from(qrCodes)
    .where(eq(qrCodes.id, id))
    .limit(1);

  if (!qrCode) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const recentScans = await db
    .select()
    .from(scans)
    .where(eq(scans.qrCodeId, id))
    .orderBy(desc(scans.scannedAt))
    .limit(50);

  return NextResponse.json({ ...qrCode, scans: recentScans });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const [updated] = await db
    .update(qrCodes)
    .set({
      ...(body.destinationUrl !== undefined && { destinationUrl: body.destinationUrl }),
      ...(body.label !== undefined && { label: body.label }),
      ...(body.styleConfig !== undefined && { styleConfig: body.styleConfig }),
      updatedAt: new Date(),
    })
    .where(eq(qrCodes.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  await db.delete(qrCodes).where(eq(qrCodes.id, id));

  return NextResponse.json({ ok: true });
}
