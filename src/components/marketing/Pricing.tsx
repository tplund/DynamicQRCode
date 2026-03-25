"use client";

import Link from "next/link";
import { useState } from "react";

interface PricingProps {
  messages: {
    title: string;
    subtitle: string;
    monthly: string;
    yearly: string;
    save: string;
    perMonth: string;
    billedYearly: string;
    free: string;
    freePrice: string;
    freePeriod: string;
    freeCta: string;
    freeFeatures: string[];
    pro: string;
    proPriceMonthly: string;
    proPriceYearly: string;
    proFeatures: string[];
    proCta: string;
    business: string;
    businessPriceMonthly: string;
    businessPriceYearly: string;
    businessFeatures: string[];
    businessCta: string;
    popular: string;
  };
}

export default function Pricing({ messages }: PricingProps) {
  const [yearly, setYearly] = useState(true);

  const plans = [
    {
      name: messages.free,
      price: messages.freePrice,
      period: messages.freePeriod,
      features: messages.freeFeatures,
      cta: messages.freeCta,
      highlighted: false,
      href: "/login",
      isFree: true,
    },
    {
      name: messages.pro,
      price: yearly ? messages.proPriceYearly : messages.proPriceMonthly,
      period: messages.perMonth,
      features: messages.proFeatures,
      cta: messages.proCta,
      highlighted: true,
      href: "/login",
      isFree: false,
    },
    {
      name: messages.business,
      price: yearly ? messages.businessPriceYearly : messages.businessPriceMonthly,
      period: messages.perMonth,
      features: messages.businessFeatures,
      cta: messages.businessCta,
      highlighted: false,
      href: "/login",
      isFree: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold text-gray-900 md:text-4xl">
          {messages.title}
        </h2>
        <p className="mt-4 text-center text-gray-600">
          {messages.subtitle}
        </p>

        {/* Billing toggle */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <span className={`text-sm font-medium ${!yearly ? "text-gray-900" : "text-gray-500"}`}>
            {messages.monthly}
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
            {messages.yearly}
          </span>
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
            {messages.save} 22%
          </span>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3 items-start">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-8 ${
                plan.highlighted
                  ? "bg-gray-900 text-white ring-2 ring-gray-900 shadow-xl shadow-gray-900/20 scale-105"
                  : "bg-white ring-1 ring-gray-200"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-4 py-1 text-xs font-semibold text-white">
                  {messages.popular}
                </div>
              )}

              <h3 className={`text-lg font-semibold ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                {plan.name}
              </h3>

              <div className="mt-4 flex items-baseline gap-1">
                <span className={`text-4xl font-bold ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                  {plan.price}
                </span>
                <span className={`text-sm ${plan.highlighted ? "text-gray-400" : "text-gray-500"}`}>
                  {plan.isFree ? plan.period : plan.period}
                </span>
              </div>
              {!plan.isFree && yearly && (
                <p className={`mt-1 text-xs ${plan.highlighted ? "text-gray-400" : "text-gray-500"}`}>
                  {messages.billedYearly}
                </p>
              )}

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={plan.highlighted ? "#60a5fa" : "#3B82F6"}
                      strokeWidth="2"
                      className="mt-0.5 flex-shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className={`text-sm ${plan.highlighted ? "text-gray-300" : "text-gray-600"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`mt-8 block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all ${
                  plan.highlighted
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
