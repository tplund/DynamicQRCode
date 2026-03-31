"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface UserDetail {
  id: string;
  email: string;
  plan: string;
  role: string;
  createdAt: string;
  qrCount: number;
  scanCount: number;
  lastActive: string | null;
}

interface Stats {
  users: {
    total: number;
    byPlan: Record<string, number>;
    newThisMonth: number;
    paying: number;
  };
  mrr: number;
  qrCodes: {
    total: number;
    byPlan: Record<string, number>;
    avgPerUser: number;
  };
  scans: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    byPlan: Record<string, number>;
  };
  latestUsers: {
    id: string;
    email: string;
    plan: string;
    createdAt: string;
    qrCount: number;
  }[];
  allUsers?: UserDetail[];
}

function KpiCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${accent || "text-gray-900"}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const colors: Record<string, string> = {
    free: "bg-gray-100 text-gray-600",
    pro: "bg-blue-50 text-blue-700",
    business: "bg-emerald-50 text-emerald-700",
  };
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colors[plan] || colors.free}`}>
      {plan === "free" ? "Free" : plan.charAt(0).toUpperCase() + plan.slice(1)}
    </span>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">{children}</h2>;
}

export default function EconomyDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"scans" | "qr" | "date">("scans");
  const [tab, setTab] = useState<"overview" | "users">("overview");

  useEffect(() => {
    if (session?.user?.role !== "super_admin") {
      router.push("/admin");
      return;
    }

    fetch("/api/admin/stats")
      .then((r) => {
        if (!r.ok) throw new Error("Forbidden");
        return r.json();
      })
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [session, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-600">Kunne ikke hente data: {error}</p>
      </div>
    );
  }

  const totalUsers = stats.users.total;
  const planRows = ["free", "pro", "business"] as const;

  // Sort users for the users tab
  const allUsers = stats.allUsers || stats.latestUsers.map((u) => ({
    ...u,
    role: "user",
    scanCount: 0,
    lastActive: null,
  }));

  const sortedUsers = [...allUsers].sort((a, b) => {
    if (sortBy === "scans") return b.scanCount - a.scanCount;
    if (sortBy === "qr") return b.qrCount - a.qrCount;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Økonomi</h1>
          <p className="mt-0.5 text-sm text-gray-500">Overblik over brugere, omsætning og aktivitet</p>
        </div>

        {/* Tab toggle */}
        <div className="flex rounded-lg border border-gray-200 bg-white p-0.5">
          <button
            onClick={() => setTab("overview")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              tab === "overview" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Overblik
          </button>
          <button
            onClick={() => setTab("users")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              tab === "users" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Brugere
          </button>
        </div>
      </div>

      {tab === "overview" ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-8">
            <KpiCard
              label="Brugere"
              value={stats.users.total}
              sub={`+${stats.users.newThisMonth} denne mnd`}
            />
            <KpiCard
              label="Betalende"
              value={stats.users.paying}
              sub={`${totalUsers > 0 ? Math.round((stats.users.paying / totalUsers) * 100) : 0}% konvertering`}
              accent="text-emerald-600"
            />
            <KpiCard
              label="MRR"
              value={`$${stats.mrr}`}
              sub={`$${stats.mrr * 12}/år`}
              accent="text-emerald-600"
            />
            <KpiCard
              label="QR-koder"
              value={stats.qrCodes.total}
              sub={`${stats.qrCodes.avgPerUser} gns/bruger`}
            />
          </div>

          {/* Scan Overview */}
          <div className="mb-8">
            <SectionHeader>Scans</SectionHeader>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "I dag", value: stats.scans.today },
                { label: "Denne uge", value: stats.scans.thisWeek },
                { label: "Denne mnd", value: stats.scans.thisMonth },
                { label: "Total", value: stats.scans.total },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-gray-200 bg-white shadow-sm px-4 py-3">
                  <p className="text-xl font-bold text-gray-900 tabular-nums">{item.value.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* User Distribution */}
          <div className="mb-8">
            <SectionHeader>Brugerfordeling</SectionHeader>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Plan</th>
                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Brugere</th>
                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">%</th>
                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">QR</th>
                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Scans</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {planRows.map((plan) => (
                    <tr key={plan}>
                      <td className="px-5 py-3"><PlanBadge plan={plan} /></td>
                      <td className="px-5 py-3 text-sm text-right font-medium text-gray-700 tabular-nums">
                        {stats.users.byPlan[plan] ?? 0}
                      </td>
                      <td className="px-5 py-3 text-sm text-right text-gray-500 tabular-nums">
                        {totalUsers > 0 ? Math.round(((stats.users.byPlan[plan] ?? 0) / totalUsers) * 100) : 0}%
                      </td>
                      <td className="px-5 py-3 text-sm text-right text-gray-500 tabular-nums">
                        {stats.qrCodes.byPlan[plan] ?? 0}
                      </td>
                      <td className="px-5 py-3 text-sm text-right text-gray-500 tabular-nums">
                        {(stats.scans.byPlan[plan] ?? 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                    <td className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">Total</td>
                    <td className="px-5 py-3 text-sm text-right font-bold text-gray-900 tabular-nums">{totalUsers}</td>
                    <td className="px-5 py-3 text-sm text-right text-gray-500">100%</td>
                    <td className="px-5 py-3 text-sm text-right font-bold text-gray-900 tabular-nums">{stats.qrCodes.total}</td>
                    <td className="px-5 py-3 text-sm text-right font-bold text-gray-900 tabular-nums">{stats.scans.total.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Latest Signups */}
          <div>
            <SectionHeader>Seneste tilmeldinger</SectionHeader>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Plan</th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tilmeldt</th>
                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">QR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.latestUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-sm text-gray-700">{user.email}</td>
                      <td className="px-5 py-3"><PlanBadge plan={user.plan} /></td>
                      <td className="px-5 py-3 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString("da-DK", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td className="px-5 py-3 text-sm text-right text-gray-500 tabular-nums">{user.qrCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Users tab */
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xs text-gray-500">Sorter:</span>
            {[
              { key: "scans" as const, label: "Scans" },
              { key: "qr" as const, label: "QR-koder" },
              { key: "date" as const, label: "Nyeste" },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => setSortBy(s.key)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  sortBy === s.key
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Plan</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">QR</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Scans</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Oprettet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm text-gray-700">{user.email}</td>
                    <td className="px-5 py-3"><PlanBadge plan={user.plan} /></td>
                    <td className="px-5 py-3 text-sm text-right text-gray-500 tabular-nums">{user.qrCount}</td>
                    <td className="px-5 py-3 text-sm text-right tabular-nums">
                      <span className={user.scanCount > 1000 ? "text-amber-600 font-medium" : "text-gray-500"}>
                        {user.scanCount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString("da-DK", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
