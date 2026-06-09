import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { CHAPTER_MANIFEST } from "./content-manifest.mjs";

const ENGLISH_TITLES = {
  1: "Chapter 1: Finite Fields",
  2: "Chapter 2: Elliptic Curves",
  3: "Chapter 3: Elliptic Curve Cryptography",
  4: "Chapter 4: Serialization",
  5: "Chapter 5: Transactions",
  6: "Chapter 6: Script",
  7: "Chapter 7: Transaction Creation and Validation",
  8: "Chapter 8: Pay-to-Script Hash",
  9: "Chapter 9: Blocks",
  10: "Chapter 10: Networking",
  11: "Chapter 11: Simplified Payment Verification",
  12: "Chapter 12: Bloom Filters",
  13: "Chapter 13: Segwit",
  14: "Chapter 14: Advanced Topics and Next Steps",
};

function translateHeadings(content, chapterNumber) {
  let result = content
    .replace(/^# Capítulo \d+:/m, `# ${ENGLISH_TITLES[chapterNumber].split(": ")[0]}:`)
    .replace(/^# Capítulo \d+:\s*/m, `# ${ENGLISH_TITLES[chapterNumber]}\n`)
    .replace(/^## Sección \d+:\s*/gm, "## ");

  if (/^# Capítulo/m.test(content)) {
    const title = ENGLISH_TITLES[chapterNumber];
    result = content.replace(/^# .+$/m, `# ${title}`);
  }

  return result;
}

async function ensureDir(path) {
  await mkdir(path, { recursive: true });
}

for (const chapter of CHAPTER_MANIFEST) {
  const esFolder = chapter.folders.es;
  const enFolder = chapter.folders.en;
  const enRoot = join("docs", "en", enFolder);
  const enSections = join(enRoot, "sections");

  await ensureDir(enSections);

  const esIndex = join("docs", "es", esFolder, "index.md");
  const enIndex = join(enRoot, "index.md");
  const indexContent = await readFile(esIndex, "utf8");
  await writeFile(enIndex, translateHeadings(indexContent, chapter.number));

  for (const slugs of Object.values(chapter.sections)) {
    const esPath = join("docs", "es", esFolder, "sections", `${slugs.es}.md`);
    const enPath = join(enSections, `${slugs.en}.md`);
    const sectionContent = await readFile(esPath, "utf8");
    await writeFile(enPath, translateHeadings(sectionContent, chapter.number));
  }
}

console.log("Bootstrapped docs/en structure from docs/es");
