import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { CHAPTER_MANIFEST } from "./content-manifest.mjs";

const LOCALES = ["es", "en"];
const failures = [];

for (const locale of LOCALES) {
  let totalSections = 0;

  for (const chapter of CHAPTER_MANIFEST) {
    const folder = chapter.folders[locale];
    const expectedCount = Object.keys(chapter.sections).length;
    const sectionsDir = join("docs", locale, folder, "sections");

    let actualCount = 0;
    try {
      const files = await readdir(sectionsDir);
      actualCount = files.filter((file) => file.endsWith(".md")).length;
    } catch {
      failures.push(`Missing sections directory: ${sectionsDir}`);
      continue;
    }

    totalSections += actualCount;

    if (actualCount === 0) {
      failures.push(`${locale}/${folder}: chapter has zero section files`);
    } else if (actualCount !== expectedCount) {
      failures.push(
        `${locale}/${folder}: expected ${expectedCount} sections, found ${actualCount}`,
      );
    }
  }

  console.log(
    `${locale}: ${CHAPTER_MANIFEST.length} chapters, ${totalSections} sections OK`,
  );
}

if (failures.length > 0) {
  console.error("Chapter validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Chapter validation passed.");
