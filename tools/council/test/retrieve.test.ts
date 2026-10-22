import { describe, expect, it } from "vitest";
import { Bm25Scorer, CARD_RELEVANCE, chunkQuestions, JevFanoutScorer, JevPairScorer } from "../src/retrieve.ts";
import { JevApiError } from "../src/jev.ts";
import { FakeJev } from "./helpers.ts";

const items = [
  { id: "a", material: "raise prices for small retailers" },
  { id: "b", material: "hiring engineers in Berlin" },
  { id: "c", material: "pricing power and churn of retailers" },
];
const decision = "Should we raise prices for retailers and risk churn?";

describe("chunkQuestions", () => {
  it("charges the full question (criteria included) and never drops an item", () => {
    const many = Array.from({ length: 10 }, (_, i) => ({ id: String(i), material: "x".repeat(300) }));
    const chunks = chunkQuestions(many, CARD_RELEVANCE, 600);
    expect(chunks.flat()).toHaveLength(10);
    expect(chunks.every((c) => c.length <= 2)).toBe(true);
  });

  it("caps questions per request", () => {
    const tiny = Array.from({ length: 300 }, (_, i) => ({ id: String(i), material: "x" }));
    expect(chunkQuestions(tiny, CARD_RELEVANCE, 10_000_000).map((c) => c.length)).toEqual([120, 120, 60]);
  });

  it("refuses an item larger than a whole request", () => {
    expect(() => chunkQuestions([{ id: "big", material: "x".repeat(10_000) }], CARD_RELEVANCE, 500)).toThrow(JevApiError);
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
    const scores = await new JevFanoutScorer(fake, 28_000).score(decision, items, CARD_RELEVANCE);
    expect(fake.calls).toHaveLength(1);
    expect(Object.keys(fake.calls[0]?.questions ?? {})).toHaveLength(3);
    expect(scores.get("a")).toBeGreaterThan(scores.get("b") ?? 1);
  });

  it("fan-out splits into several requests when over budget", async () => {
    const fake = new FakeJev();
    await new JevFanoutScorer(fake, 400).score(decision, items, CARD_RELEVANCE);
    expect(fake.calls.length).toBeGreaterThan(1);
  });

  it("pair scorer sends one request per item with material in the state", async () => {
    const fake = new FakeJev();
    const scores = await new JevPairScorer(fake).score(decision, items, CARD_RELEVANCE);
    expect(fake.calls).toHaveLength(3);
    expect(scores.get("c")).toBeGreaterThan(scores.get("b") ?? 1);
  });
});

describe("missing answers", () => {
  it("throws instead of scoring a missing answer as 0", async () => {
    const empty = { systemOne: async () => ({ model: "m", answers: {}, usage: { input_tokens: 1, output_tokens: 1 } }) };
    await expect(new JevFanoutScorer(empty).score(decision, items, CARD_RELEVANCE)).rejects.toThrow(/no noul answer/);
  });

  it("refuses a decision too long to leave room for questions", async () => {
    await expect(new JevFanoutScorer(new FakeJev(), 1000).score("x".repeat(3000), items, CARD_RELEVANCE)).rejects.toThrow(/too long/);
  });
});
