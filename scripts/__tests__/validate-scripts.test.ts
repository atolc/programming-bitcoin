import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import contentManifest from "../../src/data/content-manifest.json";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
let fixtureRoot: string;

function writeContentTree() {
  for (const chapter of contentManifest) {
    for (const locale of ["es", "en"] as const) {
      const chapterDir = join(
        fixtureRoot,
        "docs",
        locale,
        chapter.folders[locale],
      );
      const sectionsDir = join(chapterDir, "sections");
      mkdirSync(sectionsDir, { recursive: true });
      writeFileSync(join(chapterDir, "index.md"), "# Chapter\n", "utf8");

      for (const section of Object.values(chapter.sections)) {
        writeFileSync(
          join(sectionsDir, `${section[locale]}.md`),
          "# Section\n",
          "utf8",
        );
      }
    }
  }
}

function runValidator(name: string) {
  return spawnSync(
    process.execPath,
    [join(projectRoot, "scripts", name)],
    { cwd: fixtureRoot, encoding: "utf8" },
  );
}

describe("CI validation scripts", () => {
  beforeEach(() => {
    fixtureRoot = mkdtempSync(join(tmpdir(), "programming-bitcoin-validation-"));
  });

  afterEach(() => {
    rmSync(fixtureRoot, { recursive: true, force: true });
  });

  it("validates chapter section counts and reports missing section folders", () => {
    writeContentTree();
    expect(runValidator("validate-chapters.mjs").status).toBe(0);

    const missingSections = join(
      fixtureRoot,
      "docs",
      "es",
      contentManifest[0].folders.es,
      "sections",
    );
    rmSync(missingSections, { recursive: true, force: true });

    const result = runValidator("validate-chapters.mjs");
    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      `Missing sections directory: ${relative(fixtureRoot, missingSections)}`,
    );
  });

  it("checks locale parity and identifies missing translated files", () => {
    writeContentTree();
    expect(runValidator("validate-locales.mjs").status).toBe(0);

    const missingIndex = join(
      fixtureRoot,
      "docs",
      "en",
      contentManifest[0].folders.en,
      "index.md",
    );
    unlinkSync(missingIndex);

    const result = runValidator("validate-locales.mjs");
    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      `Missing docs/en/${contentManifest[0].folders.en}/index.md`,
    );
  });

  it("validates exercise records and catches duplicate ids", () => {
    const dataDir = join(fixtureRoot, "src", "data");
    mkdirSync(dataDir, { recursive: true });
    const exercise = {
      id: "chapter-1-exercise-1",
      chapter: 1,
      locales: {
        en: { title: "Exercise", prompt: "Solve it" },
        es: { title: "Ejercicio", prompt: "Resuélvelo" },
      },
      starterCode: "pass",
      validation: { mode: "none" },
    };
    const manifestPath = join(dataDir, "exercises-manifest.json");

    writeFileSync(manifestPath, JSON.stringify([exercise]), "utf8");
    expect(runValidator("validate-exercises.mjs").status).toBe(0);

    writeFileSync(manifestPath, JSON.stringify([exercise, exercise]), "utf8");
    const result = runValidator("validate-exercises.mjs");
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Duplicate id: chapter-1-exercise-1");
  });

  it("accepts normalized math and rejects malformed display delimiters", () => {
    const docsDir = join(fixtureRoot, "docs");
    mkdirSync(docsDir, { recursive: true });
    const markdownPath = join(docsDir, "example.md");

    writeFileSync(
      markdownPath,
      "$$\n\\begin{aligned}\nx = 1\n\\end{aligned}\n$$\n",
      "utf8",
    );
    expect(runValidator("validate-math.mjs").status).toBe(0);

    writeFileSync(
      markdownPath,
      "$$\\begin{aligned}\nx = 1\n\\end{aligned}$$\n",
      "utf8",
    );
    const result = runValidator("validate-math.mjs");
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("display-math-opener-on-same-line");
  });
});
