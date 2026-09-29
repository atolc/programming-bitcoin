import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getChapterPracticeStats,
  getPracticeProgress,
  markExerciseAttempted,
  markExercisePassed,
  PRACTICE_PROGRESS_STORAGE_KEY,
} from "../practiceProgress";
import { PROGRESS_UPDATED_EVENT } from "../progressEvents";

describe("practice progress", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns empty progress when storage is empty or malformed", () => {
    expect(getPracticeProgress()).toEqual({});

    localStorage.setItem(PRACTICE_PROGRESS_STORAGE_KEY, "not-json");
    expect(getPracticeProgress()).toEqual({});
  });

  it("filters unknown statuses from stored progress", () => {
    localStorage.setItem(
      PRACTICE_PROGRESS_STORAGE_KEY,
      JSON.stringify({
        passed: "passed",
        attempted: "attempted",
        invalid: "complete",
      }),
    );

    expect(getPracticeProgress()).toEqual({
      passed: "passed",
      attempted: "attempted",
    });
  });

  it("marks exercises attempted and notifies progress listeners", () => {
    const listener = vi.fn();
    window.addEventListener(PROGRESS_UPDATED_EVENT, listener);

    markExerciseAttempted("chapter-1-exercise-1");

    expect(getPracticeProgress()).toEqual({
      "chapter-1-exercise-1": "attempted",
    });
    expect(listener).toHaveBeenCalledOnce();
    window.removeEventListener(PROGRESS_UPDATED_EVENT, listener);
  });

  it("keeps passed exercises passed when they are attempted again", () => {
    markExercisePassed("exercise-1");
    markExerciseAttempted("exercise-1");

    expect(getPracticeProgress()).toEqual({ "exercise-1": "passed" });
  });

  it("counts passed and attempted exercises for a chapter", () => {
    expect(
      getChapterPracticeStats(["one", "two", "three", "missing"], {
        one: "passed",
        two: "attempted",
        three: "passed",
      }),
    ).toEqual({ passed: 2, attempted: 3, total: 4 });
  });
});
