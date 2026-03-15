import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";
import Hero from "@/components/marketing/Hero";
import HowItWorks from "@/components/marketing/HowItWorks";
import Features from "@/components/marketing/Features";
import UseCases from "@/components/marketing/UseCases";
import Pricing from "@/components/marketing/Pricing";
import FAQ from "@/components/marketing/FAQ";
import FinalCTA from "@/components/marketing/FinalCTA";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const msg = getMessages(locale);

  return (
    <>
      <Hero locale={locale} messages={msg.hero} />
      <HowItWorks messages={msg.howItWorks} />
      <Features messages={msg.features} />
      <UseCases messages={msg.useCases} />
      <Pricing messages={msg.pricing} />
      <FAQ messages={msg.faq} />
      <FinalCTA messages={msg.finalCta} />
    </>
  );
}
