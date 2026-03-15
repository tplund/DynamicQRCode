import Link from "next/link";
import type { Locale } from "@/i18n/config";

interface HeroProps {
  locale: Locale;
  messages: {
    title: string;
    subtitle: string;
    cta: string;
    ctaSecondary: string;
  };
}

export default function Hero({ locale, messages }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white" />

      <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
              {messages.title}
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
              {messages.subtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="rounded-xl bg-gray-900 px-6 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-gray-900/20 hover:bg-gray-800 transition-all hover:shadow-xl hover:shadow-gray-900/25"
              >
                {messages.cta}
              </Link>
              <Link
                href={`/${locale}/pricing`}
                className="rounded-xl border border-gray-200 px-6 py-3.5 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {messages.ctaSecondary}
              </Link>
            </div>
          </div>

          {/* SVG QR code illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="rounded-2xl bg-white p-8 shadow-2xl shadow-gray-200/50 ring-1 ring-gray-100">
                <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* QR pattern */}
                  {/* Top-left finder */}
                  <rect x="16" y="16" width="64" height="64" rx="8" fill="#1A2332" />
                  <rect x="24" y="24" width="48" height="48" rx="4" fill="white" />
                  <rect x="32" y="32" width="32" height="32" rx="4" fill="#1A2332" />
                  {/* Top-right finder */}
                  <rect x="160" y="16" width="64" height="64" rx="8" fill="#1A2332" />
                  <rect x="168" y="24" width="48" height="48" rx="4" fill="white" />
                  <rect x="176" y="32" width="32" height="32" rx="4" fill="#1A2332" />
                  {/* Bottom-left finder */}
                  <rect x="16" y="160" width="64" height="64" rx="8" fill="#1A2332" />
                  <rect x="24" y="168" width="48" height="48" rx="4" fill="white" />
                  <rect x="32" y="176" width="32" height="32" rx="4" fill="#1A2332" />
                  {/* Data dots with gradient effect */}
                  <circle cx="104" cy="32" r="8" fill="#3B82F6" />
                  <circle cx="128" cy="32" r="8" fill="#3B82F6" opacity="0.8" />
                  <circle cx="104" cy="56" r="8" fill="#3B82F6" opacity="0.6" />
                  <circle cx="128" cy="56" r="8" fill="#3B82F6" opacity="0.9" />
                  <circle cx="104" cy="104" r="8" fill="#3B82F6" />
                  <circle cx="128" cy="104" r="8" fill="#3B82F6" opacity="0.7" />
                  <circle cx="128" cy="128" r="8" fill="#3B82F6" opacity="0.85" />
                  <circle cx="152" cy="104" r="8" fill="#3B82F6" opacity="0.5" />
                  <circle cx="104" cy="128" r="8" fill="#3B82F6" opacity="0.9" />
                  <circle cx="104" cy="152" r="8" fill="#3B82F6" opacity="0.7" />
                  <circle cx="152" cy="128" r="8" fill="#3B82F6" />
                  <circle cx="176" cy="104" r="8" fill="#3B82F6" opacity="0.6" />
                  <circle cx="200" cy="104" r="8" fill="#3B82F6" opacity="0.8" />
                  <circle cx="152" cy="152" r="8" fill="#3B82F6" opacity="0.5" />
                  <circle cx="176" cy="152" r="8" fill="#3B82F6" />
                  <circle cx="200" cy="152" r="8" fill="#3B82F6" opacity="0.7" />
                  <circle cx="176" cy="176" r="8" fill="#3B82F6" opacity="0.9" />
                  <circle cx="200" cy="200" r="8" fill="#3B82F6" opacity="0.6" />
                  <circle cx="128" cy="176" r="8" fill="#3B82F6" opacity="0.8" />
                  <circle cx="128" cy="200" r="8" fill="#3B82F6" />
                  <circle cx="152" cy="200" r="8" fill="#3B82F6" opacity="0.5" />
                </svg>
              </div>

              {/* Floating analytics badge */}
              <div className="absolute -bottom-4 -right-4 rounded-xl bg-white px-4 py-3 shadow-lg ring-1 ring-gray-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">2,847</p>
                    <p className="text-xs text-gray-500">scans</p>
                  </div>
                </div>
              </div>

              {/* Floating branded badge */}
              <div className="absolute -top-3 -left-3 rounded-lg bg-blue-600 px-3 py-1.5 shadow-md">
                <p className="text-xs font-semibold text-white">✨ Branded</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
