import { CHAPTER_MANIFEST } from "../data/content-manifest";
import { EXERCISES } from "../data/exercises";
import {
  PRACTICE_PROGRESS_STORAGE_KEY,
  getPracticeProgress,
  savePracticeProgress,
  type PracticeStatus,
} from "./practiceProgress";
import { notifyProgressUpdated } from "./progressEvents";
import {
  READ_PROGRESS_STORAGE_KEY,
  getReadChapters,
  saveReadChapters,
} from "./readProgress";

export const PROGRESS_BACKUP_FORMAT = "programming-bitcoin-progress";
export const PROGRESS_BACKUP_VERSION = 1;
export const MAX_PROGRESS_BACKUP_BYTES = 1_000_000;

export type ProgressBackup = {
  format: typeof PROGRESS_BACKUP_FORMAT;
  version: typeof PROGRESS_BACKUP_VERSION;
  exportedAt: string;
  readChapters: string[];
  practiceProgress: Record<string, PracticeStatus>;
};

export class ProgressBackupError extends Error {
  constructor(
    message: string,
    readonly code: "invalid" | "version" | "storage",
  ) {
    super(message);
    this.name = "ProgressBackupError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function createProgressBackup(): ProgressBackup {
  return {
    format: PROGRESS_BACKUP_FORMAT,
    version: PROGRESS_BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    readChapters: [...getReadChapters()],
    practiceProgress: getPracticeProgress(),
  };
}

function parseProgressBackup(value: unknown): ProgressBackup {
  if (!isRecord(value) || value.format !== PROGRESS_BACKUP_FORMAT) {
    throw new ProgressBackupError("Invalid progress backup file.", "invalid");
  }
  if (value.version !== PROGRESS_BACKUP_VERSION) {
    throw new ProgressBackupError(
      "Unsupported progress backup version.",
      "version",
    );
  }
  if (
    !Array.isArray(value.readChapters) ||
    !value.readChapters.every((chapter) => typeof chapter === "string") ||
    !isRecord(value.practiceProgress)
  ) {
    throw new ProgressBackupError("Invalid progress backup file.", "invalid");
  }

  const knownChapters = new Set(
    CHAPTER_MANIFEST.map(({ number }) => String(number)),
  );
  const knownExercises = new Set(EXERCISES.map(({ id }) => id));
  const readChapters = [...new Set(value.readChapters)].filter((chapter) =>
    knownChapters.has(chapter),
  );
  const practiceProgress: Record<string, PracticeStatus> = {};

  for (const [exerciseId, status] of Object.entries(value.practiceProgress)) {
    if (status !== "passed" && status !== "attempted") {
      throw new ProgressBackupError("Invalid progress backup file.", "invalid");
    }
    if (knownExercises.has(exerciseId)) {
      practiceProgress[exerciseId] = status;
    }
  }

  return {
    format: PROGRESS_BACKUP_FORMAT,
    version: PROGRESS_BACKUP_VERSION,
    exportedAt: typeof value.exportedAt === "string" ? value.exportedAt : "",
    readChapters,
    practiceProgress,
  };
}

export function downloadProgressBackup() {
  const backup = createProgressBackup();
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `programming-bitcoin-progress-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function importProgressBackup(value: unknown) {
  const backup = parseProgressBackup(value);
  const mergedReadChapters = new Set([
    ...getReadChapters(),
    ...backup.readChapters,
  ]);
  const mergedPracticeProgress = getPracticeProgress();

  for (const [exerciseId, importedStatus] of Object.entries(
    backup.practiceProgress,
  )) {
    if (
      importedStatus === "passed" ||
      mergedPracticeProgress[exerciseId] !== "passed"
    ) {
      mergedPracticeProgress[exerciseId] = importedStatus;
    }
  }

  try {
    const previousRead = localStorage.getItem(READ_PROGRESS_STORAGE_KEY);
    const previousPractice = localStorage.getItem(
      PRACTICE_PROGRESS_STORAGE_KEY,
    );

    try {
      saveReadChapters(mergedReadChapters);
      savePracticeProgress(mergedPracticeProgress);
    } catch (error) {
      try {
        if (previousRead === null) {
          localStorage.removeItem(READ_PROGRESS_STORAGE_KEY);
        } else {
          localStorage.setItem(READ_PROGRESS_STORAGE_KEY, previousRead);
        }
        if (previousPractice === null) {
          localStorage.removeItem(PRACTICE_PROGRESS_STORAGE_KEY);
        } else {
          localStorage.setItem(PRACTICE_PROGRESS_STORAGE_KEY, previousPractice);
        }
      } catch {
        // Preserve the original storage failure for the UI.
      }
      throw error;
    }
  } catch {
    throw new ProgressBackupError(
      "Could not save imported progress in this browser.",
      "storage",
    );
  }

  notifyProgressUpdated();
  return {
    readChapters: backup.readChapters.length,
    exercises: Object.keys(backup.practiceProgress).length,
  };
}
