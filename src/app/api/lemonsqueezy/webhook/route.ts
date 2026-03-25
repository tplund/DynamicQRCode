import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { variantIdToPlan } from "@/lib/lemonsqueezy";
import { sendPaymentReceipt, sendPlanChangeNotification } from "@/lib/transactional-emails";
import { PLANS } from "@/lib/plans";

export const runtime = "nodejs";

function verifySignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(rawBody);
  const digest = hmac.digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

interface WebhookEvent {
  meta: {
    event_name: string;
    custom_data?: { user_id?: string };
  };
  data: {
    id: string;
    attributes: {
      customer_id: number;
      variant_id: number;
      status: string;
      renews_at: string | null;
      ends_at: string | null;
      first_subscription_item?: { price: number };
    };
  };
}

export async function POST(request: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Not configured" }, { status: 501 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event: WebhookEvent = JSON.parse(rawBody);
  const eventName = event.meta.event_name;
  const attrs = event.data.attributes;
  const subscriptionId = String(event.data.id);
  const customerId = String(attrs.customer_id);
  const variantId = String(attrs.variant_id);
  const plan = variantIdToPlan(variantId);
  const renewsAt = attrs.renews_at ? new Date(attrs.renews_at) : null;

  switch (eventName) {
    case "subscription_created": {
      const userId = event.meta.custom_data?.user_id;
      if (!userId) break;

      await db
        .update(users)
        .set({
          lemonSqueezyCustomerId: customerId,
          lemonSqueezySubscriptionId: subscriptionId,
          lemonSqueezyVariantId: variantId,
          lemonSqueezyCurrentPeriodEnd: renewsAt,
          plan,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      // Send payment receipt
      const [user] = await db
        .select({ email: users.email, name: users.name })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (user) {
        const planInfo = PLANS[plan];
        sendPaymentReceipt(user.email, {
          name: user.name || "Bruger",
          plan: planInfo.nameDa,
          amount: `$${planInfo.priceMonthly}`,
        }).catch((err) => console.error("[webhook] Failed to send receipt:", err));
      }
      break;
    }

    case "subscription_updated": {
      const [user] = await db
        .select({ id: users.id, email: users.email, name: users.name, plan: users.plan })
        .from(users)
        .where(eq(users.lemonSqueezySubscriptionId, subscriptionId))
        .limit(1);

      if (!user) break;

      const oldPlan = user.plan;

      await db
        .update(users)
        .set({
          lemonSqueezyVariantId: variantId,
          lemonSqueezyCurrentPeriodEnd: renewsAt,
          plan,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));

      if (oldPlan !== plan) {
        const oldPlanInfo = PLANS[oldPlan as keyof typeof PLANS] || PLANS.free;
        const newPlanInfo = PLANS[plan];
        sendPlanChangeNotification(user.email, {
          name: user.name || "Bruger",
          oldPlan: oldPlanInfo.nameDa,
          newPlan: newPlanInfo.nameDa,
        }).catch((err) => console.error("[webhook] Failed to send plan change email:", err));
      }
      break;
    }

    case "subscription_cancelled":
    case "subscription_expired": {
      const [user] = await db
        .select({ id: users.id, email: users.email, name: users.name, plan: users.plan })
        .from(users)
        .where(eq(users.lemonSqueezySubscriptionId, subscriptionId))
        .limit(1);

      if (!user) break;

      const oldPlanInfo = PLANS[user.plan as keyof typeof PLANS] || PLANS.free;

      await db
        .update(users)
        .set({
          plan: "free",
          lemonSqueezySubscriptionId: null,
          lemonSqueezyVariantId: null,
          lemonSqueezyCurrentPeriodEnd: null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));

      sendPlanChangeNotification(user.email, {
        name: user.name || "Bruger",
        oldPlan: oldPlanInfo.nameDa,
        newPlan: PLANS.free.nameDa,
      }).catch((err) => console.error("[webhook] Failed to send plan change email:", err));
      break;
    }

    case "subscription_payment_success": {
      const [user] = await db
        .select({ id: users.id, email: users.email, name: users.name, plan: users.plan })
        .from(users)
        .where(eq(users.lemonSqueezySubscriptionId, subscriptionId))
        .limit(1);

      if (!user) break;

      await db
        .update(users)
        .set({
          lemonSqueezyCurrentPeriodEnd: renewsAt,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));

      const planInfo = PLANS[user.plan as keyof typeof PLANS] || PLANS.free;
      sendPaymentReceipt(user.email, {
        name: user.name || "Bruger",
        plan: planInfo.nameDa,
        amount: `$${planInfo.priceMonthly}`,
      }).catch((err) => console.error("[webhook] Failed to send receipt:", err));
      break;
    }
  }

  return NextResponse.json({ received: true });
}
