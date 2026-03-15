import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    });
  }
  return stripeInstance;
}

export function isStripeEnabled(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

export function getStripePriceId(plan: "pro" | "business"): string | null {
  if (plan === "pro") return process.env.STRIPE_PRICE_PRO || null;
  if (plan === "business") return process.env.STRIPE_PRICE_BUSINESS || null;
  return null;
}
