import { describe, expect, it } from "vitest";
import { DossierFormatError, parseBlocks, parseDossier } from "../src/parse.ts";
import { DOSSIER } from "./helpers.ts";

describe("parseDossier", () => {
  it("parses frontmatter and all sections", () => {
    const parsed = parseDossier(DOSSIER);
    expect(parsed.frontmatter.slug).toBe("test-person");
    expect(parsed.frontmatter.last_updated).toBe("2026-01-02");
    expect(parsed.sections.map((s) => s.name)).toContain("Where they disagree");
  });

  it("rejects missing frontmatter", () => {
    expect(() => parseDossier("## Summary\nx")).toThrow(DossierFormatError);
  });

  it("turns invalid YAML into a DossierFormatError", () => {
    const broken = DOSSIER.replace("role: Founder, Example Co", "role: CEO (B3: ABCD3)");
    expect(() => parseDossier(broken)).toThrow(/not valid YAML/);
  });

  it("rejects frontmatter that fails the schema", () => {
    expect(() => parseDossier(DOSSIER.replace("slug: test-person", "slug: Not A Slug"))).toThrow(/invalid frontmatter/);
  });
});

describe("parseBlocks", () => {
  it("folds nested bullets and wrapped lines into the parent bullet", () => {
    const blocks = parseBlocks(["- parent", "  - child", "wrapped", "- next"]);
    expect(blocks).toEqual([
      { type: "bullet", text: "parent\n- child\nwrapped" },
      { type: "bullet", text: "next" },
    ]);
  });

  it("starts a new paragraph after a blank line", () => {
    const blocks = parseBlocks(["- bullet", "", "a paragraph", "continues"]);
    expect(blocks.map((b) => [b.type, b.text])).toEqual([
      ["bullet", "bullet"],
      ["para", "a paragraph\ncontinues"],
    ]);
  });

  it("skips table header and rule, keeps rows", () => {
    const blocks = parseBlocks(["| Q | A |", "|---|---|", "| why | because |"]);
    expect(blocks).toEqual([{ type: "row", text: "why | because" }]);
  });

  it("attaches h3 headings to following blocks", () => {
    const blocks = parseBlocks(["### Book (2020)", "- idea"]);
    expect(blocks[0]?.heading).toBe("Book (2020)");
  });
});

describe("parseBlocks: review regressions", () => {
  it("keeps a wrapped line that starts with a year inside its bullet", () => {
    const blocks = parseBlocks(["- **Exit.** He sold the company in", "2019. The buyer kept the team."]);
    expect(blocks).toHaveLength(1);
    expect(blocks[0]?.text).toContain("2019. The buyer");
  });

  it("still splits real numbered lists", () => {
    const blocks = parseBlocks(["1. first", "2. second", "", "3. third"]);
    expect(blocks.map((b) => b.text)).toEqual(["first", "second", "third"]);
  });

  it("strips blockquote markers so wrapped quotes stay matchable", () => {
    const blocks = parseBlocks(["> \"A quote that wraps", "> onto a second line\""]);
    expect(blocks[0]?.text).toBe('"A quote that wraps\nonto a second line"');
  });
});
