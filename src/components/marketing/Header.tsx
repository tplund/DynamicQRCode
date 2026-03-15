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

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href={`/${locale}#features`}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {messages.features}
          </Link>
          <Link
            href={`/${locale}/pricing`}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {messages.pricing}
          </Link>
          <Link
            href={`/${locale}/blog`}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {messages.blog}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href={`/${otherLocale}`}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            {otherLabel}
          </Link>
          <Link
            href="/login"
            className="hidden text-sm text-gray-600 hover:text-gray-900 transition-colors sm:block"
          >
            {messages.login}
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            {messages.getStarted}
          </Link>
        </div>
      </div>
    </header>
  );
}
