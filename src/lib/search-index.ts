import { getChapters } from "../data/chapters";
import {
  EXERCISES,
  getLocalizedExerciseContent,
} from "../data/exercises";
import type { Chapter, Section } from "../data/chapters";
import type { Locale } from "./locale";
import { chapterPath, practicePath } from "./routes";

export type SearchResultType = "chapter" | "section" | "exercise";

export type SearchResult = {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  path: string;
  chapterNumber: number;
  searchText: string;
};

const searchIndexes: Partial<Record<Locale, SearchResult[]>> = {};

const MAX_INDEXED_CONTENT_LENGTH = 2000;

export type SectionTokenIndex = {
  sectionId: string;
  tokens: Set<string>;
};

export type ChapterTokenIndex = {
  chapterId: string;
  tokens: Set<string>;
  sections: SectionTokenIndex[];
};

function tokenize(text: string): string[] {
  return text.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}

function buildTokenSet(texts: string[]): Set<string> {
  const tokens = new Set<string>();

  for (const text of texts) {
    for (const token of tokenize(text)) {
      // Store prefixes as well as full words so results can update while the
      // user is typing, without rescanning the original Markdown.
      for (let length = 1; length <= token.length; length += 1) {
        tokens.add(token.slice(0, length));
      }
    }
  }

  return tokens;
}

export function buildChapterSearchIndex(
  chapters: Chapter[],
): Map<string, ChapterTokenIndex> {
  return new Map<string, ChapterTokenIndex>(
    chapters.map((chapter): [string, ChapterTokenIndex] => [
      chapter.id,
      {
        chapterId: chapter.id,
        tokens: buildTokenSet([
          chapter.title,
          ...chapter.aliases,
          chapter.content.slice(0, MAX_INDEXED_CONTENT_LENGTH),
        ]),
        sections: chapter.sections.map((section: Section) => ({
          sectionId: section.id,
          tokens: buildTokenSet([
            section.title,
            ...section.aliases,
            section.content.slice(0, MAX_INDEXED_CONTENT_LENGTH),
          ]),
        })),
      },
    ]),
  );
}

export function tokenizeSearchQuery(query: string): string[] {
  return tokenize(query.trim());
}

export function matchesChapterTokens(
  tokens: Set<string>,
  queryTokens: string[],
): boolean {
  return (
    queryTokens.length > 0 && queryTokens.every((token) => tokens.has(token))
  );
}

export function buildSearchIndex(locale: Locale): SearchResult[] {
  const cachedIndex = searchIndexes[locale];
  if (cachedIndex) return cachedIndex;

  const chapters = getChapters(locale);
  const chapterByNumber = new Map(
    chapters.map((chapter) => [chapter.number, chapter]),
  );
  const chapterLabel = locale === "es" ? "Capítulo" : "Chapter";
  const results: SearchResult[] = [];

  for (const chapter of chapters) {
    results.push({
      id: `chapter:${chapter.number}`,
      type: "chapter",
      title: chapter.title,
      subtitle: `${chapterLabel} ${chapter.number}`,
      path: chapterPath(locale, chapter.folder),
      chapterNumber: chapter.number,
      searchText: [chapter.title, chapter.aliases.join(" "), chapter.content].join(" "),
    });

    for (const section of chapter.sections) {
      results.push({
        id: `section:${chapter.number}:${section.id}`,
        type: "section",
        title: section.title,
        subtitle: chapter.title,
        path: chapterPath(locale, chapter.folder, section.id),
        chapterNumber: chapter.number,
        searchText: [
          section.title,
          section.aliases.join(" "),
          chapter.title,
          section.content,
        ].join(" "),
      });
    }
  }

  for (const exercise of EXERCISES) {
    const chapter = chapterByNumber.get(exercise.chapter);
    if (!chapter) continue;

    const content = getLocalizedExerciseContent(exercise, locale);
    const chapterShort = locale === "es" ? "Cap." : "Ch.";

    results.push({
      id: `exercise:${exercise.id}`,
      type: "exercise",
      title: content.title,
      subtitle: `${chapterShort} ${chapter.number} · ${chapter.title}`,
      path: practicePath(locale, chapter.folder, exercise.id),
      chapterNumber: chapter.number,
      searchText: [
        content.title,
        content.prompt,
        content.example,
        exercise.id,
        exercise.bookRef,
        exercise.starterCode,
        exercise.exampleCode,
      ]
        .filter(Boolean)
        .join(" "),
    });
  }

  searchIndexes[locale] = results;
  return results;
}
