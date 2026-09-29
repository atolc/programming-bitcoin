import { describe, expect, it } from "vitest";
import {
  EXERCISES,
  getChapterExerciseIds,
  getChapterFolderForLocale,
  getExerciseById,
  getExerciseCountsByChapter,
  getExerciseFilename,
  getExercisesByChapter,
  getLocalizedExerciseContent,
  type Exercise,
} from "./exercises";

describe("exercise lookup and filtering", () => {
  it("returns exercises for a chapter in ascending order", () => {
    const exercises = getExercisesByChapter(1);

    expect(exercises.length).toBeGreaterThan(0);
    expect(exercises.map(({ order }) => order)).toEqual(
      [...exercises].map(({ order }) => order).sort((a, b) => a - b),
    );
    expect(getChapterExerciseIds(1)).toEqual(exercises.map(({ id }) => id));
    expect(getExercisesByChapter(-1)).toEqual([]);
  });

  it("looks up exercise ids and counts by chapter", () => {
    const exercise = EXERCISES[0];

    expect(exercise).toBeDefined();
    expect(getExerciseById(exercise.id)).toEqual(exercise);
    expect(getExerciseById("missing-exercise")).toBeUndefined();
    expect(getExerciseCountsByChapter()[exercise.chapter]).toBe(
      getExercisesByChapter(exercise.chapter).length,
    );
  });

  it("returns localized content and locale-specific chapter folders", () => {
    const exercise = EXERCISES[0];

    expect(getLocalizedExerciseContent(exercise, "es")).toEqual(
      exercise.locales.es,
    );
    expect(getChapterFolderForLocale(1, "es")).toBe("campos-finitos");
    expect(getChapterFolderForLocale(1, "en")).toBe("finite-fields");
    expect(getChapterFolderForLocale(999, "es")).toBeUndefined();
  });
});

describe("getExerciseFilename", () => {
  const makeExercise = (id: string, filename?: string) =>
    ({ id, filename }) as Exercise;

  it("uses explicit filenames and handles known id patterns", () => {
    expect(getExerciseFilename(makeExercise("ch01-book-3"))).toBe("ch01_ex03.py");
    expect(getExerciseFilename(makeExercise("ch04-demo-parse-transaction-2")))
      .toBe("parse_transaction.py");
    expect(getExerciseFilename(makeExercise("custom-exercise"))).toBe(
      "custom_exercise.py",
    );
    expect(getExerciseFilename(makeExercise("ch01-book-3", "provided.py")))
      .toBe("provided.py");
  });
});
