import type { MetadataRoute } from "next";

const baseUrl = "https://getdynamicqrcode.com";
const locales = ["en", "da"] as const;

// Blog slugs mapped between locales
const blogSlugs: Record<string, Record<string, string>> = {
  "what-is-a-dynamic-qr-code": { en: "what-is-a-dynamic-qr-code", da: "hvad-er-en-dynamisk-qr-kode" },
  "dynamic-vs-static-qr-codes": { en: "dynamic-vs-static-qr-codes", da: "dynamisk-vs-statisk-qr-kode" },
  "custom-branded-qr-codes": { en: "custom-branded-qr-codes", da: "qr-kode-med-eget-design" },
  "qr-codes-construction-infrastructure": { en: "qr-codes-construction-infrastructure", da: "qr-koder-byggeri-infrastruktur" },
  "free-dynamic-qr-code-generator": { en: "free-dynamic-qr-code-generator", da: "gratis-dynamisk-qr-kode-generator" },
  "qr-code-scan-analytics": { en: "qr-code-scan-analytics", da: "qr-kode-scan-analyse" },
};

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [];

  // Marketing pages
  const marketingRoutes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/pricing", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" as const },
  ];

  for (const route of marketingRoutes) {
    for (const locale of locales) {
      pages.push({
        url: `${baseUrl}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: {
            en: `${baseUrl}/en${route.path}`,
            "da-DK": `${baseUrl}/da${route.path}`,
            "x-default": `${baseUrl}/en${route.path}`,
          },
        },
      });
    }
  }

  // Blog articles
  for (const [_key, slugs] of Object.entries(blogSlugs)) {
    for (const locale of locales) {
      const slug = slugs[locale];
      pages.push({
        url: `${baseUrl}/${locale}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
        alternates: {
          languages: {
            en: `${baseUrl}/en/blog/${slugs.en}`,
            "da-DK": `${baseUrl}/da/blog/${slugs.da}`,
            "x-default": `${baseUrl}/en/blog/${slugs.en}`,
          },
        },
      });
    }
  }

  return pages;
}
