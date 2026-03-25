import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { users, qrCodes, scans } from "@/db/schema";
import { eq, sql, gte, and, count } from "drizzle-orm";
import { PLANS } from "@/lib/plans";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  // User stats per plan
  const usersByPlan = await db
    .select({
      plan: users.plan,
      count: count(),
    })
    .from(users)
    .groupBy(users.plan);

  const totalUsers = usersByPlan.reduce((sum, row) => sum + row.count, 0);
  const planCounts: Record<string, number> = { free: 0, pro: 0, business: 0 };
  for (const row of usersByPlan) {
    planCounts[row.plan] = row.count;
  }

  // New users this month
  const [newUsersResult] = await db
    .select({ count: count() })
    .from(users)
    .where(gte(users.createdAt, startOfMonth));
  const newUsersThisMonth = newUsersResult?.count ?? 0;

  // Estimated MRR (simple: pro × $9 + business × $25)
  const estimatedMRR =
    planCounts.pro * PLANS.pro.priceMonthly +
    planCounts.business * PLANS.business.priceMonthly;

  // QR code stats
  const totalQrCodes = await db
    .select({ count: count() })
    .from(qrCodes);

  // QR codes per plan (join users)
  const qrByPlan = await db
    .select({
      plan: users.plan,
      count: count(),
    })
    .from(qrCodes)
    .leftJoin(users, eq(qrCodes.userId, users.id))
    .groupBy(users.plan);

  const qrPlanCounts: Record<string, number> = { free: 0, pro: 0, business: 0 };
  for (const row of qrByPlan) {
    const plan = row.plan || "free";
    qrPlanCounts[plan] = row.count;
  }

  // Scan stats
  const [totalScansResult] = await db
    .select({ count: count() })
    .from(scans);

  const [scansToday] = await db
    .select({ count: count() })
    .from(scans)
    .where(gte(scans.scannedAt, startOfDay));

  const [scansThisWeek] = await db
    .select({ count: count() })
    .from(scans)
    .where(gte(scans.scannedAt, startOfWeek));

  const [scansThisMonth] = await db
    .select({ count: count() })
    .from(scans)
    .where(gte(scans.scannedAt, startOfMonth));

  // Scans per plan
  const scansByPlan = await db
    .select({
      plan: users.plan,
      count: count(),
    })
    .from(scans)
    .innerJoin(qrCodes, eq(scans.qrCodeId, qrCodes.id))
    .leftJoin(users, eq(qrCodes.userId, users.id))
    .groupBy(users.plan);

  const scanPlanCounts: Record<string, number> = { free: 0, pro: 0, business: 0 };
  for (const row of scansByPlan) {
    const plan = row.plan || "free";
    scanPlanCounts[plan] = row.count;
  }

  // Latest signups (10 newest users with QR code count)
  const latestUsers = await db
    .select({
      id: users.id,
      email: users.email,
      plan: users.plan,
      createdAt: users.createdAt,
      qrCount: sql<number>`(SELECT count(*) FROM qr_codes WHERE user_id = ${users.id})`.as("qr_count"),
    })
    .from(users)
    .orderBy(sql`${users.createdAt} DESC`)
    .limit(10);

  return NextResponse.json({
    users: {
      total: totalUsers,
      byPlan: planCounts,
      newThisMonth: newUsersThisMonth,
      paying: planCounts.pro + planCounts.business,
    },
    mrr: estimatedMRR,
    qrCodes: {
      total: totalQrCodes[0]?.count ?? 0,
      byPlan: qrPlanCounts,
      avgPerUser: totalUsers > 0 ? Math.round(((totalQrCodes[0]?.count ?? 0) / totalUsers) * 10) / 10 : 0,
    },
    scans: {
      total: totalScansResult?.count ?? 0,
      today: scansToday?.count ?? 0,
      thisWeek: scansThisWeek?.count ?? 0,
      thisMonth: scansThisMonth?.count ?? 0,
      byPlan: scanPlanCounts,
    },
    latestUsers: latestUsers.map((u) => ({
      id: u.id,
      email: u.email,
      plan: u.plan,
      createdAt: u.createdAt,
      qrCount: Number(u.qrCount),
    })),
  });
}
