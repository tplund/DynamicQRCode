import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  configureLemonSqueezy,
  isLemonSqueezyEnabled,
} from "@/lib/lemonsqueezy";
import { getSubscription } from "@lemonsqueezy/lemonsqueezy.js";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  if (!isLemonSqueezyEnabled()) {
    return NextResponse.json({ error: "Not configured" }, { status: 501 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [user] = await db
    .select({ lemonSqueezySubscriptionId: users.lemonSqueezySubscriptionId })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user?.lemonSqueezySubscriptionId) {
    return NextResponse.json({ error: "Intet abonnement fundet" }, { status: 404 });
  }

  configureLemonSqueezy();

  const { data, error } = await getSubscription(user.lemonSqueezySubscriptionId);

  if (error) {
    console.error("[lemonsqueezy] Portal error:", error);
    return NextResponse.json({ error: "Kunne ikke hente abonnement" }, { status: 500 });
  }

  const portalUrl = data?.data.attributes.urls.customer_portal;
  if (!portalUrl) {
    return NextResponse.json({ error: "Portal URL ikke tilgængelig" }, { status: 500 });
  }

  return NextResponse.json({ url: portalUrl });
}
