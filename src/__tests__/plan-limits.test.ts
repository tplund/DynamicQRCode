import { describe, it, expect } from "vitest";
import { PLANS } from "@/lib/plans";

describe("plan definitions", () => {
  it("has free, pro, and business plans", () => {
    expect(PLANS.free).toBeDefined();
    expect(PLANS.pro).toBeDefined();
    expect(PLANS.business).toBeDefined();
  });

  it("free plan costs $0", () => {
    expect(PLANS.free.priceMonthly).toBe(0);
  });

  it("pro plan costs $9/month", () => {
    expect(PLANS.pro.priceMonthly).toBe(9);
  });

  it("business plan costs $25/month", () => {
    expect(PLANS.business.priceMonthly).toBe(25);
  });

  it("free plan has QR limit of 3", () => {
    expect(PLANS.free.maxQrCodes).toBe(3);
  });

  it("pro plan has QR limit of 25", () => {
    expect(PLANS.pro.maxQrCodes).toBe(25);
  });

  it("business plan has unlimited QR codes", () => {
    expect(PLANS.business.maxQrCodes).toBe(Infinity);
  });

  it("yearly per-month prices are lower than monthly", () => {
    expect(PLANS.pro.priceYearlyPerMonth).toBeLessThan(PLANS.pro.priceMonthly);
    expect(PLANS.business.priceYearlyPerMonth).toBeLessThan(PLANS.business.priceMonthly);
  });

  it("yearly total equals 12x yearly per-month price", () => {
    expect(PLANS.pro.priceYearly).toBe(PLANS.pro.priceYearlyPerMonth * 12);
    expect(PLANS.business.priceYearly).toBe(PLANS.business.priceYearlyPerMonth * 12);
  });
});
