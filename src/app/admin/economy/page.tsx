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
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${accent || "text-white"}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-neutral-500">{sub}</p>}
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const colors: Record<string, string> = {
    free: "bg-neutral-700/50 text-neutral-400",
    pro: "bg-blue-500/10 text-blue-400",
    business: "bg-emerald-500/10 text-emerald-400",
  };
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colors[plan] || colors.free}`}>
      {plan === "free" ? "Free" : plan.charAt(0).toUpperCase() + plan.slice(1)}
    </span>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-500">{children}</h2>;
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
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-700 border-t-white" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6 text-center">
        <p className="text-sm text-red-400">Kunne ikke hente data: {error}</p>
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
          <h1 className="text-xl font-semibold text-white">Økonomi</h1>
          <p className="mt-0.5 text-sm text-neutral-500">Overblik over brugere, omsætning og aktivitet</p>
        </div>

        {/* Tab toggle */}
        <div className="flex rounded-lg border border-neutral-800 bg-neutral-900 p-0.5">
          <button
            onClick={() => setTab("overview")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              tab === "overview" ? "bg-white/10 text-white" : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            Overblik
          </button>
          <button
            onClick={() => setTab("users")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              tab === "users" ? "bg-white/10 text-white" : "text-neutral-500 hover:text-neutral-300"
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
              accent="text-emerald-400"
            />
            <KpiCard
              label="MRR"
              value={`$${stats.mrr}`}
              sub={`$${stats.mrr * 12}/år`}
              accent="text-emerald-400"
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
                <div key={item.label} className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3">
                  <p className="text-xl font-bold text-white tabular-nums">{item.value.toLocaleString()}</p>
                  <p className="text-xs text-neutral-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* User Distribution */}
          <div className="mb-8">
            <SectionHeader>Brugerfordeling</SectionHeader>
            <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-800">
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Plan</th>
                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">Brugere</th>
                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">%</th>
                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">QR</th>
                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">Scans</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/50">
                  {planRows.map((plan) => (
                    <tr key={plan}>
                      <td className="px-5 py-3"><PlanBadge plan={plan} /></td>
                      <td className="px-5 py-3 text-sm text-right font-medium text-neutral-200 tabular-nums">
                        {stats.users.byPlan[plan] ?? 0}
                      </td>
                      <td className="px-5 py-3 text-sm text-right text-neutral-500 tabular-nums">
                        {totalUsers > 0 ? Math.round(((stats.users.byPlan[plan] ?? 0) / totalUsers) * 100) : 0}%
                      </td>
                      <td className="px-5 py-3 text-sm text-right text-neutral-400 tabular-nums">
                        {stats.qrCodes.byPlan[plan] ?? 0}
                      </td>
                      <td className="px-5 py-3 text-sm text-right text-neutral-400 tabular-nums">
                        {(stats.scans.byPlan[plan] ?? 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-white/[0.02]">
                    <td className="px-5 py-3 text-xs font-semibold uppercase text-neutral-400">Total</td>
                    <td className="px-5 py-3 text-sm text-right font-bold text-white tabular-nums">{totalUsers}</td>
                    <td className="px-5 py-3 text-sm text-right text-neutral-500">100%</td>
                    <td className="px-5 py-3 text-sm text-right font-bold text-white tabular-nums">{stats.qrCodes.total}</td>
                    <td className="px-5 py-3 text-sm text-right font-bold text-white tabular-nums">{stats.scans.total.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Latest Signups */}
          <div>
            <SectionHeader>Seneste tilmeldinger</SectionHeader>
            <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-800">
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Email</th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Plan</th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Tilmeldt</th>
                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">QR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/50">
                  {stats.latestUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3 text-sm text-neutral-200">{user.email}</td>
                      <td className="px-5 py-3"><PlanBadge plan={user.plan} /></td>
                      <td className="px-5 py-3 text-sm text-neutral-500">
                        {new Date(user.createdAt).toLocaleDateString("da-DK", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td className="px-5 py-3 text-sm text-right text-neutral-400 tabular-nums">{user.qrCount}</td>
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
            <span className="text-xs text-neutral-500">Sortér:</span>
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
                    ? "bg-white/10 text-white"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Email</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Plan</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">QR</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">Scans</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Oprettet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {sortedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 text-sm text-neutral-200">{user.email}</td>
                    <td className="px-5 py-3"><PlanBadge plan={user.plan} /></td>
                    <td className="px-5 py-3 text-sm text-right text-neutral-400 tabular-nums">{user.qrCount}</td>
                    <td className="px-5 py-3 text-sm text-right tabular-nums">
                      <span className={user.scanCount > 1000 ? "text-amber-400 font-medium" : "text-neutral-400"}>
                        {user.scanCount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-neutral-500">
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
