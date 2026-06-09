const modules = import.meta.glob("../../docs/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

export type Chapter = {
  id: string;
  number: number;
  title: string;
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
  return heading?.replace(/^Capitulo\s+\d+:\s*/i, "") ?? fallback;
}

export const chapters: Chapter[] = Object.entries(modules)
  .map(([path, content]) => {
    const parts = path.split("/");
    const filename = parts[parts.length - 1] ?? path;
    const folder = parts[parts.length - 2] ?? "";
    const number = chapterNumber(folder) || chapterNumber(filename);

    return {
      id: folder || filename.replace(/\.md$/, ""),
      number,
      title: chapterTitle(String(content), filename),
      filename,
      content: String(content),
      folder,
    };
  })
  .sort((a, b) => a.number - b.number);
