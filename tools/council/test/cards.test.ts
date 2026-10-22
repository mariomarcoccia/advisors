import { describe, expect, it } from "vitest";
import { buildCards, leadTitle } from "../src/cards.ts";
import { parseDossier } from "../src/parse.ts";
import { DOSSIER } from "./helpers.ts";

const cards = buildCards(parseDossier(DOSSIER));

describe("buildCards", () => {
  it("keeps summary, bio and voice whole", () => {
    expect(cards.filter((c) => c.kind === "summary")).toHaveLength(1);
    expect(cards.filter((c) => c.kind === "voice")).toHaveLength(1);
  });

  it("skips short preambles but keeps long paragraphs", () => {
    const ideas = cards.filter((c) => c.kind === "core_idea");
    expect(ideas.map((c) => c.title)).toEqual(["Charge more early", "Focus beats breadth", undefined]);
    expect(ideas.some((c) => c.text.startsWith("Each idea"))).toBe(false);
  });

  it("prefixes h3 headings and extracts quotes", () => {
    const model = cards.find((c) => c.kind === "mental_model");
    expect(model?.text.startsWith("[A Book (2020)]")).toBe(true);
    expect(model?.quotes).toEqual(["Do you make it to profitability on the money you have left?"]);
  });

  it("produces unique, stable ids", () => {
    const ids = cards.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(buildCards(parseDossier(DOSSIER)).map((c) => c.id)).toEqual(ids);
    expect(ids.every((id) => /^test-person\/[a-z]+-[0-9a-f]{6}(-\d+)?$/.test(id))).toBe(true);
  });

  it("disambiguates identical text with a suffix", () => {
    const dup = DOSSIER.replace("- Ask what you would cut first.", "- Same.\n- Same.");
    const heuristics = buildCards(parseDossier(dup)).filter((c) => c.kind === "heuristic");
    expect(heuristics[1]?.id).toBe(`${heuristics[0]?.id}-2`);
  });
});

describe("leadTitle", () => {
  it("reads the bold lead without trailing punctuation", () => {
    expect(leadTitle("**Pricing.** body")).toBe("Pricing");
    expect(leadTitle("no title")).toBeUndefined();
  });
});
