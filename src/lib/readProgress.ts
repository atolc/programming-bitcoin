const STORAGE_KEY = "pb-read-chapters";

export function getReadChapters(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(parsed);
  } catch {
    return new Set();
  }
}

export function markChapterRead(chapterId: string) {
  const read = getReadChapters();
  read.add(chapterId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...read]));
}

export function isChapterRead(chapterId: string): boolean {
  return getReadChapters().has(chapterId);
}
