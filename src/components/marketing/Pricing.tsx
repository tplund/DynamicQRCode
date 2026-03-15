import Link from "next/link";

interface PricingProps {
  messages: {
    title: string;
    subtitle: string;
    free: string;
    freePrice: string;
    freePeriod: string;
    freeFeatures: string[];
    pro: string;
    proPrice: string;
    proPeriod: string;
    proFeatures: string[];
    proCta: string;
    business: string;
    businessPrice: string;
    businessPeriod: string;
    businessFeatures: string[];
    businessCta: string;
    popular: string;
  };
}

export default function Pricing({ messages }: PricingProps) {
  const plans = [
    {
      name: messages.free,
      price: messages.freePrice,
      period: messages.freePeriod,
      features: messages.freeFeatures,
      cta: messages.free,
      highlighted: false,
      href: "/login",
    },
    {
      name: messages.pro,
      price: messages.proPrice,
      period: messages.proPeriod,
      features: messages.proFeatures,
      cta: messages.proCta,
      highlighted: true,
      href: "/login",
    },
    {
      name: messages.business,
      price: messages.businessPrice,
      period: messages.businessPeriod,
      features: messages.businessFeatures,
      cta: messages.businessCta,
      highlighted: false,
      href: "/login",
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

        <div className="mt-16 grid gap-6 md:grid-cols-3 items-start">
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
                  {plan.period}
                </span>
              </div>

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
