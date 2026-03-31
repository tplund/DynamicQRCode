"use client";

import { useSession, signOut } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

function PlanBadge({ plan, role }: { plan: string; role: string }) {
  if (role === "super_admin") {
    return (
      <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700">
        Admin
      </span>
    );
  }

  const colors: Record<string, string> = {
    free: "bg-gray-100 text-gray-600",
    pro: "bg-blue-50 text-blue-700",
    business: "bg-emerald-50 text-emerald-700",
  };

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[plan] || colors.free}`}>
      {plan === "free" ? "Free" : plan.charAt(0).toUpperCase() + plan.slice(1)}
    </span>
  );
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
}

const navItems: NavItem[] = [
  {
    href: "/admin",
    label: "QR-koder",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    exact: true,
  },
  {
    href: "/admin/create",
    label: "Opret ny",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
  },
];

const superAdminItems: NavItem[] = [
  {
    href: "/admin/economy",
    label: "Økonomi",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
];

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [portalLoading, setPortalLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />
      </div>
    );
  }

  const plan = session?.user?.plan || "free";
  const role = session?.user?.role || "user";
  const email = session?.user?.email || "";

  async function openBillingPortal() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/lemonsqueezy/portal", { method: "POST" });
      if (res.ok) {
        const { url } = await res.json();
        window.location.href = url;
      }
    } finally {
      setPortalLoading(false);
    }
  }

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  const allNavItems = role === "super_admin" ? [...navItems, ...superAdminItems] : navItems;

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-gray-200 bg-white transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-2.5 border-b border-gray-200 px-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-tight text-gray-900">DynamicQR</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {allNavItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-gray-200 p-4 space-y-3">
          {plan === "free" && role !== "super_admin" && (
            <Link
              href="/admin/upgrade"
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              Opgrader
            </Link>
          )}

          {plan !== "free" && role !== "super_admin" && (
            <button
              onClick={openBillingPortal}
              disabled={portalLoading}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
              {portalLoading ? "..." : "Abonnement"}
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
              {email.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm text-gray-700">{email.split("@")[0]}</p>
                <PlanBadge plan={plan} role={role} />
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
              title="Log ud"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="flex h-14 items-center gap-3 border-b border-gray-200 bg-white px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-gray-900">DynamicQR</span>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto max-w-5xl">
            {children}
          </div>
        </main>
      </div>
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
