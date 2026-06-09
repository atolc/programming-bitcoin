const STORAGE_KEY = "pb-practice-progress-v1";

export type PracticeStatus = "passed" | "attempted";

export function getPracticeProgress(): Record<string, PracticeStatus> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, PracticeStatus>;
  } catch {
    return {};
  }
}

export function markExerciseAttempted(exerciseId: string) {
  const progress = getPracticeProgress();
  if (progress[exerciseId] === "passed") return;
  progress[exerciseId] = "attempted";
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function markExercisePassed(exerciseId: string) {
  const progress = getPracticeProgress();
  progress[exerciseId] = "passed";
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function getChapterPracticeStats(exerciseIds: string[]) {
  const progress = getPracticeProgress();
  let passed = 0;
  let attempted = 0;
  for (const id of exerciseIds) {
    const status = progress[id];
    if (status === "passed") passed += 1;
    if (status) attempted += 1;
  }
  return { passed, attempted, total: exerciseIds.length };
}
