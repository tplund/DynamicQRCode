import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";

export const runtime = "nodejs";

function priceIdToPlan(priceId: string): string {
  if (priceId === process.env.STRIPE_PRICE_PRO) return "pro";
  if (priceId === process.env.STRIPE_PRICE_BUSINESS) return "business";
  return "free";
}

async function updateUserSubscription(
  userId: string,
  subscription: Stripe.Subscription
) {
  const item = subscription.items.data[0];
  const plan = item ? priceIdToPlan(item.price.id) : "free";

  await db
    .update(users)
    .set({
      stripeSubscriptionId: subscription.id,
      stripePriceId: item?.price.id || null,
      plan,
      stripeCurrentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Not configured" }, { status: 501 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (userId && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        await updateUserSubscription(userId, subscription);
      }
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as any;
      if (invoice.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          invoice.subscription as string
        );
        const [user] = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.stripeCustomerId, invoice.customer as string))
          .limit(1);

        if (user) {
          await updateUserSubscription(user.id, subscription);
        }
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const [user] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.stripeCustomerId, subscription.customer as string))
        .limit(1);

      if (user) {
        // Check if subscription is cancelled (at period end)
        if (subscription.cancel_at_period_end) {
          // Keep current plan until period ends
          await db
            .update(users)
            .set({
              stripeCurrentPeriodEnd: new Date(
                (subscription as any).current_period_end * 1000
              ),
              updatedAt: new Date(),
            })
            .where(eq(users.id, user.id));
        } else {
          await updateUserSubscription(user.id, subscription);
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const [user] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.stripeCustomerId, subscription.customer as string))
        .limit(1);

      if (user) {
        await db
          .update(users)
          .set({
            plan: "free",
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id));
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
