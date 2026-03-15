"use client";

import { useSession, signOut } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function PlanBadge({ plan, role }: { plan: string; role: string }) {
  if (role === "super_admin") {
    return (
      <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
        Admin
      </span>
    );
  }

  const colors: Record<string, string> = {
    free: "bg-gray-100 text-gray-600",
    pro: "bg-blue-100 text-blue-700",
    business: "bg-green-100 text-green-700",
  };

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[plan] || colors.free}`}>
      {plan === "free" ? "Gratis" : plan.charAt(0).toUpperCase() + plan.slice(1)}
    </span>
  );
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-400">Indlæser...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-400">Omdirigerer...</div>
      </div>
    );
  }

  const plan = session?.user?.plan || "free";
  const role = session?.user?.role || "user";

  async function openBillingPortal() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      if (res.ok) {
        const { url } = await res.json();
        window.location.href = url;
      }
    } finally {
      setPortalLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <a href="/admin" className="text-lg font-bold text-gray-900">DynamicQR</a>
            <a href="/admin/create" className="text-sm text-gray-600 hover:text-gray-900">+ Opret ny</a>
          </div>
          <div className="flex items-center gap-4">
            <PlanBadge plan={plan} role={role} />
            {plan === "free" && role !== "super_admin" && (
              <a
                href="/en/pricing"
                className="text-xs font-medium text-blue-600 hover:text-blue-800"
              >
                Opgrader
              </a>
            )}
            {plan !== "free" && role !== "super_admin" && (
              <button
                onClick={openBillingPortal}
                disabled={portalLoading}
                className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                {portalLoading ? "..." : "Abonnement"}
              </button>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              Log ud
            </button>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminGuard>{children}</AdminGuard>
    </SessionProvider>
  );
}
