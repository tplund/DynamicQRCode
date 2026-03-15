import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { qrCodes, scans } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

async function checkOwnership(id: string, userId: string, role: string) {
  const [qrCode] = await db
    .select({ userId: qrCodes.userId })
    .from(qrCodes)
    .where(eq(qrCodes.id, id))
    .limit(1);

  if (!qrCode) return { found: false, allowed: false };
  if (role === "super_admin") return { found: true, allowed: true };
  return { found: true, allowed: qrCode.userId === userId };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { found, allowed } = await checkOwnership(id, session.user.id, session.user.role);

  if (!found) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [qrCode] = await db
    .select()
    .from(qrCodes)
    .where(eq(qrCodes.id, id))
    .limit(1);

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
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { found, allowed } = await checkOwnership(id, session.user.id, session.user.role);

  if (!found) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();

  const [updated] = await db
    .update(qrCodes)
    .set({
      ...(body.destinationUrl !== undefined && { destinationUrl: body.destinationUrl }),
      ...(body.label !== undefined && { label: body.label }),
      ...(body.styleConfig !== undefined && { styleConfig: body.styleConfig }),
      ...(body.logoData !== undefined && { logoData: body.logoData }),
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
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { found, allowed } = await checkOwnership(id, session.user.id, session.user.role);

  if (!found) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await db.delete(qrCodes).where(eq(qrCodes.id, id));

  return NextResponse.json({ ok: true });
}
