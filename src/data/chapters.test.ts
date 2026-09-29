import { describe, expect, it } from "vitest";
import {
  findChapterById,
  findSectionById,
  getChapters,
} from "./chapters";

describe("chapter content parsing", () => {
  it("builds numbered chapter lists from both locale paths", () => {
    const expectedNumbers = Array.from({ length: 14 }, (_, index) => index + 1);

    expect(getChapters("es").map(({ number }) => number)).toEqual(expectedNumbers);
    expect(getChapters("en").map(({ number }) => number)).toEqual(expectedNumbers);
  });

  it("derives chapter headings, section order, and cross-locale aliases", () => {
    const chapter = findChapterById("es", "finite-fields");

    expect(chapter?.title).toBe("Campos Finitos");
    expect(chapter?.sections[0].id).toBe("mapa-del-capitulo");
    expect(
      chapter?.sections[chapter.sections.length - 1]?.id,
    ).toBe("cierre");
    expect(
      chapter && findSectionById(chapter, "finite-field-definition")?.id,
    ).toBe("definicion-y-propiedades-de-un-campo-finito");
  });

  it("finds chapters by legacy aliases and rejects unknown ids", () => {
    expect(findChapterById("es", "capitulo-01-campos-finitos")?.number).toBe(1);
    expect(findChapterById("en", "not-a-chapter")).toBeUndefined();
  });
});
