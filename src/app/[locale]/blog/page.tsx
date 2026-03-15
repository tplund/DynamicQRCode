import { notFound } from "next/navigation";
import Link from "next/link";
import { isValidLocale, type Locale } from "@/i18n/config";
import { articles, getSlug, getTitle, getDescription } from "@/lib/blog";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const baseUrl = "https://getdynamicqrcode.com";

  return {
    title: locale === "da" ? "Blog — GetDynamicQRCode" : "Blog — GetDynamicQRCode",
    description: locale === "da"
      ? "Artikler om dynamiske QR-koder, branding, analytics og best practices."
      : "Articles about dynamic QR codes, branding, analytics, and best practices.",
    alternates: {
      canonical: `${baseUrl}/${locale}/blog`,
      languages: {
        en: `${baseUrl}/en/blog`,
        "da-DK": `${baseUrl}/da/blog`,
        "x-default": `${baseUrl}/en/blog`,
      },
    },
  };
}

export default async function BlogIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Blog</h1>
      <p className="mt-4 text-gray-600">
        {locale === "da"
          ? "Alt du skal vide om dynamiske QR-koder."
          : "Everything you need to know about dynamic QR codes."}
      </p>

      <div className="mt-12 space-y-6">
        {articles.map((article) => {
          const slug = getSlug(article, locale);
          const title = getTitle(article, locale);
          const desc = getDescription(article, locale);

          return (
            <Link
              key={slug}
              href={`/${locale}/blog/${slug}`}
              className="block rounded-xl border border-gray-100 bg-white p-6 transition-all hover:border-gray-200 hover:shadow-md"
            >
              <time className="text-xs text-gray-400">{article.date}</time>
              <h2 className="mt-2 text-xl font-semibold text-gray-900">{title}</h2>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{desc}</p>
              <span className="mt-3 inline-block text-sm font-medium text-blue-600">
                {locale === "da" ? "Læs mere →" : "Read more →"}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
