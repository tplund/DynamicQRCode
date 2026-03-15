import { notFound } from "next/navigation";
import { isValidLocale, locales, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const msg = getMessages(locale);
  const otherLocale = locale === "en" ? "da" : "en";
  const baseUrl = "https://getdynamicqrcode.com";

  return {
    title: msg.site.title,
    description: msg.site.description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        "da-DK": `${baseUrl}/da`,
        "x-default": `${baseUrl}/en`,
      },
    },
    openGraph: {
      title: msg.site.title,
      description: msg.site.description,
      url: `${baseUrl}/${locale}`,
      siteName: "GetDynamicQRCode",
      locale: locale === "da" ? "da_DK" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: msg.site.title,
      description: msg.site.description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const msg = getMessages(locale);

  return (
    <div lang={locale} className="min-h-screen bg-white text-gray-900">
      <Header locale={locale} messages={msg.nav} />
      <main>{children}</main>
      <Footer locale={locale} messages={msg.footer} />
    </div>
  );
}
