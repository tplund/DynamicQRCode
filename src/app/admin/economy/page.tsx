"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
}

function KpiCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
      {sub && <p className="mt-1 text-sm text-gray-400">{sub}</p>}
    </div>
  );
}

function MiniCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-center">
      <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const colors: Record<string, string> = {
    free: "bg-gray-100 text-gray-600",
    pro: "bg-blue-100 text-blue-700",
    business: "bg-green-100 text-green-700",
  };
  const labels: Record<string, string> = {
    free: "Free",
    pro: "Pro",
    business: "Business",
  };
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colors[plan] || colors.free}`}>
      {labels[plan] || plan}
    </span>
  );
}

export default function EconomyDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    return <div className="text-gray-400">Indlæser økonomi...</div>;
  }

  if (error || !stats) {
    return <div className="text-red-500">Kunne ikke hente data: {error}</div>;
  }

  const totalUsers = stats.users.total;
  const planRows = ["free", "pro", "business"] as const;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Økonomi</h1>
        <p className="text-sm text-gray-500 mt-1">Overblik over brugere, omsætning og aktivitet</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        <KpiCard
          label="Brugere i alt"
          value={stats.users.total}
          sub={`+${stats.users.newThisMonth} denne måned`}
        />
        <KpiCard
          label="Betalende brugere"
          value={stats.users.paying}
          sub={`${totalUsers > 0 ? Math.round((stats.users.paying / totalUsers) * 100) : 0}% af alle`}
        />
        <KpiCard
          label="Estimeret MRR"
          value={`$${stats.mrr}`}
          sub={`$${stats.mrr * 12}/år`}
        />
        <KpiCard
          label="QR-koder i alt"
          value={stats.qrCodes.total}
          sub={`${stats.qrCodes.avgPerUser} gns. per bruger`}
        />
      </div>

      {/* User Distribution Table */}
      <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Brugerfordeling</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Brugere</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">% af total</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">QR-koder</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Scans</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {planRows.map((plan) => (
              <tr key={plan} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3 text-sm">
                  <PlanBadge plan={plan} />
                </td>
                <td className="px-6 py-3 text-sm text-right font-medium text-gray-900">
                  {stats.users.byPlan[plan] ?? 0}
                </td>
                <td className="px-6 py-3 text-sm text-right text-gray-500">
                  {totalUsers > 0 ? Math.round(((stats.users.byPlan[plan] ?? 0) / totalUsers) * 100) : 0}%
                </td>
                <td className="px-6 py-3 text-sm text-right text-gray-600">
                  {stats.qrCodes.byPlan[plan] ?? 0}
                </td>
                <td className="px-6 py-3 text-sm text-right text-gray-600">
                  {(stats.scans.byPlan[plan] ?? 0).toLocaleString()}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-semibold">
              <td className="px-6 py-3 text-sm text-gray-900">Total</td>
              <td className="px-6 py-3 text-sm text-right text-gray-900">{totalUsers}</td>
              <td className="px-6 py-3 text-sm text-right text-gray-500">100%</td>
              <td className="px-6 py-3 text-sm text-right text-gray-900">{stats.qrCodes.total}</td>
              <td className="px-6 py-3 text-sm text-right text-gray-900">
                {stats.scans.total.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Scan Overview */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Scan-oversigt</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniCard label="I dag" value={stats.scans.today} />
          <MiniCard label="Denne uge" value={stats.scans.thisWeek} />
          <MiniCard label="Denne måned" value={stats.scans.thisMonth} />
          <MiniCard label="Total" value={stats.scans.total} />
        </div>
      </div>

      {/* Latest Signups */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Seneste tilmeldinger</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tilmeldt</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">QR-koder</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {stats.latestUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3 text-sm text-gray-900">{user.email}</td>
                <td className="px-6 py-3 text-sm">
                  <PlanBadge plan={user.plan} />
                </td>
                <td className="px-6 py-3 text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString("da-DK", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-6 py-3 text-sm text-right text-gray-600">{user.qrCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
