import { db } from "@/db";
import { users, qrCodes } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { PLANS, type PlanId, isPlanId } from "./plans";

export async function canCreateQrCode(userId: string): Promise<{
  allowed: boolean;
  reason?: string;
  current: number;
  max: number;
}> {
  const [user] = await db
    .select({ role: users.role, plan: users.plan })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    return { allowed: false, reason: "Bruger ikke fundet", current: 0, max: 0 };
  }

  // Super admin bypasses all limits
  if (user.role === "super_admin") {
    return { allowed: true, current: 0, max: Infinity };
  }

  const planId: PlanId = isPlanId(user.plan) ? user.plan : "free";
  const plan = PLANS[planId];

  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(qrCodes)
    .where(eq(qrCodes.userId, userId));

  const current = result?.count || 0;

  if (current >= plan.maxQrCodes) {
    return {
      allowed: false,
      reason: `Du har nået grænsen på ${plan.maxQrCodes} QR-koder på ${plan.nameDa}-planen`,
      current,
      max: plan.maxQrCodes,
    };
  }

  return { allowed: true, current, max: plan.maxQrCodes };
}
