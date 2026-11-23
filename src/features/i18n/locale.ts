export const LOCALES = ["it", "es", "en", "de"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "it";

export const LOCALE_REGIONAL: Record<Locale, string> = {
  it: "it-IT",
  es: "es-ES",
  en: "en-US",
  de: "de-DE",
};

export const LOCALE_OG: Record<Locale, string> = {
  it: "it_IT",
  es: "es_ES",
  en: "en_US",
  de: "de_DE",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value.toLowerCase());
}

export function toLocale(value: unknown): Locale | null {
  if (typeof value !== "string") return null;
  const short = value.split("-")[0]?.toLowerCase();
  return isLocale(short) ? short : null;
}

export function languageTag(locale: Locale): string {
  return LOCALE_REGIONAL[locale];
}

export function ogLocale(locale: Locale): string {
  return LOCALE_OG[locale];
}
