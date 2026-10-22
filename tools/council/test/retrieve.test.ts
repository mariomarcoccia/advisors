import { describe, expect, it } from "vitest";
import { Bm25Scorer, CARD_RELEVANCE, chunkByTokens, JevFanoutScorer, JevPairScorer } from "../src/retrieve.ts";
import { FakeJev } from "./helpers.ts";

const items = [
  { id: "a", material: "raise prices for small retailers" },
  { id: "b", material: "hiring engineers in Berlin" },
  { id: "c", material: "pricing power and churn of retailers" },
];
const decision = "Should we raise prices for retailers and risk churn?";

describe("chunkByTokens", () => {
  it("packs items under the budget and never drops one", () => {
    const many = Array.from({ length: 10 }, (_, i) => ({ id: String(i), material: "x".repeat(400) }));
    const chunks = chunkByTokens(many, 400);
    expect(chunks.flat()).toHaveLength(10);
    expect(chunks.length).toBeGreaterThan(1);
  });
});

describe("scorers", () => {
  it("BM25 normalizes to 0..1 and ranks lexical matches first", async () => {
    const scores = await new Bm25Scorer().score(decision, items, CARD_RELEVANCE);
    expect(Math.max(...scores.values())).toBe(1);
    expect(scores.get("b")).toBe(0);
  });

  it("fan-out sends one request per chunk with one question per item", async () => {
    const fake = new FakeJev();
    const scores = await new JevFanoutScorer(fake, 40_000).score(decision, items, CARD_RELEVANCE);
    expect(fake.calls).toHaveLength(1);
    expect(Object.keys(fake.calls[0]?.questions ?? {})).toHaveLength(3);
    expect(scores.get("a")).toBeGreaterThan(scores.get("b") ?? 1);
  });

  it("fan-out splits into several requests when over budget", async () => {
    const fake = new FakeJev();
    await new JevFanoutScorer(fake, 120).score(decision, items, CARD_RELEVANCE);
    expect(fake.calls.length).toBeGreaterThan(1);
  });

  it("pair scorer sends one request per item with material in the state", async () => {
    const fake = new FakeJev();
    const scores = await new JevPairScorer(fake).score(decision, items, CARD_RELEVANCE);
    expect(fake.calls).toHaveLength(3);
    expect(scores.get("c")).toBeGreaterThan(scores.get("b") ?? 1);
  });
});
