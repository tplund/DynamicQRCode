export const PLANS = {
  free: {
    name: "Free",
    nameDa: "Gratis",
    maxQrCodes: 3,
    maxScansPerMonth: 1000,
    priceMonthly: 0,
    priceYearlyPerMonth: 0,
    priceYearly: 0,
  },
  pro: {
    name: "Pro",
    nameDa: "Pro",
    maxQrCodes: 25,
    maxScansPerMonth: 50000,
    priceMonthly: 9,
    priceYearlyPerMonth: 7,
    priceYearly: 84,
  },
  business: {
    name: "Business",
    nameDa: "Business",
    maxQrCodes: Infinity,
    maxScansPerMonth: Infinity,
    priceMonthly: 25,
    priceYearlyPerMonth: 19,
    priceYearly: 228,
  },
} as const;

export type PlanId = keyof typeof PLANS;

export function isPlanId(value: string): value is PlanId {
  return value in PLANS;
}
