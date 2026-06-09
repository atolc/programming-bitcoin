import type { Locale } from "../lib/locale";
import { CHAPTER_MANIFEST } from "./content-manifest";
import manifest from "./exercises-manifest.json";

export type ExerciseKind = "book" | "coding" | "demo" | "math";
export type ValidationMode = "stdout" | "tests" | "none";

export type ExerciseLocaleContent = {
  title: string;
  prompt: string;
  example?: string;
};

export type Exercise = {
  id: string;
  chapter: number;
  kind: ExerciseKind;
  order: number;
  bookRef?: string;
  locales: Record<Locale, ExerciseLocaleContent>;
  starterCode: string;
  exampleCode?: string;
  validation: {
    mode: ValidationMode;
    expectedOutput?: string;
    testCode?: string;
  };
  solution?: string;
  offline?: boolean;
  requires?: string[];
  timeoutMs?: number;
  needsReview?: boolean;
};

export const EXERCISES = manifest as unknown as Exercise[];

export function getExercisesByChapter(chapter: number) {
  return EXERCISES.filter((e) => e.chapter === chapter).sort(
    (a, b) => a.order - b.order,
  );
}

export function getExerciseById(id: string) {
  return EXERCISES.find((e) => e.id === id);
}

export function getChapterExerciseIds(chapter: number) {
  return getExercisesByChapter(chapter).map((e) => e.id);
}

export function getExerciseCountsByChapter() {
  const counts: Record<number, number> = {};
  for (const exercise of EXERCISES) {
    counts[exercise.chapter] = (counts[exercise.chapter] ?? 0) + 1;
  }
  return counts;
}

export function getLocalizedExerciseContent(exercise: Exercise, locale: Locale) {
  return exercise.locales[locale] ?? exercise.locales.en;
}

export function getChapterFolderForLocale(chapter: number, locale: Locale) {
  return CHAPTER_MANIFEST.find((c) => c.number === chapter)?.folders[locale];
}
