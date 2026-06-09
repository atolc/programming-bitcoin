import { readFile, writeFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { CHAPTER_MANIFEST } from "./content-manifest.mjs";

const BOOK_BASE =
  "https://raw.githubusercontent.com/jimmysong/programmingbitcoin/master";
const OUTPUT = "src/data/exercises-manifest.json";

const OFFLINE_PATTERNS = [
  /testnet/i,
  /socket\./i,
  /requests\./i,
  /connect.*network/i,
  /broadcast/i,
];

const CHAPTER_TITLES = {
  en: {
    1: "Finite Fields",
    2: "Elliptic Curves",
    3: "Elliptic Curve Cryptography",
    4: "Serialization",
    5: "Transactions",
    6: "Script",
    7: "Transaction Creation and Validation",
    8: "Pay-to-Script Hash",
    9: "Blocks",
    10: "Networking",
    11: "Simplified Payment Verification",
    12: "Bloom Filters",
    13: "Segwit",
    14: "Advanced Topics",
  },
  es: {
    1: "Campos finitos",
    2: "Curvas elípticas",
    3: "Criptografía de curva elíptica",
    4: "Serialización",
    5: "Transacciones",
    6: "Script",
    7: "Creación y validación de transacciones",
    8: "Pay-to-Script Hash",
    9: "Bloques",
    10: "Networking",
    11: "Verificación simplificada de pagos",
    12: "Filtros Bloom",
    13: "Segwit",
    14: "Temas avanzados",
  },
};

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

function parseTaggedBlocks(source, prefix) {
  const blocks = new Map();
  const re = new RegExp(
    `# tag::${prefix}(\\d+)\\[\\]\\s*([\\s\\S]*?)# end::${prefix}\\1\\[\\]`,
    "g",
  );
  let match;
  while ((match = re.exec(source)) !== null) {
    blocks.set(Number(match[1]), match[2].trim());
  }
  return blocks;
}

function parseTripleQuotedTags(source, prefix) {
  const blocks = new Map();
  const re = new RegExp(
    `'\\'\\'\\'\\s*# tag::${prefix}(\\d+)\\[\\]([\\s\\S]*?)# end::${prefix}\\1\\[\\]\\s*'\\'\\'`,
    "g",
  );
  let match;
  while ((match = re.exec(source)) !== null) {
    blocks.set(Number(match[1]), match[2].trim());
  }
  return blocks;
}

function cleanPrompt(text) {
  return text
    .replace(/^====\s*Exercise\s*\d+\s*/i, "")
    .replace(/__F__~(\d+)~/g, "F_$1")
    .replace(/__F~p~__/g, "F_p")
    .replace(/pass:\[[^\]]*\]/g, "")
    .replace(/\+\+\+\+[\s\S]*?\+\+\+\+/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function promptToMarkdown(text) {
  const cleaned = cleanPrompt(text);
  const lines = cleaned.split("\n").map((line) => {
    const bullet = line.match(/^\*\s+(.*)/);
    if (bullet) return `- ${bullet[1]}`;
    return line;
  });
  return lines.join("\n");
}

function answerToStdout(answer) {
  const lines = [];
  for (const line of answer.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith(">>>")) {
      const expr = trimmed.slice(3).trim();
      if (expr) lines.push(`print(${expr})`);
    } else if (trimmed.startsWith("...")) {
      continue;
    }
  }
  if (lines.length === 0) return null;
  return lines.join("\n");
}

function extractExpectedOutput(answer) {
  const outputs = [];
  for (const line of answer.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith(">>>") || trimmed.startsWith("...")) {
      continue;
    }
    outputs.push(trimmed);
  }
  return outputs.join("\n").trim() || null;
}

function isOfflineCode(code) {
  return OFFLINE_PATTERNS.some((re) => re.test(code));
}

function extractSandboxes(content) {
  const blocks = [];
  const re = /```python-sandbox\r?\n([\s\S]*?)```/g;
  let match;
  while ((match = re.exec(content)) !== null) {
    const full = match[1].replace(/\n$/, "");
    const separator = full.includes("\r\n---\r\n") ? "\r\n---\r\n" : "\n---\n";
    const sepIndex = full.indexOf(separator);
    if (sepIndex !== -1) {
      blocks.push({
        code: full.slice(0, sepIndex),
        expectedOutput: full.slice(sepIndex + separator.length).trim(),
      });
    } else {
      blocks.push({ code: full, expectedOutput: null });
    }
  }
  return blocks;
}

function extractSectionTitle(content) {
  const match = content.match(/^##\s+(.+)$/m);
  return match ? match[1].trim() : "Demo";
}

async function loadBookChapter(chapterNum) {
  const padded = String(chapterNum).padStart(2, "0");
  const answersUrl = `${BOOK_BASE}/code-ch${padded}/answers.py`;
  try {
    return await fetchText(answersUrl);
  } catch {
    return null;
  }
}

async function loadEccModule() {
  try {
    return await fetchText(`${BOOK_BASE}/ecc.py`);
  } catch {
    return "";
  }
}

function buildFieldElementStarter(extraMethods = "") {
  return `class FieldElement:
    def __init__(self, num, prime):
        if num >= prime or num < 0:
            raise ValueError(f"Number {num} is not in field 0 to {prime - 1}")
        self.num = num
        self.prime = prime

    def __repr__(self):
        return f"FieldElement_{self.prime}({self.num})"

    def __eq__(self, other):
        if other is None:
            return False
        return self.num == other.num and self.prime == other.prime
${extraMethods}`;
}

const CH1_METHOD_TESTS = {
  1: `a = FieldElement(2, 31)
b = FieldElement(2, 31)
c = FieldElement(15, 31)
assert a == b
assert a != c
print("All tests passed!")`,
  3: `a = FieldElement(3, 31)
b = FieldElement(6, 31)
assert a - b == FieldElement(28, 31)
print("All tests passed!")`,
  6: `a = FieldElement(3, 31)
b = FieldElement(6, 31)
assert a * b == FieldElement(18, 31)
print("All tests passed!")`,
  9: `a = FieldElement(3, 31)
b = FieldElement(24, 31)
assert a / b == FieldElement(4, 31)
print("All tests passed!")`,
};

async function generateBookExercises(chapterNum, answersSource, eccSource) {
  const exercises = [];
  const exerciseBlocks = new Map([
    ...parseTaggedBlocks(answersSource, "exercise"),
    ...parseTripleQuotedTags(answersSource, "exercise"),
  ]);
  const answerBlocks = new Map([
    ...parseTaggedBlocks(answersSource, "answer"),
    ...parseTripleQuotedTags(answersSource, "answer"),
  ]);

  const sortedNums = [...exerciseBlocks.keys()].sort((a, b) => a - b);

  for (const num of sortedNums) {
    const promptRaw = exerciseBlocks.get(num);
    const answerRaw = answerBlocks.get(num) ?? "";
    const id = `ch${String(chapterNum).padStart(2, "0")}-book-${num}`;
    const promptEn = promptToMarkdown(promptRaw);

    const isMethodAnswer = /^def\s/m.test(answerRaw);
    const mathRunner = answerToStdout(answerRaw);
    const expectedOutput = extractExpectedOutput(answerRaw);

    let starterCode = "";
    let testCode = "";
    let validation = { mode: "none" };
    let kind = "book";

    if (isMethodAnswer) {
      kind = "book";
      const methodName = answerRaw.match(/def\s+(\w+)/)?.[1] ?? "solve";
      if (chapterNum === 1) {
        starterCode =
          buildFieldElementStarter(
            `\n    # TODO: implement ${methodName}\n    pass\n`,
          );
        testCode = CH1_METHOD_TESTS[num] ?? "print('All tests passed!')";
        validation = { mode: "tests", testCode };
      } else {
        starterCode = `# Exercise ${num}\n# Implement your solution below\n\npass`;
        validation = {
          mode: "tests",
          testCode: `${answerRaw}\nprint("All tests passed!")`,
        };
      }
    } else if (mathRunner && expectedOutput) {
      kind = "math";
      const primeMatch = answerRaw.match(/prime\s*=\s*(\d+)/);
      const prime = primeMatch?.[1] ?? "57";
      const printLines = mathRunner
        .split("\n")
        .filter((l) => l.trim().startsWith("print("));
      starterCode = [
        `p = ${prime}`,
        "# Solve each problem and print the result on its own line",
        ...printLines.map((line) => `# ${line}`),
        "",
        "# Write your solutions below:",
      ].join("\n");
      validation = { mode: "stdout", expectedOutput };
    } else if (expectedOutput) {
      starterCode = `# Exercise ${num}\n\n`;
      validation = { mode: "stdout", expectedOutput };
    } else {
      starterCode = answerRaw || `# Exercise ${num}\n\npass`;
      validation = { mode: "none" };
    }

    const offline =
      isOfflineCode(starterCode + answerRaw) ||
      /testnet|broadcast.*network|connect to the network/i.test(promptEn);

    if (offline && kind === "math") {
      starterCode = `# This exercise requires a local Python environment with network access.\n# Read the instructions and implement offline.\n\npass`;
      validation = { mode: "none" };
    }

    exercises.push({
      id,
      chapter: chapterNum,
      kind,
      order: num,
      bookRef: `Exercise ${num}`,
      locales: {
        en: {
          title: `Exercise ${num}`,
          prompt: promptEn,
        },
        es: {
          title: `Ejercicio ${num}`,
          prompt: promptEn,
          needsReview: true,
        },
      },
      starterCode,
      validation,
      solution: answerRaw,
      offline,
      timeoutMs: chapterNum >= 5 ? 15000 : 10000,
    });
  }

  return exercises;
}

async function scanDocSandboxes() {
  const demos = [];
  const sectionKeyBySlug = new Map();

  for (const chapter of CHAPTER_MANIFEST) {
    for (const [key, slugs] of Object.entries(chapter.sections)) {
      sectionKeyBySlug.set(`${chapter.number}:en:${slugs.en}`, key);
      sectionKeyBySlug.set(`${chapter.number}:es:${slugs.es}`, key);
    }
  }

  for (const locale of ["en", "es"]) {
    for (const chapter of CHAPTER_MANIFEST) {
      const folder = chapter.folders[locale];
      const sectionsDir = join("docs", locale, folder, "sections");
      let files;
      try {
        files = (await readdir(sectionsDir)).filter((f) => f.endsWith(".md"));
      } catch {
        continue;
      }

      for (const file of files) {
        const content = await readFile(join(sectionsDir, file), "utf8");
        const sandboxes = extractSandboxes(content);
        if (sandboxes.length === 0) continue;

        const sectionSlug = file.replace(/\.md$/, "");
        const sectionKey =
          sectionKeyBySlug.get(`${chapter.number}:${locale}:${sectionSlug}`) ??
          sectionSlug;
        const sectionTitle = extractSectionTitle(content);

        sandboxes.forEach((sandbox, index) => {
          const id = `ch${String(chapter.number).padStart(2, "0")}-demo-${sectionKey}-${index + 1}`;
          const existing = demos.find((d) => d.id === id);
          const localeContent = {
            title: `${sectionTitle} — Demo ${index + 1}`,
            prompt: locale === "en"
              ? `Run and explore this code from the **${sectionTitle}** section.`
              : `Ejecuta y explora este código de la sección **${sectionTitle}**.`,
          };

          if (existing) {
            existing.locales[locale] = localeContent;
            if (locale === "en") {
              existing.starterCode = sandbox.code;
              if (sandbox.expectedOutput) {
                existing.validation = {
                  mode: "stdout",
                  expectedOutput: sandbox.expectedOutput,
                };
              }
            }
          } else {
            demos.push({
              id,
              chapter: chapter.number,
              kind: "demo",
              order: 1000 + index,
              bookRef: sectionTitle,
              locales: {
                en: locale === "en" ? localeContent : { title: "", prompt: "" },
                es: locale === "es" ? localeContent : { title: "", prompt: "" },
              },
              starterCode: sandbox.code,
              validation: sandbox.expectedOutput
                ? { mode: "stdout", expectedOutput: sandbox.expectedOutput }
                : { mode: "none" },
              offline: isOfflineCode(sandbox.code),
              timeoutMs: chapter.number >= 5 ? 15000 : 10000,
            });
          }
        });
      }
    }
  }

  return demos.filter(
    (d) => d.locales.en.title || d.locales.es.title,
  );
}

const SPANISH_PROMPTS = {
  "ch01-book-1": {
    title: "Ejercicio 1",
    prompt:
      "Escribe el método `__ne__` correspondiente, que compruebe si dos objetos `FieldElement` **no son iguales**.",
  },
  "ch01-book-2": {
    title: "Ejercicio 2",
    prompt:
      "Resuelve estos problemas en $F_{57}$ (asume que todas las sumas son $+_f$ y las restas son $-f$):\n\n- $44 + 33$\n- $9 - 29$\n- $17 + 42 + 49$\n- $52 - 30 - 38$",
  },
  "ch01-book-3": {
    title: "Ejercicio 3",
    prompt:
      "Escribe el método `__sub__` que define la resta de dos elementos de un campo finito.",
  },
  "ch01-book-4": {
    title: "Ejercicio 4",
    prompt:
      "Resuelve en $F_{97}$:\n\n- $95 \\cdot 45 \\cdot 31$\n- $17 \\cdot 13 \\cdot 19 \\cdot 44$\n- $12^7 \\cdot 77^{49}$",
  },
  "ch01-book-6": {
    title: "Ejercicio 6",
    prompt:
      "Escribe el método `__mul__` que define la multiplicación de dos elementos de un campo finito.",
  },
  "ch01-book-9": {
    title: "Ejercicio 9",
    prompt:
      "Escribe el método `__truediv__` que define la división de dos elementos de un campo finito.",
  },
};

function fillMissingLocales(exercises) {
  for (const ex of exercises) {
    const esOverride = SPANISH_PROMPTS[ex.id];
    if (esOverride) {
      ex.locales.es = esOverride;
    } else if (!ex.locales.es.title && ex.locales.en.title) {
      ex.locales.es = {
        title: ex.locales.en.title.replace("Exercise", "Ejercicio"),
        prompt: ex.locales.en.prompt,
      };
      ex.needsReview = true;
    }
    if (!ex.locales.en.title && ex.locales.es.title) {
      ex.locales.en = {
        title: ex.locales.es.title,
        prompt: ex.locales.es.prompt,
      };
      ex.needsReview = true;
    }
    if (
      !esOverride &&
      ex.locales.en.prompt === ex.locales.es.prompt &&
      ex.kind === "book"
    ) {
      ex.needsReview = true;
    }
  }
  return exercises;
}

async function main() {
  const allExercises = [];
  const seenIds = new Set();

  for (let ch = 1; ch <= 12; ch++) {
    const answers = await loadBookChapter(ch);
    if (answers) {
      const bookExercises = await generateBookExercises(ch, answers, "");
      for (const ex of bookExercises) {
        if (!seenIds.has(ex.id)) {
          seenIds.add(ex.id);
          allExercises.push(ex);
        }
      }
      console.log(`Chapter ${ch}: ${bookExercises.length} book exercises`);
    }
  }

  const demos = await scanDocSandboxes();
  for (const demo of demos) {
    if (!seenIds.has(demo.id)) {
      seenIds.add(demo.id);
      allExercises.push(demo);
    }
  }
  console.log(`Doc sandboxes: ${demos.length} demos`);

  allExercises.sort((a, b) => {
    if (a.chapter !== b.chapter) return a.chapter - b.chapter;
    return a.order - b.order;
  });

  const final = fillMissingLocales(allExercises);
  await writeFile(OUTPUT, JSON.stringify(final, null, 2) + "\n");
  console.log(`Wrote ${final.length} exercises to ${OUTPUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
