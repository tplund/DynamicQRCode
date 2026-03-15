import { notFound } from "next/navigation";
import Link from "next/link";
import { isValidLocale, type Locale } from "@/i18n/config";
import { articles, getArticleBySlug, getSlug, getTitle, getDescription } from "@/lib/blog";
import type { Metadata } from "next";

// Dynamic import map for blog content
const contentMap: Record<string, Record<string, () => Promise<{ default: React.ComponentType }>>> = {
  en: {
    "what-is-a-dynamic-qr-code": () => import("@/content/blog/en/what-is-a-dynamic-qr-code"),
    "dynamic-vs-static-qr-codes": () => import("@/content/blog/en/dynamic-vs-static-qr-codes"),
    "custom-branded-qr-codes": () => import("@/content/blog/en/custom-branded-qr-codes"),
    "qr-codes-construction-infrastructure": () => import("@/content/blog/en/qr-codes-construction-infrastructure"),
    "free-dynamic-qr-code-generator": () => import("@/content/blog/en/free-dynamic-qr-code-generator"),
    "qr-code-scan-analytics": () => import("@/content/blog/en/qr-code-scan-analytics"),
  },
  da: {
    "hvad-er-en-dynamisk-qr-kode": () => import("@/content/blog/da/hvad-er-en-dynamisk-qr-kode"),
    "dynamisk-vs-statisk-qr-kode": () => import("@/content/blog/da/dynamisk-vs-statisk-qr-kode"),
    "qr-kode-med-eget-design": () => import("@/content/blog/da/qr-kode-med-eget-design"),
    "qr-koder-byggeri-infrastruktur": () => import("@/content/blog/da/qr-koder-byggeri-infrastruktur"),
    "gratis-dynamisk-qr-kode-generator": () => import("@/content/blog/da/gratis-dynamisk-qr-kode-generator"),
    "qr-kode-scan-analyse": () => import("@/content/blog/da/qr-kode-scan-analyse"),
  },
};

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const article of articles) {
    params.push({ locale: "en", slug: article.slugEn });
    params.push({ locale: "da", slug: article.slugDa });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};

  const article = getArticleBySlug(slug, locale);
  if (!article) return {};

  const baseUrl = "https://getdynamicqrcode.com";
  const title = getTitle(article, locale);
  const description = getDescription(article, locale);

  return {
    title: `${title} — GetDynamicQRCode`,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/blog/${slug}`,
      languages: {
        en: `${baseUrl}/en/blog/${article.slugEn}`,
        "da-DK": `${baseUrl}/da/blog/${article.slugDa}`,
        "x-default": `${baseUrl}/en/blog/${article.slugEn}`,
      },
    },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.date,
      locale: locale === "da" ? "da_DK" : "en_US",
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const article = getArticleBySlug(slug, locale);
  if (!article) notFound();

  const loader = contentMap[locale]?.[slug];
  if (!loader) notFound();

  const { default: Content } = await loader();
  const title = getTitle(article, locale);

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <Link
        href={`/${locale}/blog`}
        className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        ← {locale === "da" ? "Tilbage til blog" : "Back to blog"}
      </Link>

      <time className="mt-6 block text-sm text-gray-400">{article.date}</time>
      <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">{title}</h1>

      <div className="mt-10 prose prose-gray max-w-none [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-gray-900 [&_p]:mt-4 [&_p]:text-gray-600 [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:space-y-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-gray-600 [&_ol]:mt-4 [&_ol]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:text-gray-600 [&_li]:leading-relaxed">
        <Content />
      </div>

      {/* CTA */}
      <div className="mt-16 rounded-2xl bg-gray-50 p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          {locale === "da"
            ? "Klar til at oprette din første dynamiske QR-kode?"
            : "Ready to create your first dynamic QR code?"}
        </h2>
        <p className="mt-2 text-gray-600">
          {locale === "da"
            ? "Gratis at starte. Intet kreditkort påkrævet."
            : "Free to start. No credit card required."}
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
        >
          {locale === "da" ? "Kom i gang gratis" : "Get Started Free"}
        </Link>
      </div>
    </article>
  );
}
