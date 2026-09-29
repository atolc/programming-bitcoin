import { getChapters } from "../data/chapters";
import {
  EXERCISES,
  getLocalizedExerciseContent,
} from "../data/exercises";
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
