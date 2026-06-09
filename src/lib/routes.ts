import type { Locale } from "./locale";
import { DEFAULT_LOCALE } from "./locale";

export const PRACTICE_SEGMENTS: Record<Locale, string> = {
  en: "practice",
  es: "practica",
};

export const homePath = (locale: Locale = DEFAULT_LOCALE) => `/${locale}`;

export const chapterPath = (
  locale: Locale,
  chapterId: string,
  sectionId?: string,
) =>
  sectionId
    ? `/${locale}/${chapterId}/${sectionId}`
    : `/${locale}/${chapterId}`;

export const practicePath = (
  locale: Locale,
  chapterSlug?: string,
  exerciseId?: string,
) => {
  const base = `/${locale}/${PRACTICE_SEGMENTS[locale]}`;
  if (!chapterSlug) return base;
  if (!exerciseId) return `${base}/${chapterSlug}`;
  return `${base}/${chapterSlug}/${exerciseId}`;
};

export function isPracticeSegment(locale: Locale, segment: string) {
  return segment === PRACTICE_SEGMENTS[locale];
}
