import { describe, expect, it } from "vitest";
import { dcg, meanMetrics, metricsFor, pool } from "../src/evaluate.ts";

describe("metrics", () => {
  it("scores a perfect ranking as nDCG 1", () => {
    const labels = { a: 2, b: 1, c: 0 } as Record<string, number>;
    expect(metricsFor(["a", "b", "c"], labels).ndcg10).toBeCloseTo(1);
    expect(metricsFor(["c", "b", "a"], labels).ndcg10).toBeLessThan(1);
  });

  it("computes recall@20 and P@10 over relevant (>=1) items", () => {
    const m = metricsFor(["a", "x"], { a: 2, b: 1 });
    expect(m.recall20).toBe(0.5);
    expect(m.precision10).toBeCloseTo(0.1);
  });

  it("averages and pools", () => {
    expect(meanMetrics([{ ndcg10: 1, recall20: 0, precision10: 0.5 }, { ndcg10: 0, recall20: 1, precision10: 0.5 }])).toEqual({ ndcg10: 0.5, recall20: 0.5, precision10: 0.5 });
    expect(pool([["a", "b", "c"], ["c", "d"]], 2)).toEqual(["a", "b", "c", "d"]);
    expect(dcg([])).toBe(0);
  });
});
