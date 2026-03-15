import type { Locale } from "./config";
import en from "./en.json";
import da from "./da.json";

const messages: Record<Locale, typeof en> = { en, da };

export function getMessages(locale: Locale) {
  return messages[locale] || messages.en;
}

// Helper to get nested values like "hero.title"
export function t(locale: Locale, key: string): string {
  const msg = getMessages(locale);
  const keys = key.split(".");
  let value: unknown = msg;
  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  return typeof value === "string" ? value : key;
}
