import type { Locale } from "@/i18n/config";

export interface BlogArticle {
  slugEn: string;
  slugDa: string;
  titleEn: string;
  titleDa: string;
  descriptionEn: string;
  descriptionDa: string;
  date: string;
}

export const articles: BlogArticle[] = [
  {
    slugEn: "what-is-a-dynamic-qr-code",
    slugDa: "hvad-er-en-dynamisk-qr-kode",
    titleEn: "What Is a Dynamic QR Code?",
    titleDa: "Hvad er en dynamisk QR-kode?",
    descriptionEn: "Learn the difference between static and dynamic QR codes, and why dynamic codes are essential for modern business.",
    descriptionDa: "Lær forskellen mellem statiske og dynamiske QR-koder, og hvorfor dynamiske koder er essentielle for moderne virksomheder.",
    date: "2026-03-15",
  },
  {
    slugEn: "dynamic-vs-static-qr-codes",
    slugDa: "dynamisk-vs-statisk-qr-kode",
    titleEn: "Dynamic QR Code vs Static QR Code: Complete Comparison",
    titleDa: "Dynamisk vs. statisk QR-kode: Komplet sammenligning",
    descriptionEn: "A detailed comparison of dynamic and static QR codes. Understand the pros, cons, and best use cases for each type.",
    descriptionDa: "En detaljeret sammenligning af dynamiske og statiske QR-koder. Forstå fordele, ulemper og bedste brugssituationer.",
    date: "2026-03-15",
  },
  {
    slugEn: "custom-branded-qr-codes",
    slugDa: "qr-kode-med-eget-design",
    titleEn: "How to Create QR Codes with Custom Branding",
    titleDa: "Sådan laver du QR-koder med eget design",
    descriptionEn: "Step-by-step guide to creating branded QR codes with custom colors, logos, and dot styles that match your brand identity.",
    descriptionDa: "Trin-for-trin guide til at oprette branded QR-koder med egne farver, logo og dot-stilarter der matcher dit brand.",
    date: "2026-03-15",
  },
  {
    slugEn: "qr-codes-construction-infrastructure",
    slugDa: "qr-koder-byggeri-infrastruktur",
    titleEn: "QR Codes for Construction and Infrastructure",
    titleDa: "QR-koder til byggeri og infrastruktur",
    descriptionEn: "How construction and infrastructure companies use dynamic QR codes for safety access, equipment documentation, and site management.",
    descriptionDa: "Hvordan byggeri- og infrastrukturvirksomheder bruger dynamiske QR-koder til sikkerhedsadgang, udstyrsdokumentation og byggepladsstyring.",
    date: "2026-03-15",
  },
  {
    slugEn: "free-dynamic-qr-code-generator",
    slugDa: "gratis-dynamisk-qr-kode-generator",
    titleEn: "Free Dynamic QR Code Generator — Create Yours Today",
    titleDa: "Gratis dynamisk QR-kode generator — Opret din i dag",
    descriptionEn: "Create free dynamic QR codes with custom branding and real-time analytics. No credit card required. Start in seconds.",
    descriptionDa: "Opret gratis dynamiske QR-koder med custom branding og real-time analytics. Intet kreditkort påkrævet. Start på sekunder.",
    date: "2026-03-15",
  },
  {
    slugEn: "qr-code-scan-analytics",
    slugDa: "qr-kode-scan-analyse",
    titleEn: "QR Code Analytics: Track Scans in Real Time",
    titleDa: "QR-kode analytics: Spor scans i real-time",
    descriptionEn: "Learn how QR code scan analytics work and how to use data to optimize your campaigns, packaging, and signage.",
    descriptionDa: "Lær hvordan QR-kode scan analytics virker, og hvordan du bruger data til at optimere dine kampagner, emballage og skilte.",
    date: "2026-03-15",
  },
];

export function getArticleBySlug(slug: string, locale: Locale): BlogArticle | undefined {
  return articles.find((a) =>
    locale === "da" ? a.slugDa === slug : a.slugEn === slug
  );
}

export function getSlug(article: BlogArticle, locale: Locale): string {
  return locale === "da" ? article.slugDa : article.slugEn;
}

export function getTitle(article: BlogArticle, locale: Locale): string {
  return locale === "da" ? article.titleDa : article.titleEn;
}

export function getDescription(article: BlogArticle, locale: Locale): string {
  return locale === "da" ? article.descriptionDa : article.descriptionEn;
}
