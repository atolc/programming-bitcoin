// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";
import {
  getReadChapters,
  READ_PROGRESS_STORAGE_KEY,
} from "./readProgress";

const LEGACY_STORAGE_KEY = "pb-read-chapters";

describe("getReadChapters", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("migrates legacy chapter folders and removes the old value", () => {
    localStorage.setItem(
      LEGACY_STORAGE_KEY,
      JSON.stringify(["campos-finitos", "finite-fields", "capitulo-2", "unknown"]),
    );

    expect(getReadChapters()).toEqual(new Set(["1", "2"]));
    expect(localStorage.getItem(READ_PROGRESS_STORAGE_KEY)).toBe('["1","2"]');
    expect(localStorage.getItem(LEGACY_STORAGE_KEY)).toBeNull();
  });

  it("filters stored progress to known chapter numbers", () => {
    localStorage.setItem(
      READ_PROGRESS_STORAGE_KEY,
      JSON.stringify(["1", "999", 2, null]),
    );

    expect(getReadChapters()).toEqual(new Set(["1"]));
  });

  it("keeps malformed legacy data without throwing", () => {
    localStorage.setItem(LEGACY_STORAGE_KEY, "not-json");

    expect(getReadChapters()).toEqual(new Set());
    expect(localStorage.getItem(LEGACY_STORAGE_KEY)).toBe("not-json");
  });

  it("does not replace an existing v2 value with legacy progress", () => {
    localStorage.setItem(READ_PROGRESS_STORAGE_KEY, "[]");
    localStorage.setItem(LEGACY_STORAGE_KEY, '["campos-finitos"]');

    expect(getReadChapters()).toEqual(new Set());
    expect(localStorage.getItem(LEGACY_STORAGE_KEY)).not.toBeNull();
  });
});
