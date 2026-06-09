import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { normalizeDisplayMath } from "./normalize-math.mjs";

const BAD_PATTERNS = [
  {
    name: "display-math-opener-on-same-line",
    regex: /^\s*\$\$\\begin\{/m,
  },
  {
    name: "display-math-closer-on-same-line",
    regex: /^\s*\\end\{[^}]+\}\$\$/m,
  },
  {
    name: "legacy-single-dollar-display-math",
    regex: /^\s*\$(?!\$)\s*\n\s*\\begin\{aligned\}/m,
  },
  {
    name: "triple-dollar-closer",
    regex: /^\s*\$\$\$/m,
  },
];

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

const failures = [];

for (const file of await walk("docs")) {
  const content = await readFile(file, "utf8");
  for (const pattern of BAD_PATTERNS) {
    if (pattern.regex.test(content)) {
      failures.push({ file, pattern: pattern.name });
    }
  }

  if (content !== normalizeDisplayMath(content)) {
    failures.push({ file, pattern: "needs-normalization" });
  }
}

if (failures.length > 0) {
  console.error("Invalid math delimiters found:");
  for (const failure of failures) {
    console.error(`- ${failure.file}: ${failure.pattern}`);
  }
  process.exit(1);
}

console.log("Math delimiter validation passed.");
