import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";
import Pricing from "@/components/marketing/Pricing";
import FinalCTA from "@/components/marketing/FinalCTA";
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
    title: locale === "da"
      ? "Priser — GetDynamicQRCode"
      : "Pricing — GetDynamicQRCode",
    description: locale === "da"
      ? "Simpel, gennemsigtig prissætning. Start gratis med 3 dynamiske QR-koder."
      : "Simple, transparent pricing. Start free with 3 dynamic QR codes.",
    alternates: {
      canonical: `${baseUrl}/${locale}/pricing`,
      languages: {
        en: `${baseUrl}/en/pricing`,
        "da-DK": `${baseUrl}/da/pricing`,
        "x-default": `${baseUrl}/en/pricing`,
      },
    },
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const msg = getMessages(locale);

  return (
    <>
      <div className="pt-12" />
      <Pricing messages={msg.pricing} />
      <FinalCTA messages={msg.finalCta} />
    </>
  );
}
