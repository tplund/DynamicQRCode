"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

const plans = [
  {
    id: "free" as const,
    name: "Free",
    priceMonthly: "$0",
    priceYearly: "$0",
    isFree: true,
    features: ["3 QR codes", "1,000 scans/month"],
  },
  {
    id: "pro" as const,
    name: "Pro",
    priceMonthly: "$9",
    priceYearly: "$7",
    isFree: false,
    features: ["25 QR codes", "50,000 scans/month", "Custom branding", "Analytics"],
  },
  {
    id: "business" as const,
    name: "Business",
    priceMonthly: "$25",
    priceYearly: "$19",
    isFree: false,
    features: ["Unlimited QR codes", "Unlimited scans", "Priority support", "API access"],
  },
];

export default function UpgradePage() {
  const { data: session } = useSession();
  const currentPlan = session?.user?.plan || "free";
  const [loading, setLoading] = useState<string | null>(null);
  const [yearly, setYearly] = useState(true);

  async function handleUpgrade(planId: "pro" | "business") {
    setLoading(planId);
    try {
      const res = await fetch("/api/lemonsqueezy/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, billing: yearly ? "yearly" : "monthly" }),
      });
      if (res.ok) {
        const { url } = await res.json();
        if (url) window.location.href = url;
      } else {
        const data = await res.json();
        alert(data.error || "Something went wrong");
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-xl font-semibold text-white">Choose your plan</h1>
        <p className="mt-1 text-sm text-neutral-500">Upgrade for more QR codes and scans.</p>
      </div>

      {/* Billing toggle */}
      <div className="mb-8 flex items-center justify-center gap-3">
        <span className={`text-sm font-medium ${!yearly ? "text-white" : "text-neutral-500"}`}>
          Monthly
        </span>
        <button
          onClick={() => setYearly(!yearly)}
          className={`relative h-7 w-12 rounded-full transition-colors cursor-pointer ${
            yearly ? "bg-blue-600" : "bg-neutral-700"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
              yearly ? "translate-x-5" : ""
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${yearly ? "text-white" : "text-neutral-500"}`}>
          Yearly
        </span>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
          Save 22%
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          const canUpgrade = !isCurrent && !plan.isFree;
          const price = yearly ? plan.priceYearly : plan.priceMonthly;

          return (
            <div
              key={plan.id}
              className={`rounded-xl border p-6 transition-colors ${
                isCurrent
                  ? "border-blue-500/50 bg-blue-500/5"
                  : "border-neutral-800 bg-neutral-900 hover:border-neutral-700"
              }`}
            >
              <h2 className="text-base font-semibold text-white">{plan.name}</h2>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">{price}</span>
                {!plan.isFree && (
                  <span className="text-sm text-neutral-500">/month</span>
                )}
              </div>
              {!plan.isFree && yearly && (
                <p className="mt-0.5 text-xs text-neutral-500">billed yearly</p>
              )}
              <ul className="mt-5 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-neutral-400">
                    <svg className="h-4 w-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                {isCurrent ? (
                  <span className="inline-block w-full rounded-lg bg-blue-500/10 px-4 py-2 text-center text-sm font-medium text-blue-400">
                    Current plan
                  </span>
                ) : canUpgrade ? (
                  <button
                    onClick={() => handleUpgrade(plan.id as "pro" | "business")}
                    disabled={loading !== null}
                    className="w-full rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {loading === plan.id ? "Loading..." : `Upgrade to ${plan.name}`}
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
