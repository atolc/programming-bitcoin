export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function parseLocale(value?: string): Locale {
  return value && isLocale(value) ? value : DEFAULT_LOCALE;
}

export const LOCALE_LABELS: Record<Locale, string> = {
  es: "ES",
  en: "EN",
};

export const DOCUMENT_TITLES: Record<Locale, string> = {
  es: "Programming Bitcoin — Guía de estudio",
  en: "Programming Bitcoin — Study Guide",
};
