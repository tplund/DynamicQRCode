import Link from "next/link";
import type { Locale } from "@/i18n/config";

interface FooterProps {
  locale: Locale;
  messages: {
    product: string;
    resources: string;
    legal: string;
    tagline: string;
    copyright: string;
    privacy: string;
    contact: string;
    hostedInEu: string;
  };
}

export default function Footer({ locale, messages }: FooterProps) {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-900">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="7" rx="1" fill="white" />
                  <rect x="14" y="3" width="7" height="7" rx="1" fill="white" />
                  <rect x="3" y="14" width="7" height="7" rx="1" fill="white" />
                  <rect x="14" y="14" width="3" height="3" fill="white" />
                  <rect x="18" y="18" width="3" height="3" fill="white" />
                </svg>
              </div>
              <span className="font-semibold">DynamicQR</span>
            </div>
            <p className="text-sm text-gray-500 max-w-xs">{messages.tagline}</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              </svg>
              {messages.hostedInEu}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">{messages.product}</h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}#features`} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/pricing`} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  {locale === "da" ? "Priser" : "Pricing"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">{messages.resources}</h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/blog`} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  {locale === "da" ? "Log ind" : "Log in"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">{messages.legal}</h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/privacy`} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  {messages.privacy}
                </Link>
              </li>
              <li>
                <a href="mailto:hello@getdynamicqrcode.com" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  {messages.contact}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} {messages.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
