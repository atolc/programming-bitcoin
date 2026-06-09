import { access } from "node:fs/promises";
import { join } from "node:path";
import { CHAPTER_MANIFEST } from "./content-manifest.mjs";

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

const failures = [];

for (const chapter of CHAPTER_MANIFEST) {
  for (const locale of ["es", "en"]) {
    const folder = chapter.folders[locale];
    const indexPath = join("docs", locale, folder, "index.md");
    if (!(await exists(indexPath))) {
      failures.push(`Missing ${indexPath}`);
    }
  }

  for (const [sectionKey, slugs] of Object.entries(chapter.sections)) {
    for (const locale of ["es", "en"]) {
      const folder = chapter.folders[locale];
      const slug = slugs[locale];
      const sectionPath = join("docs", locale, folder, "sections", `${slug}.md`);
      if (!(await exists(sectionPath))) {
        failures.push(`Missing ${sectionPath} (key: ${sectionKey})`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error("Locale parity validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Locale parity validation passed.");
