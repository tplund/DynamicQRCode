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
    features: ["25 QR codes", "50,000 scans/month"],
  },
  {
    id: "business" as const,
    name: "Business",
    priceMonthly: "$25",
    priceYearly: "$19",
    isFree: false,
    features: ["Unlimited QR codes", "Unlimited scans"],
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
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Choose your plan</h1>
      <p className="mb-6 text-gray-500">Upgrade for more QR codes and scans.</p>

      {/* Billing toggle */}
      <div className="mb-8 flex items-center justify-center gap-3">
        <span className={`text-sm font-medium ${!yearly ? "text-gray-900" : "text-gray-500"}`}>
          Monthly
        </span>
        <button
          onClick={() => setYearly(!yearly)}
          className={`relative h-7 w-12 rounded-full transition-colors cursor-pointer ${
            yearly ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
              yearly ? "translate-x-5" : ""
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${yearly ? "text-gray-900" : "text-gray-500"}`}>
          Yearly
        </span>
        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
          Save 22%
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          const canUpgrade = !isCurrent && !plan.isFree;
          const price = yearly ? plan.priceYearly : plan.priceMonthly;

          return (
            <div
              key={plan.id}
              className={`rounded-xl border p-6 ${
                isCurrent
                  ? "border-blue-300 bg-blue-50 ring-2 ring-blue-200"
                  : "border-gray-200 bg-white"
              }`}
            >
              <h2 className="text-lg font-semibold text-gray-900">{plan.name}</h2>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900">{price}</span>
                {!plan.isFree && (
                  <span className="text-sm text-gray-500">/month</span>
                )}
              </div>
              {!plan.isFree && yearly && (
                <p className="mt-0.5 text-xs text-gray-500">billed yearly</p>
              )}
              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-500">&#10003;</span> {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                {isCurrent ? (
                  <span className="inline-block rounded-lg bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                    Current plan
                  </span>
                ) : canUpgrade ? (
                  <button
                    onClick={() => handleUpgrade(plan.id as "pro" | "business")}
                    disabled={loading !== null}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
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
