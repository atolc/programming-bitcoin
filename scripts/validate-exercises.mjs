import { readFile } from "node:fs/promises";
import { CHAPTER_MANIFEST } from "./content-manifest.mjs";

const manifestPath = "src/data/exercises-manifest.json";
const raw = await readFile(manifestPath, "utf8");
const exercises = JSON.parse(raw);
const failures = [];
const ids = new Set();

for (const exercise of exercises) {
  if (!exercise.id) failures.push("Exercise missing id");
  if (ids.has(exercise.id)) failures.push(`Duplicate id: ${exercise.id}`);
  ids.add(exercise.id);

  if (!exercise.chapter || exercise.chapter < 1 || exercise.chapter > 14) {
    failures.push(`${exercise.id}: invalid chapter ${exercise.chapter}`);
  }

  if (!CHAPTER_MANIFEST.some((c) => c.number === exercise.chapter)) {
    failures.push(`${exercise.id}: chapter not in manifest`);
  }

  for (const locale of ["en", "es"]) {
    const content = exercise.locales?.[locale];
    if (!content?.title?.trim()) {
      failures.push(`${exercise.id}: missing ${locale} title`);
    }
    if (!content?.prompt?.trim()) {
      failures.push(`${exercise.id}: missing ${locale} prompt`);
    }
  }

  if (!exercise.starterCode && !exercise.offline) {
    failures.push(`${exercise.id}: missing starterCode`);
  }

  const mode = exercise.validation?.mode;
  if (!["stdout", "tests", "none"].includes(mode)) {
    failures.push(`${exercise.id}: invalid validation mode`);
  }
  if (mode === "stdout" && !exercise.validation.expectedOutput) {
    failures.push(`${exercise.id}: stdout mode without expectedOutput`);
  }
  if (mode === "tests" && !exercise.validation.testCode) {
    failures.push(`${exercise.id}: tests mode without testCode`);
  }
}

const byChapter = {};
for (const ex of exercises) {
  byChapter[ex.chapter] = (byChapter[ex.chapter] ?? 0) + 1;
}

console.log(`Validated ${exercises.length} exercises`);
for (const chapter of CHAPTER_MANIFEST) {
  console.log(`  Chapter ${chapter.number}: ${byChapter[chapter.number] ?? 0}`);
}

if (failures.length > 0) {
  console.error("Exercise validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Exercise validation passed.");
