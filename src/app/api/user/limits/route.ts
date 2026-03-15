import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canCreateQrCode } from "@/lib/plan-limits";
import { isStripeEnabled } from "@/lib/stripe";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limits = await canCreateQrCode(session.user.id);

  return NextResponse.json({
    ...limits,
    plan: session.user.plan,
    role: session.user.role,
    stripeEnabled: isStripeEnabled(),
  });
}
