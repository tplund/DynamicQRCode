import { describe, it, expect } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  it("allows requests within limit", () => {
    const key = "test-allow-" + Date.now();
    const r1 = rateLimit({ key, limit: 3, windowMs: 60000 });
    const r2 = rateLimit({ key, limit: 3, windowMs: 60000 });
    const r3 = rateLimit({ key, limit: 3, windowMs: 60000 });

    expect(r1.success).toBe(true);
    expect(r1.remaining).toBe(2);
    expect(r2.success).toBe(true);
    expect(r3.success).toBe(true);
    expect(r3.remaining).toBe(0);
  });

  it("blocks requests over limit", () => {
    const key = "test-block-" + Date.now();
    rateLimit({ key, limit: 2, windowMs: 60000 });
    rateLimit({ key, limit: 2, windowMs: 60000 });
    const r3 = rateLimit({ key, limit: 2, windowMs: 60000 });

    expect(r3.success).toBe(false);
    expect(r3.remaining).toBe(0);
  });

  it("resets after window expires", () => {
    const key = "test-reset-" + Date.now();
    // Use 1ms window so it expires immediately
    rateLimit({ key, limit: 1, windowMs: 1 });

    // Wait 5ms for window to expire
    const start = Date.now();
    while (Date.now() - start < 5) { /* busy wait */ }

    const r2 = rateLimit({ key, limit: 1, windowMs: 1 });
    expect(r2.success).toBe(true);
  });

  it("tracks different keys independently", () => {
    const key1 = "test-key1-" + Date.now();
    const key2 = "test-key2-" + Date.now();

    rateLimit({ key: key1, limit: 1, windowMs: 60000 });
    const r1 = rateLimit({ key: key1, limit: 1, windowMs: 60000 });
    const r2 = rateLimit({ key: key2, limit: 1, windowMs: 60000 });

    expect(r1.success).toBe(false);
    expect(r2.success).toBe(true);
  });
});
