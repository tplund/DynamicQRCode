"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";

interface HeroProps {
  locale: Locale;
  messages: {
    title: string;
    subtitle: string;
    cta: string;
    ctaSecondary: string;
    generatorPlaceholder: string;
    generatorDownload: string;
    generatorUpsell: string;
    generatorUpsellCta: string;
  };
}

export default function Hero({ locale, messages }: HeroProps) {
  const [url, setUrl] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qrRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const QRCodeStyling = (await import("qr-code-styling")).default;
      if (cancelled) return;

      const qr = new QRCodeStyling({
        width: 200,
        height: 200,
        data: "https://example.com",
        dotsOptions: { type: "rounded", color: "#1A2332" },
        backgroundOptions: { color: "#ffffff" },
        cornersSquareOptions: { type: "extra-rounded", color: "#1A2332" },
        cornersDotOptions: { type: "dot", color: "#1A2332" },
        qrOptions: { errorCorrectionLevel: "M" },
      });
      qrRef.current = qr;

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        qr.append(containerRef.current);
      }

      setReady(true);
    }

    init();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!qrRef.current || !ready) return;
    qrRef.current.update({
      data: url || "https://example.com",
    });
  }, [url, ready]);

  const handleDownload = () => {
    qrRef.current?.download({
      name: "qr-code",
      extension: "png",
    });
  };

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

          {/* Live QR Code Generator */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm">
              <div className="rounded-2xl bg-white p-6 shadow-2xl shadow-gray-200/50 ring-1 ring-gray-100">
                {/* URL input */}
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={messages.generatorPlaceholder}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none transition-colors"
                />

                {/* QR Preview */}
                <div
                  ref={containerRef}
                  className="mt-4 flex items-center justify-center"
                  style={{ minHeight: 200 }}
                />

                {/* Download button */}
                <button
                  onClick={handleDownload}
                  className="mt-4 w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  {messages.generatorDownload}
                </button>

                {/* Upsell */}
                <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-center">
                  <p className="text-xs text-gray-500">{messages.generatorUpsell}</p>
                  <Link
                    href="/login"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {messages.generatorUpsellCta} →
                  </Link>
                </div>
              </div>

              {/* Floating analytics badge */}
              <div className="absolute -bottom-4 -right-4 rounded-xl bg-white px-4 py-3 shadow-lg ring-1 ring-gray-100 hidden sm:block">
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
              <div className="absolute -top-3 -left-3 rounded-lg bg-blue-600 px-3 py-1.5 shadow-md hidden sm:block">
                <p className="text-xs font-semibold text-white">✨ Branded</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
