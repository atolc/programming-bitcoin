import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * remark-math requires display math delimiters on their own line.
 * Formats like `$$\begin{aligned}` or `\end{aligned}$$` break parsing
 * and surface as red KaTeX errors in the UI.
 */
export function normalizeDisplayMath(content) {
  let next = content;

  // `$$\begin{...}` -> `$$\n\begin{...}` (keep indentation)
  next = next.replace(
    /^(\s*)\$\$(\\begin\{[a-zA-Z*]+\})/gm,
    (_, indent, begin) => `${indent}$$\n${indent}${begin}`,
  );

  // `\end{...}$$` -> `\end{...}\n$$` (keep indentation)
  next = next.replace(
    /^(\s*)(\\end\{[a-zA-Z*]+\})\$\$/gm,
    (_, indent, end) => `${indent}${end}\n${indent}$$`,
  );

  // Legacy single-dollar display math around aligned blocks
  next = next.replace(
    /^(\s*)\$(?!\$)\s*\n(\s*\\begin\{aligned\})/gm,
    (_, indent, begin) => `${indent}$$\n${begin}`,
  );
  next = next.replace(
    /^(\s*\\end\{aligned\})\s*\n(\s*)\$(?!\$)\s*$/gm,
    (_, end, indent) => `${end}\n${indent}$$`,
  );

  // Repair accidental triple-dollar closers from older migrations
  next = next.replace(/^\s*\$\$\$(?!\$)/gm, "$$");

  return next;
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

async function main() {
  for (const target of ["docs", "contents"]) {
    const files = await walk(target);
    for (const file of files) {
      const original = await readFile(file, "utf8");
      const normalized = normalizeDisplayMath(original);
      if (normalized !== original) {
        await writeFile(file, normalized, "utf8");
        console.log(`Normalized: ${file}`);
      }
    }
  }

  console.log("Math normalization complete.");
}

const isCli = process.argv[1]?.endsWith("normalize-math.mjs");
if (isCli) {
  await main();
}
