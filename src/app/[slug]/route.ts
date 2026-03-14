import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { qrCodes, scans } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (slug === "admin" || slug === "favicon.ico" || slug.startsWith("_next")) {
    return NextResponse.next();
  }

  const [qrCode] = await db
    .select({ id: qrCodes.id, destinationUrl: qrCodes.destinationUrl })
    .from(qrCodes)
    .where(eq(qrCodes.slug, slug))
    .limit(1);

  if (!qrCode) {
    return NextResponse.json(
      { error: "QR code not found" },
      { status: 404 }
    );
  }

  const userAgent = request.headers.get("user-agent") || null;
  const country = request.headers.get("x-vercel-ip-country") || null;
  const referer = request.headers.get("referer") || null;

  db.insert(scans)
    .values({ qrCodeId: qrCode.id, userAgent, country, referer })
    .then(() => {});

  return NextResponse.redirect(qrCode.destinationUrl, 302);
}
