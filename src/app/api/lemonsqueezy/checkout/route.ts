import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  configureLemonSqueezy,
  isLemonSqueezyEnabled,
  getLemonSqueezyVariantId,
  getStoreId,
} from "@/lib/lemonsqueezy";
import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";

export async function POST(request: NextRequest) {
  if (!isLemonSqueezyEnabled()) {
    return NextResponse.json(
      { error: "Betaling er ikke konfigureret" },
      { status: 501 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan, billing = "yearly" } = await request.json();
  if (plan !== "pro" && plan !== "business") {
    return NextResponse.json({ error: "Ugyldig plan" }, { status: 400 });
  }

  const variantId = getLemonSqueezyVariantId(plan, billing === "yearly" ? "yearly" : "monthly");
  if (!variantId) {
    return NextResponse.json({ error: "Variant ikke konfigureret" }, { status: 500 });
  }

  configureLemonSqueezy();

  const origin = request.headers.get("origin") || "https://getdynamicqrcode.com";

  const { data, error } = await createCheckout(getStoreId(), variantId, {
    checkoutData: {
      custom: {
        user_id: session.user.id,
      },
    },
    productOptions: {
      redirectUrl: `${origin}/admin?upgraded=true`,
    },
  });

  if (error) {
    console.error("[lemonsqueezy] Checkout error:", error);
    return NextResponse.json({ error: "Kunne ikke oprette checkout" }, { status: 500 });
  }

  return NextResponse.json({ url: data?.data.attributes.url });
}
