import { describe, expect, it } from "vitest";
import { buildPack, DEFAULT_PACK, renderPack, selectWithinBudget } from "../src/pack.ts";
import { Bm25Scorer } from "../src/retrieve.ts";
import type { AdvisorEntry } from "../src/schemas.ts";
import { card } from "./helpers.ts";

const advisor: AdvisorEntry = {
  slug: "a", name: "A Person", role: "Founder", domains: ["x"], summary: "s",
  sourceCount: 3, lastUpdated: "2026-01-01", dossierTokens: 1000, cardCount: 6,
};

const cards = [
  card("a", "summary", "Summary of A", 1),
  card("a", "voice", "Talks plainly", 2),
  card("a", "provenance", "pricing pricing pricing", 3),
  card("a", "position", "On pricing: raise prices early", 4),
  card("a", "heuristic", "Hire slowly", 5),
  card("a", "blind_spot", "Ignores churn", 6),
  card("b", "position", "pricing from someone else", 7),
];

describe("buildPack", () => {
  it("always includes summary and voice, never provenance or other advisors", async () => {
    const pack = await buildPack(advisor, cards, "raise pricing", new Bm25Scorer());
    expect(pack.alwaysOn.map((c) => c.kind)).toEqual(["summary", "voice"]);
    const kinds = pack.retrieved.map((e) => e.card.kind);
    expect(kinds).not.toContain("provenance");
    expect(pack.retrieved.every((e) => e.card.advisor === "a")).toBe(true);
    expect(pack.retrieved[0]?.card.kind).toBe("position");
    expect(renderPack(pack)).toContain(`[${cards[3]?.id}]`);
  });
});

describe("selectWithinBudget", () => {
  const big = (kind: "quote" | "position" | "blind_spot", n: number, score: number) => ({ card: { ...card("a", kind, "x".repeat(400), n) }, score });

  it("respects the token budget", () => {
    const ranked = [big("position", 1, 0.9), big("position", 2, 0.8), big("position", 3, 0.7)];
    expect(selectWithinBudget(ranked, 250, { ...DEFAULT_PACK, minBlindSpots: 0, minDisagreements: 0 })).toHaveLength(2);
  });

  it("forces the best blind spot in even when it ranks last", () => {
    const ranked = [big("position", 1, 0.9), big("position", 2, 0.8), big("blind_spot", 3, 0.1)];
    const chosen = selectWithinBudget(ranked, 250, { ...DEFAULT_PACK, minBlindSpots: 1 });
    expect(chosen.map((e) => e.card.kind)).toContain("blind_spot");
  });

  it("caps a kind at its share of the budget", () => {
    const ranked = [big("quote", 1, 0.99), big("quote", 2, 0.98), big("position", 3, 0.5)];
    const chosen = selectWithinBudget(ranked, 400, { ...DEFAULT_PACK, minBlindSpots: 0, kindShare: { quote: 0.2 } });
    expect(chosen.map((e) => e.card.kind)).toEqual(["position"]);
  });
});

describe("selectWithinBudget: review regressions", () => {
  const entry = (kind: "position" | "blind_spot", n: number, score: number, size = 400) => ({ card: card("a", kind, "x".repeat(size), n), score });

  it("never lets floors exceed the budget", () => {
    const chosen = selectWithinBudget([entry("blind_spot", 1, 0.9, 4000)], 500, DEFAULT_PACK);
    expect(chosen).toEqual([]);
  });

  it("stops filling below minScore instead of padding with irrelevant cards", () => {
    const ranked = [entry("position", 1, 0.9), entry("position", 2, 0.01), entry("position", 3, 0)];
    const chosen = selectWithinBudget(ranked, 10_000, { ...DEFAULT_PACK, minBlindSpots: 0, minDisagreements: 0 });
    expect(chosen.map((e) => e.score)).toEqual([0.9]);
  });
});
