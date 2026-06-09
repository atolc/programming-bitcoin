import { slugify } from "../lib/toc";
import type { Locale } from "../lib/locale";
import {
  CHAPTER_MANIFEST,
  findChapterByFolder,
  findSectionKeyBySlug,
} from "./content-manifest";

const chapterModules = import.meta.glob("../../docs/*/*/index.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const sectionModules = import.meta.glob("../../docs/*/*/sections/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const ENGLISH_CHAPTER_TITLES: Record<number, string> = {
  1: "Finite Fields",
  2: "Elliptic Curves",
  3: "Elliptic Curve Cryptography",
  4: "Serialization",
  5: "Transactions",
  6: "Script",
  7: "Transaction Creation and Validation",
  8: "Pay-to-Script Hash",
  9: "Blocks",
  10: "Networking",
  11: "Simplified Payment Verification",
  12: "Bloom Filters",
  13: "Segwit",
  14: "Advanced Topics and Next Steps",
};

export type Section = {
  id: string;
  key: string;
  title: string;
  aliases: string[];
  filename: string;
  content: string;
  order: number;
};

export type Chapter = {
  id: string;
  number: number;
  title: string;
  englishTitle?: string;
  aliases: string[];
  filename: string;
  content: string;
  folder: string;
  sections: Section[];
};

function localeFromPath(path: string): Locale | undefined {
  const match = path.match(/\/docs\/(es|en)\//);
  return match?.[1] as Locale | undefined;
}

function folderFromChapterPath(path: string) {
  const parts = path.split("/");
  return parts[parts.length - 2] ?? "";
}

function folderFromSectionPath(path: string) {
  const parts = path.split("/");
  return parts[parts.length - 4] ?? "";
}

function chapterNumberFromPath(path: string) {
  const match = path.match(/capitulo-(\d+)/i);
  return match ? Number(match[1]) : 0;
}

function chapterNumberFromContent(content: string) {
  const heading = content.match(/^#\s+(.+)$/m)?.[1] ?? "";
  const match = heading.match(/^Cap(?:i|\u00ed)tulo\s+(\d+):/i);
  if (match) return Number(match[1]);
  const enMatch = heading.match(/^Chapter\s+(\d+):/i);
  return enMatch ? Number(enMatch[1]) : 0;
}

function stripChapterPrefix(text: string) {
  return text
    .replace(/^Cap(?:i|\u00ed)tulo\s+\d+:\s*/i, "")
    .replace(/^Chapter\s+\d+:\s*/i, "");
}

function stripSectionPrefix(text: string) {
  return text
    .replace(/^Secci(?:o|\u00f3)n\s+\d+:\s*/i, "")
    .replace(/^Section\s+\d+:\s*/i, "");
}

function chapterTitle(content: string, fallback: string) {
  const heading = content.match(/^#\s+(.+)$/m)?.[1];
  return heading ? stripChapterPrefix(heading) : fallback;
}

function sectionTitle(content: string, fallback: string) {
  const heading = content.match(/^##\s+(.+)$/m)?.[1];
  return heading?.trim() ?? fallback;
}

function uniqueSlugs(values: Array<string | undefined>) {
  return Array.from(
    new Set(
      values
        .filter((value): value is string => Boolean(value))
        .map((value) => slugify(value))
        .filter(Boolean),
    ),
  );
}

function sectionOrder(content: string, fallback: number) {
  const match = content.match(/^<!--\s*order:\s*(\d+)\s*-->/);
  return match ? Number(match[1]) : fallback;
}

function filenameSlug(filename: string) {
  return filename.replace(/\.md$/, "");
}

function buildAliasesForChapter(
  locale: Locale,
  number: number,
  folder: string,
  title: string,
  englishTitle?: string,
) {
  const manifest = CHAPTER_MANIFEST.find((chapter) => chapter.number === number);
  const legacyFolder = number ? `capitulo-${number}` : undefined;
  const id = slugify(title);
  const legacyFile = number
    ? `capitulo-${String(number).padStart(2, "0")}-${id}`
    : undefined;

  const otherLocaleFolder =
    locale === "es" ? manifest?.folders.en : manifest?.folders.es;

  return uniqueSlugs([
    id,
    title,
    englishTitle,
    folder,
    otherLocaleFolder,
    legacyFolder,
    legacyFile,
    slugify(englishTitle ?? ""),
  ]);
}

function buildAliasesForSection(
  locale: Locale,
  chapterNumber: number,
  sectionKey: string,
  id: string,
  rawTitle: string,
  titleWithoutPrefix: string,
) {
  const manifest = CHAPTER_MANIFEST.find(
    (chapter) => chapter.number === chapterNumber,
  );
  const sectionManifest = manifest?.sections[sectionKey];
  const otherLocaleSlug =
    locale === "es" ? sectionManifest?.en : sectionManifest?.es;

  return uniqueSlugs([id, rawTitle, titleWithoutPrefix, otherLocaleSlug, sectionKey]);
}

function buildChaptersForLocale(locale: Locale): Chapter[] {
  const chapterEntries = Object.entries(chapterModules).filter(([path]) =>
    path.includes(`/docs/${locale}/`),
  );

  const chapterNumberByFolder = chapterEntries.reduce<Record<string, number>>(
    (acc, [path, content]) => {
      const folder = folderFromChapterPath(path);
      const manifest = findChapterByFolder(locale, folder);
      acc[folder] =
        chapterNumberFromContent(String(content)) ||
        manifest?.number ||
        chapterNumberFromPath(path);
      return acc;
    },
    {},
  );

  const sectionsByChapter = Object.entries(sectionModules)
    .filter(([path]) => path.includes(`/docs/${locale}/`))
    .reduce<Record<string, Section[]>>((acc, [path, content], index) => {
      const filename = path.split("/").pop() ?? path;
      const folder = folderFromSectionPath(path);
      const id = filenameSlug(filename);
      const rawTitle = sectionTitle(String(content), id);
      const titleWithoutPrefix = stripSectionPrefix(rawTitle);
      const chapterNumber = chapterNumberByFolder[folder] ?? 0;
      const sectionKey =
        findSectionKeyBySlug(locale, chapterNumber, id) ?? id;
      const aliases = buildAliasesForSection(
        locale,
        chapterNumber,
        sectionKey,
        id,
        rawTitle,
        titleWithoutPrefix,
      );

      acc[folder] ??= [];
      acc[folder].push({
        id,
        key: sectionKey,
        title: rawTitle,
        aliases,
        filename,
        content: String(content),
        order: sectionOrder(String(content), index),
      });
      return acc;
    }, {});

  return chapterEntries
    .map(([path, content]) => {
      const filename = path.split("/").pop() ?? path;
      const folder = folderFromChapterPath(path);
      const manifest = findChapterByFolder(locale, folder);
      const number =
        chapterNumberFromContent(String(content)) ||
        manifest?.number ||
        chapterNumberFromPath(path);
      const title = chapterTitle(String(content), folder);
      const englishTitle = ENGLISH_CHAPTER_TITLES[number];
      const id = slugify(title);
      const sections = (sectionsByChapter[folder] ?? []).sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return a.filename.localeCompare(b.filename);
      });

      return {
        id,
        number,
        title,
        englishTitle,
        aliases: buildAliasesForChapter(locale, number, folder, title, englishTitle),
        filename,
        content: String(content),
        folder,
        sections,
      };
    })
    .sort((a, b) => a.number - b.number);
}

const chaptersByLocale: Record<Locale, Chapter[]> = {
  es: buildChaptersForLocale("es"),
  en: buildChaptersForLocale("en"),
};

export function getChapters(locale: Locale): Chapter[] {
  return chaptersByLocale[locale];
}

export function findChapterById(locale: Locale, id?: string) {
  if (!id) return undefined;
  const normalized = slugify(id);
  return getChapters(locale).find((chapter) =>
    chapter.aliases.includes(normalized),
  );
}

export function findSectionById(chapter: Chapter, id?: string) {
  if (!id) return undefined;
  const normalized = slugify(id);
  return chapter.sections.find((section) => section.aliases.includes(normalized));
}

export function findChapterByIdLegacy(id?: string) {
  if (!id) return undefined;
  const normalized = slugify(id);
  return getChapters("es").find((chapter) => chapter.aliases.includes(normalized));
}

export function findSectionByIdLegacy(chapter: Chapter, id?: string) {
  return findSectionById(chapter, id);
}

/** @deprecated Use getChapters(locale) */
export const chapters = chaptersByLocale.es;
