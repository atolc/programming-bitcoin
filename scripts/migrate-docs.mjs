import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { normalizeDisplayMath } from "./normalize-math.mjs";

const sourceDir = "contents";
const destDir = "docs";

try {
  await mkdir(destDir, { recursive: true });
  const files = await readdir(sourceDir);

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const match = file.match(/capitulo-(\d+)/);
    if (!match) continue;

    const chapterNum = parseInt(match[1], 10);
    const chapterFolder = join(destDir, `capitulo-${chapterNum}`);
    await mkdir(chapterFolder, { recursive: true });

    const srcPath = join(sourceDir, file);
    const destPath = join(chapterFolder, file);
    const content = normalizeDisplayMath(await readFile(srcPath, "utf8"));

    await writeFile(destPath, content, "utf8");
    console.log(`Migrated ${srcPath} to ${destPath}`);
  }

  console.log("Migration complete!");
} catch (error) {
  console.error("Migration failed:", error);
  process.exit(1);
}
