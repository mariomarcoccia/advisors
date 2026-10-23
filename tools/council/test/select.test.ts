import { describe, expect, it } from "vitest";
import { Bm25Scorer } from "../src/retrieve.ts";
import type { AdvisorEntry, GraphEdge } from "../src/schemas.ts";
import { composeBoard, dissenters, scoreAdvisors, type AdvisorScore } from "../src/select.ts";

const s = (slug: string, relevance: number, tensions: Record<string, number> = {}): AdvisorScore => ({ slug, name: slug.toUpperCase(), relevance, tensions });
const edge = (from: string, to: string, n = 0): GraphEdge => ({ from, to, external: false, label: `${from} vs ${to}`, cardId: `${from}/dis-00000${n}` });

describe("composeBoard", () => {
  it("prefers a candidate that covers an uncovered tension over a slightly more relevant clone", () => {
    const scores = [s("a", 0.9, { speed: 0.9 }), s("b", 0.85, { speed: 0.9 }), s("c", 0.7, { cash: 0.9 })];
    const board = composeBoard(scores, [], { k: 2, tensions: ["speed", "cash"] });
    expect(board.map((p) => p.slug)).toEqual(["a", "c"]);
    expect(board[1]?.reason).toContain("holds down: cash");
  });

  it("uses documented clashes as a tiebreaker", () => {
    const scores = [s("a", 0.9), s("b", 0.8), s("c", 0.8)];
    const board = composeBoard(scores, [edge("c", "a")], { k: 2, tensions: [] });
    expect(board.map((p) => p.slug)).toEqual(["a", "c"]);
  });

  it("honors exclusions and k", () => {
    const board = composeBoard([s("a", 0.9), s("b", 0.8)], [], { k: 5, tensions: [], exclude: ["a"] });
    expect(board.map((p) => p.slug)).toEqual(["b"]);
  });
});

describe("dissenters", () => {
  it("collects both directions, strongest first, skipping external edges", () => {
    const edges = [edge("a", "b", 1), edge("c", "a", 2), edge("a", "c", 3), { ...edge("a", "external", 4), external: true }];
    expect(dissenters("a", edges).map((d) => [d.slug, d.cardIds.length])).toEqual([["c", 2], ["b", 1]]);
  });
});

describe("scoreAdvisors", () => {
  it("scores relevance and each tension, sorted by relevance", async () => {
    const advisors: AdvisorEntry[] = [
      { slug: "p", name: "P", role: "pricing expert", domains: ["pricing"], summary: "raise prices", sourceCount: 1, lastUpdated: "x", dossierTokens: 1, cardCount: 1 },
      { slug: "h", name: "H", role: "hiring expert", domains: ["hiring"], summary: "hire slowly", sourceCount: 1, lastUpdated: "x", dossierTokens: 1, cardCount: 1 },
    ];
    const scores = await scoreAdvisors("should we raise prices", advisors, new Bm25Scorer(), ["hiring pace"]);
    expect(scores[0]?.slug).toBe("p");
    expect(scores.find((x) => x.slug === "h")?.tensions["hiring pace"]).toBe(1);
  });
});
