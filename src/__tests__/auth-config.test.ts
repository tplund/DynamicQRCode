import { describe, it, expect } from "vitest";
import { authOptions } from "@/lib/auth";

describe("auth configuration", () => {
  it("uses JWT session strategy", () => {
    expect(authOptions.session?.strategy).toBe("jwt");
  });

  it("has 30-day session max age", () => {
    expect(authOptions.session?.maxAge).toBe(30 * 24 * 60 * 60);
  });

  it("redirects to /login for sign in", () => {
    expect(authOptions.pages?.signIn).toBe("/login");
  });

  it("has credentials provider", () => {
    expect(authOptions.providers).toHaveLength(1);
    expect(authOptions.providers[0].id).toBe("credentials");
  });

  it("has jwt callback that sets role and plan", () => {
    expect(authOptions.callbacks?.jwt).toBeDefined();
  });

  it("has session callback that sets role and plan", () => {
    expect(authOptions.callbacks?.session).toBeDefined();
  });

  it("jwt callback preserves user data on login", async () => {
    const jwtCallback = authOptions.callbacks!.jwt!;
    const result = await jwtCallback({
      token: { sub: "test" },
      user: { id: "user-1", email: "test@test.com", name: "Test", role: "super_admin", plan: "pro" } as any,
      account: null,
      trigger: "signIn",
    } as any);

    expect(result.id).toBe("user-1");
    expect(result.role).toBe("super_admin");
    expect(result.plan).toBe("pro");
  });

  it("session callback maps token fields to session", async () => {
    const sessionCallback = authOptions.callbacks!.session!;
    const result = await sessionCallback({
      session: { user: { id: "", email: "test@test.com", name: "Test", role: "", plan: "" }, expires: "" },
      token: { id: "user-1", role: "super_admin", plan: "business", sub: "test" },
    } as any);

    expect(result.user.id).toBe("user-1");
    expect(result.user.role).toBe("super_admin");
    expect(result.user.plan).toBe("business");
  });
});
