import { cp, mkdir, readdir } from "node:fs/promises";
import { join } from "node:path";

const sourceDir = "contents";
const destDir = "docs";

try {
  await mkdir(destDir, { recursive: true });
  const files = await readdir(sourceDir);

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    // Match capitulo-XX
    const match = file.match(/capitulo-(\d+)/);
    if (match) {
      const chapterNum = parseInt(match[1], 10);
      const chapterFolder = join(destDir, `capitulo-${chapterNum}`);
      await mkdir(chapterFolder, { recursive: true });

      const srcPath = join(sourceDir, file);
      const destPath = join(chapterFolder, file);

      await cp(srcPath, destPath);
      console.log(`Copied ${srcPath} to ${destPath}`);
    }
  }
  console.log("Migration complete!");
} catch (error) {
  console.error("Migration failed:", error);
}
