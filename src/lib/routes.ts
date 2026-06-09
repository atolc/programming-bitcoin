import type { Locale } from "./locale";
import { DEFAULT_LOCALE } from "./locale";

export const homePath = (locale: Locale = DEFAULT_LOCALE) => `/${locale}`;

export const chapterPath = (
  locale: Locale,
  chapterId: string,
  sectionId?: string,
) =>
  sectionId
    ? `/${locale}/${chapterId}/${sectionId}`
    : `/${locale}/${chapterId}`;
