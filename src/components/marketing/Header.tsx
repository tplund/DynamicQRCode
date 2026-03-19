"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";

interface HeaderProps {
  locale: Locale;
  messages: {
    features: string;
    pricing: string;
    blog: string;
    login: string;
    getStarted: string;
  };
}

export default function Header({ locale, messages }: HeaderProps) {
  const otherLocale = locale === "en" ? "da" : "en";
  const otherLabel = locale === "en" ? "DA" : "EN";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1" fill="white" />
              <rect x="14" y="3" width="7" height="7" rx="1" fill="white" />
              <rect x="3" y="14" width="7" height="7" rx="1" fill="white" />
              <rect x="14" y="14" width="3" height="3" fill="white" />
              <rect x="18" y="18" width="3" height="3" fill="white" />
              <rect x="14" y="18" width="3" height="3" fill="white" opacity="0.5" />
            </svg>
          </div>
          <span className="text-lg font-semibold">DynamicQR</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link href={`/${locale}#features`} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            {messages.features}
          </Link>
          <Link href={`/${locale}/pricing`} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            {messages.pricing}
          </Link>
          <Link href={`/${locale}/blog`} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            {messages.blog}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href={`/${otherLocale}`} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            {otherLabel}
          </Link>
          <Link href="/login" className="hidden text-sm text-gray-600 hover:text-gray-900 transition-colors sm:block">
            {messages.login}
          </Link>
          <Link href="/login" className="hidden rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors sm:block">
            {messages.getStarted}
          </Link>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors md:hidden cursor-pointer"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link href={`/${locale}#features`} onClick={() => setMenuOpen(false)} className="text-sm text-gray-600 hover:text-gray-900 transition-colors py-1">
              {messages.features}
            </Link>
            <Link href={`/${locale}/pricing`} onClick={() => setMenuOpen(false)} className="text-sm text-gray-600 hover:text-gray-900 transition-colors py-1">
              {messages.pricing}
            </Link>
            <Link href={`/${locale}/blog`} onClick={() => setMenuOpen(false)} className="text-sm text-gray-600 hover:text-gray-900 transition-colors py-1">
              {messages.blog}
            </Link>
            <hr className="border-gray-100" />
            <Link href="/login" onClick={() => setMenuOpen(false)} className="text-sm text-gray-600 hover:text-gray-900 transition-colors py-1">
              {messages.login}
            </Link>
            <Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-lg bg-gray-900 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-800 transition-colors">
              {messages.getStarted}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
