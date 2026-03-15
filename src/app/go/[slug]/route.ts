import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { qrCodes, scans } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notifyBrokenRedirect, notifyDestination404 } from "@/lib/notify";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const [qrCode] = await db
    .select({
      id: qrCodes.id,
      slug: qrCodes.slug,
      destinationUrl: qrCodes.destinationUrl,
    })
    .from(qrCodes)
    .where(eq(qrCodes.slug, slug))
    .limit(1);

  if (!qrCode) {
    notifyBrokenRedirect({
      slug,
      userAgent: request.headers.get("user-agent"),
      country: request.headers.get("x-vercel-ip-country"),
      referer: request.headers.get("referer"),
      url: request.url,
    });

    return NextResponse.json(
      { error: "QR code not found" },
      { status: 404 }
    );
  }

  const userAgent = request.headers.get("user-agent") || null;
  const country = request.headers.get("x-vercel-ip-country") || null;
  const referer = request.headers.get("referer") || null;

  // Log scan
  db.insert(scans)
    .values({ qrCodeId: qrCode.id, userAgent, country, referer })
    .then(() => {});

  // Check destination health (fire-and-forget, non-blocking)
  fetch(qrCode.destinationUrl, { method: "HEAD", redirect: "follow" })
    .then((res) => {
      if (res.status >= 400) {
        notifyDestination404({
          slug: qrCode.slug,
          destinationUrl: qrCode.destinationUrl,
          statusCode: res.status,
        });
      }
    })
    .catch(() => {
      notifyDestination404({
        slug: qrCode.slug,
        destinationUrl: qrCode.destinationUrl,
        statusCode: 0,
      });
    });

  return NextResponse.redirect(qrCode.destinationUrl, 302);
}
