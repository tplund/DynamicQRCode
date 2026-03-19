import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { qrCodes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ available: false });
  }

  const sanitized = slug.toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (!sanitized) {
    return NextResponse.json({ available: false });
  }

  const existing = await db
    .select({ id: qrCodes.id })
    .from(qrCodes)
    .where(eq(qrCodes.slug, sanitized))
    .limit(1);

  return NextResponse.json({ available: existing.length === 0 });
}
