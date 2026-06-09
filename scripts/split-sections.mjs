import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";

const localeArgIndex = process.argv.indexOf("--locale");
const locale =
  localeArgIndex >= 0 ? process.argv[localeArgIndex + 1] ?? "es" : "es";
const docsDir = join("docs", locale);

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function stripChapterPrefix(text) {
  return text.replace(/^Cap(?:i|\u00ed)tulo\s+\d+:\s*/i, "");
}

function stripSectionPrefix(text) {
  return text.replace(/^Secci(?:o|\u00f3)n\s+\d+:\s*/i, "");
}

function chapterNumber(text) {
  const match = text.match(/capitulo-(\d+)/i) ?? text.match(/cap(?:i|\u00ed)tulo\s+(\d+)/i);
  return match ? Number(match[1]) : 0;
}

async function findLegacyChapterFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findLegacyChapterFiles(fullPath)));
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;

    const rel = relative(docsDir, fullPath).replace(/\\/g, "/");
    if (/^capitulo-\d+\/[^/]+\.md$/i.test(rel)) {
      files.push(fullPath);
    }
  }

  return files;
}

function splitBySecondLevelHeadings(content) {
  const lines = content.split(/\r?\n/);
  const starts = [];
  let inFence = false;

  lines.forEach((line, index) => {
    if (/^```/.test(line.trim())) {
      inFence = !inFence;
      return;
    }
    if (!inFence && /^##\s+/.test(line)) {
      starts.push(index);
    }
  });

  if (starts.length === 0) {
    return { overview: content, sections: [] };
  }

  const overview = lines.slice(0, starts[0]).join("\n").trimEnd();
  const sections = starts.map((start, index) => {
    const end = starts[index + 1] ?? lines.length;
    const sectionLines = lines.slice(start, end);
    const title = sectionLines[0].replace(/^##\s+/, "").trim();
    return {
      title,
      content: sectionLines.join("\n").trimEnd(),
    };
  });

  return { overview, sections };
}

function uniqueSectionSlug(title, seen) {
  const base = slugify(stripSectionPrefix(title)) || "seccion";
  const next = (seen.get(base) ?? 0) + 1;
  seen.set(base, next);
  return next === 1 ? base : `${base}-${next}`;
}

const chapterFiles = (await findLegacyChapterFiles(docsDir)).sort((a, b) => {
  return chapterNumber(a) - chapterNumber(b);
});

for (const sourcePath of chapterFiles) {
  const source = await readFile(sourcePath, "utf8");
  const h1 = source.match(/^#\s+(.+)$/m)?.[1]?.trim();
  if (!h1) continue;

  const title = stripChapterPrefix(h1);
  const chapterSlug = slugify(title);
  const targetDir = join(docsDir, chapterSlug);
  const sectionsDir = join(targetDir, "sections");
  const { overview, sections } = splitBySecondLevelHeadings(source);

  await mkdir(targetDir, { recursive: true });
  await rm(sectionsDir, { recursive: true, force: true });
  await mkdir(sectionsDir, { recursive: true });

  await writeFile(join(targetDir, "index.md"), `${overview.trimEnd()}\n`, "utf8");

  const seen = new Map();
  for (const [index, section] of sections.entries()) {
    const id = uniqueSectionSlug(section.title, seen);
    await writeFile(
      join(sectionsDir, `${id}.md`),
      `<!-- order: ${index + 1} -->\n\n${section.content.trimEnd()}\n`,
      "utf8",
    );
  }

  console.log(`Split ${sourcePath} -> ${targetDir} (${sections.length} sections)`);
}
