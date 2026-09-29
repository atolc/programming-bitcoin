import { notifyProgressUpdated } from "./progressEvents";

export const PRACTICE_PROGRESS_STORAGE_KEY = "pb-practice-progress-v1";

export type PracticeStatus = "passed" | "attempted";

export function getPracticeProgress(): Record<string, PracticeStatus> {
  try {
    const raw = localStorage.getItem(PRACTICE_PROGRESS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, PracticeStatus] =>
          entry[1] === "passed" || entry[1] === "attempted",
      ),
    );
  } catch {
    return {};
  }
}

export function savePracticeProgress(progress: Record<string, PracticeStatus>) {
  localStorage.setItem(PRACTICE_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
}

export function markExerciseAttempted(exerciseId: string) {
  const progress = getPracticeProgress();
  if (progress[exerciseId] === "passed") return;
  progress[exerciseId] = "attempted";
  savePracticeProgress(progress);
  notifyProgressUpdated();
}

export function markExercisePassed(exerciseId: string) {
  const progress = getPracticeProgress();
  progress[exerciseId] = "passed";
  savePracticeProgress(progress);
  notifyProgressUpdated();
}

export function getChapterPracticeStats(
  exerciseIds: string[],
  progress: Record<string, PracticeStatus> = getPracticeProgress(),
) {
  let passed = 0;
  let attempted = 0;
  for (const id of exerciseIds) {
    const status = progress[id];
    if (status === "passed") passed += 1;
    if (status) attempted += 1;
  }
  return { passed, attempted, total: exerciseIds.length };
}
