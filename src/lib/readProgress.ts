import { CHAPTER_MANIFEST } from "../data/content-manifest";
import { slugify } from "./toc";

const STORAGE_KEY = "pb-read-chapters-v2";
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...migrated]));
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
    return migrated;
  } catch {
    return new Set();
  }
}

export function getReadChapters(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return migrateLegacyProgress();
    const parsed = JSON.parse(raw) as string[];
    return new Set(parsed);
  } catch {
    return new Set();
  }
}

export function markChapterRead(chapterNumber: number) {
  const read = getReadChapters();
  read.add(String(chapterNumber));
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...read]));
}

export function isChapterRead(chapterNumber: number): boolean {
  return getReadChapters().has(String(chapterNumber));
}
