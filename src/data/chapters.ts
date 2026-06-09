import { slugify } from "../lib/toc";

const modules = import.meta.glob("../../docs/**/*.md", {
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

export type Chapter = {
  id: string;
  number: number;
  title: string;
  englishTitle?: string;
  aliases: string[];
  filename: string;
  content: string;
  folder: string;
};

function chapterNumber(name: string) {
  const match = name.match(/capitulo-(\d+)/i);
  return match ? Number(match[1]) : 0;
}

function chapterTitle(content: string, fallback: string) {
  const heading = content.match(/^#\s+(.+)$/m)?.[1];
  return heading?.replace(/^Cap[ií]tulo\s+\d+:\s*/i, "") ?? fallback;
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

export const chapters: Chapter[] = Object.entries(modules)
  .map(([path, content]) => {
    const parts = path.split("/");
    const filename = parts[parts.length - 1] ?? path;
    const folder = parts[parts.length - 2] ?? "";
    const number = chapterNumber(folder) || chapterNumber(filename);
    const title = chapterTitle(String(content), filename);
    const englishTitle = ENGLISH_CHAPTER_TITLES[number];
    const id = slugify(title);
    const fileId = filename.replace(/\.md$/, "");

    return {
      id,
      number,
      title,
      englishTitle,
      aliases: uniqueSlugs([id, englishTitle, folder, fileId]),
      filename,
      content: String(content),
      folder,
    };
  })
  .sort((a, b) => a.number - b.number);

export function findChapterById(id?: string) {
  if (!id) return undefined;
  const normalized = slugify(id);
  return chapters.find((chapter) => chapter.aliases.includes(normalized));
}
