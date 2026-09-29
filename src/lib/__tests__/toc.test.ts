import { describe, expect, it } from "vitest";
import { parseToc, slugify } from "../toc";

describe("slugify", () => {
  it("normalizes accents, punctuation, and repeated separators", () => {
    expect(slugify("¿Por qué empezar?  Campos Finitos — $F_p$"))
      .toBe("por-que-empezar-campos-finitos-fp");
  });

  it("returns an empty slug when the text has no letters or digits", () => {
    expect(slugify("¿?! — ")).toBe("");
  });
});

describe("parseToc", () => {
  it("collects second and third level headings in document order", () => {
    expect(parseToc("# Ignored\n## Campos Finitos\n### ¿Por qué?\n#### Ignored"))
      .toEqual([
        { id: "campos-finitos", text: "Campos Finitos", level: 2 },
        { id: "por-que", text: "¿Por qué?", level: 3 },
      ]);
  });
});
