import { CHAPTER_MANIFEST } from "../data/content-manifest";
import { slugify } from "./toc";
import { notifyProgressUpdated } from "./progressEvents";

export const READ_PROGRESS_STORAGE_KEY = "pb-read-chapters-v2";
const LEGACY_STORAGE_KEY = "pb-read-chapters";

function chapterNumberFromLegacyId(id: string): string | undefined {
  const normalized = slugify(id);
  for (const chapter of CHAPTER_MANIFEST) {
    const esFolder = chapter.folders.es;
    const enFolder = chapter.folders.en;
    if (
      normalized === slugify(esFolder) ||
      normalized === slugify(enFolder) ||
      normalized === `capitulo-${chapter.number}`
    ) {
      return String(chapter.number);
    }
  }
  return undefined;
}

function migrateLegacyProgress(): Set<string> {
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    const migrated = new Set<string>();
    for (const id of parsed) {
      const number = chapterNumberFromLegacyId(id);
      if (number) migrated.add(number);
    }
    if (migrated.size > 0) {
      localStorage.setItem(
        READ_PROGRESS_STORAGE_KEY,
        JSON.stringify([...migrated]),
      );
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
    return migrated;
  } catch {
    return new Set();
  }
}

export function getReadChapters(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_PROGRESS_STORAGE_KEY);
    if (!raw) return migrateLegacyProgress();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    const knownChapters = new Set(
      CHAPTER_MANIFEST.map(({ number }) => String(number)),
    );
    return new Set(
      parsed.filter(
        (chapter): chapter is string =>
          typeof chapter === "string" && knownChapters.has(chapter),
      ),
    );
  } catch {
    return new Set();
  }
}

export function saveReadChapters(chapters: Iterable<string>) {
  localStorage.setItem(READ_PROGRESS_STORAGE_KEY, JSON.stringify([...chapters]));
}

export function markChapterRead(chapterNumber: number) {
  const read = getReadChapters();
  read.add(String(chapterNumber));
  saveReadChapters(read);
  notifyProgressUpdated();
}

export function isChapterRead(chapterNumber: number): boolean {
  return getReadChapters().has(String(chapterNumber));
}
