import { slugify } from "../lib/toc";

const chapterModules = import.meta.glob("../../docs/*/index.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const sectionModules = import.meta.glob("../../docs/*/sections/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const ENGLISH_CHAPTER_TITLES: Record<number, string> = {
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
  14: "Advanced Topics and Next Steps",
};

const GENERIC_SECTION_ALIASES: Record<string, string[]> = {
  "objetivo-del-capitulo": ["chapter-objective", "chapter-goal"],
  "lo-mas-importante": ["most-important", "key-takeaways"],
  "que-hay-que-aprender": ["what-to-learn"],
  "ideas-para-estudiar": ["study-ideas"],
  "resultado-esperado": ["expected-outcome"],
  cierre: ["conclusion"],
};

const CHAPTER_SECTION_ALIASES: Record<number, Record<string, string[]>> = {
  1: {
    "mapa-del-capitulo": ["chapter-map"],
    "por-que-empezar-por-campos-finitos": [
      "learning-higher-level-math",
      "why-start-with-finite-fields",
    ],
    "definicion-y-propiedades-de-un-campo-finito": ["finite-field-definition"],
    "aritmetica-modular-la-envoltura": ["modulo-arithmetic"],
    "suma-y-resta-en-fp": ["finite-field-addition-and-subtraction"],
    "multiplicacion-y-exponenciacion": [
      "finite-field-multiplication-and-exponentiation",
    ],
    "por-que-el-orden-debe-ser-un-numero-primo": ["why-fields-are-prime"],
    "division-y-el-pequeno-teorema-de-fermat": [
      "finite-field-division",
      "fermats-little-theorem",
    ],
    "exponentes-negativos-y-grandes": [
      "negative-and-large-exponents",
      "redefining-exponentiation",
    ],
    "implementacion-en-python-de-fieldelement": [
      "constructing-a-finite-field-in-python",
      "field-element-python-implementation",
    ],
    "practica-guiada-interactiva": ["guided-interactive-practice"],
  },
  2: {
    "validar-puntos-en-la-curva": ["validating-points-on-the-curve"],
    "suma-de-puntos-distintos": ["point-addition"],
    "duplicacion-de-un-punto": ["point-doubling"],
  },
  3: {
    "secp256k1-en-numeros-pequenos": ["secp256k1-with-small-numbers"],
    "multiplicacion-escalar-double-and-add": ["scalar-multiplication-double-and-add"],
    "hashing-de-mensajes-concepto": ["message-hashing-concept"],
  },
};

export type Section = {
  id: string;
  title: string;
  aliases: string[];
  filename: string;
  content: string;
  order: number;
};

export type Chapter = {
  id: string;
  number: number;
  title: string;
  englishTitle?: string;
  aliases: string[];
  filename: string;
  content: string;
  folder: string;
  sections: Section[];
};

function chapterNumberFromPath(path: string) {
  const match = path.match(/capitulo-(\d+)/i);
  return match ? Number(match[1]) : 0;
}

function chapterNumberFromContent(content: string) {
  const heading = content.match(/^#\s+(.+)$/m)?.[1] ?? "";
  const match = heading.match(/^Cap(?:i|\u00ed)tulo\s+(\d+):/i);
  return match ? Number(match[1]) : 0;
}

function stripChapterPrefix(text: string) {
  return text.replace(/^Cap(?:i|\u00ed)tulo\s+\d+:\s*/i, "");
}

function stripSectionPrefix(text: string) {
  return text.replace(/^Secci(?:o|\u00f3)n\s+\d+:\s*/i, "");
}

function chapterTitle(content: string, fallback: string) {
  const heading = content.match(/^#\s+(.+)$/m)?.[1];
  return heading ? stripChapterPrefix(heading) : fallback;
}

function sectionTitle(content: string, fallback: string) {
  const heading = content.match(/^##\s+(.+)$/m)?.[1];
  return heading?.trim() ?? fallback;
}

function uniqueSlugs(values: Array<string | undefined>) {
  return Array.from(
    new Set(
      values
        .filter((value): value is string => Boolean(value))
        .map((value) => slugify(value))
        .filter(Boolean),
    ),
  );
}

function sectionOrder(content: string, fallback: number) {
  const match = content.match(/^<!--\s*order:\s*(\d+)\s*-->/);
  return match ? Number(match[1]) : fallback;
}

function filenameSlug(filename: string) {
  return filename.replace(/\.md$/, "");
}

const chapterNumberByFolder = Object.entries(chapterModules).reduce<
  Record<string, number>
>((acc, [path, content]) => {
  const parts = path.split("/");
  const folder = parts[parts.length - 2] ?? "";
  acc[folder] =
    chapterNumberFromContent(String(content)) || chapterNumberFromPath(path);
  return acc;
}, {});

const sectionsByChapter = Object.entries(sectionModules).reduce<
  Record<string, Section[]>
>((acc, [path, content], index) => {
  const parts = path.split("/");
  const filename = parts[parts.length - 1] ?? path;
  const folder = parts[parts.length - 3] ?? "";
  const id = filenameSlug(filename);
  const rawTitle = sectionTitle(String(content), id);
  const titleWithoutPrefix = stripSectionPrefix(rawTitle);
  const chapterNumber = chapterNumberByFolder[folder] ?? chapterNumberFromPath(path);
  const aliases = uniqueSlugs([
    id,
    rawTitle,
    titleWithoutPrefix,
    ...(GENERIC_SECTION_ALIASES[id] ?? []),
    ...(CHAPTER_SECTION_ALIASES[chapterNumber]?.[id] ?? []),
  ]);

  acc[folder] ??= [];
  acc[folder].push({
    id,
    title: rawTitle,
    aliases,
    filename,
    content: String(content),
    order: sectionOrder(String(content), index),
  });
  return acc;
}, {});

export const chapters: Chapter[] = Object.entries(chapterModules)
  .map(([path, content]) => {
    const parts = path.split("/");
    const filename = parts[parts.length - 1] ?? path;
    const folder = parts[parts.length - 2] ?? "";
    const number = chapterNumberFromContent(String(content)) || chapterNumberFromPath(path);
    const title = chapterTitle(String(content), folder);
    const englishTitle = ENGLISH_CHAPTER_TITLES[number];
    const id = slugify(title);
    const legacyFolder = number ? `capitulo-${number}` : undefined;
    const legacyFile = number
      ? `capitulo-${String(number).padStart(2, "0")}-${id}`
      : undefined;
    const sections = (sectionsByChapter[folder] ?? []).sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return a.filename.localeCompare(b.filename);
    });

    return {
      id,
      number,
      title,
      englishTitle,
      aliases: uniqueSlugs([id, englishTitle, folder, legacyFolder, legacyFile]),
      filename,
      content: String(content),
      folder,
      sections,
    };
  })
  .sort((a, b) => a.number - b.number);

export function findChapterById(id?: string) {
  if (!id) return undefined;
  const normalized = slugify(id);
  return chapters.find((chapter) => chapter.aliases.includes(normalized));
}

export function findSectionById(chapter: Chapter, id?: string) {
  if (!id) return undefined;
  const normalized = slugify(id);
  return chapter.sections.find((section) => section.aliases.includes(normalized));
}
