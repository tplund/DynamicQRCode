export const PLANS = {
  free: {
    name: "Free",
    nameDa: "Gratis",
    maxQrCodes: 3,
    maxScansPerMonth: 1000,
    priceKr: 0,
  },
  pro: {
    name: "Pro",
    nameDa: "Pro",
    maxQrCodes: 25,
    maxScansPerMonth: 50000,
    priceKr: 49,
  },
  business: {
    name: "Business",
    nameDa: "Business",
    maxQrCodes: Infinity,
    maxScansPerMonth: Infinity,
    priceKr: 149,
  },
} as const;

export type PlanId = keyof typeof PLANS;

export function isPlanId(value: string): value is PlanId {
  return value in PLANS;
}
