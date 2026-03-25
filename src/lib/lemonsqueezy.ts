import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";
import type { PlanId } from "./plans";

let configured = false;

export function configureLemonSqueezy() {
  if (configured) return;
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) throw new Error("LEMONSQUEEZY_API_KEY is not set");
  lemonSqueezySetup({ apiKey, onError: (err) => console.error("[lemonsqueezy]", err) });
  configured = true;
}

export function isLemonSqueezyEnabled(): boolean {
  return !!process.env.LEMONSQUEEZY_API_KEY;
}

export function getStoreId(): string {
  return process.env.LEMONSQUEEZY_STORE_ID || "";
}

export type BillingPeriod = "monthly" | "yearly";

export function getLemonSqueezyVariantId(
  plan: "pro" | "business",
  billing: BillingPeriod = "yearly"
): string | null {
  const suffix = billing === "yearly" ? "_YEARLY" : "";
  if (plan === "pro") return process.env[`LEMONSQUEEZY_VARIANT_PRO${suffix}`] || null;
  if (plan === "business") return process.env[`LEMONSQUEEZY_VARIANT_BUSINESS${suffix}`] || null;
  return null;
}

export function variantIdToPlan(variantId: string): PlanId {
  const proVariants = [
    process.env.LEMONSQUEEZY_VARIANT_PRO,
    process.env.LEMONSQUEEZY_VARIANT_PRO_YEARLY,
  ];
  const businessVariants = [
    process.env.LEMONSQUEEZY_VARIANT_BUSINESS,
    process.env.LEMONSQUEEZY_VARIANT_BUSINESS_YEARLY,
  ];
  if (proVariants.includes(variantId)) return "pro";
  if (businessVariants.includes(variantId)) return "business";
  return "free";
}
