import type { Locale } from "../lib/locale";
import manifest from "./content-manifest.json";

export type SectionManifest = Record<Locale, string>;

export type ChapterManifest = {
  number: number;
  folders: Record<Locale, string>;
  sections: Record<string, SectionManifest>;
};

export const CHAPTER_MANIFEST = manifest as unknown as ChapterManifest[];

export const CHAPTER_BY_NUMBER = Object.fromEntries(
  CHAPTER_MANIFEST.map((chapter) => [chapter.number, chapter]),
) as Record<number, ChapterManifest>;

export function getChapterFolder(locale: Locale, number: number) {
  return CHAPTER_BY_NUMBER[number]?.folders[locale];
}

export function getSectionSlug(
  locale: Locale,
  chapterNumber: number,
  sectionKey: string,
) {
  return CHAPTER_BY_NUMBER[chapterNumber]?.sections[sectionKey]?.[locale];
}

export function findChapterByFolder(locale: Locale, folder: string) {
  return CHAPTER_MANIFEST.find((chapter) => chapter.folders[locale] === folder);
}

export function findSectionKeyBySlug(
  locale: Locale,
  chapterNumber: number,
  slug: string,
) {
  const chapter = CHAPTER_BY_NUMBER[chapterNumber];
  if (!chapter) return undefined;
  return Object.entries(chapter.sections).find(
    ([, slugs]) => slugs[locale] === slug,
  )?.[0];
}

export function resolveLocalizedPath(
  fromLocale: Locale,
  toLocale: Locale,
  chapterFolder: string,
  sectionSlug?: string,
) {
  const chapter = findChapterByFolder(fromLocale, chapterFolder);
  if (!chapter) return { chapterSlug: undefined, sectionSlug: undefined };

  const targetChapterSlug = chapter.folders[toLocale];
  if (!sectionSlug) {
    return { chapterSlug: targetChapterSlug, sectionSlug: undefined };
  }

  const sectionKey = findSectionKeyBySlug(
    fromLocale,
    chapter.number,
    sectionSlug,
  );
  const targetSectionSlug = sectionKey
    ? chapter.sections[sectionKey]?.[toLocale]
    : undefined;

  return {
    chapterSlug: targetChapterSlug,
    sectionSlug: targetSectionSlug,
  };
}
