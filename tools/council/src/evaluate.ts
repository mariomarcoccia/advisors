import { z } from "zod";

// Graded relevance labels for one (decision, advisor) pool: 2 = would change the
// advice, 1 = useful background, 0 = irrelevant. Unlabeled cards count as 0.
export const LabelSetSchema = z.object({
  decision: z.string(),
  advisor: z.string(),
  labels: z.record(z.string(), z.union([z.literal(0), z.literal(1), z.literal(2)])),
});
export type LabelSet = z.infer<typeof LabelSetSchema>;

export interface Metrics {
  ndcg10: number;
  recall20: number;
  precision10: number;
}

export function dcg(gains: number[]): number {
  return gains.reduce((sum, gain, i) => sum + (2 ** gain - 1) / Math.log2(i + 2), 0);
}

export function metricsFor(ranking: string[], labels: Record<string, number>): Metrics {
  const gain = (id: string): number => labels[id] ?? 0;
  const ideal = Object.values(labels).sort((a, b) => b - a);
  const idealDcg = dcg(ideal.slice(0, 10));
  const relevant = Object.keys(labels).filter((id) => gain(id) >= 1);
  const top20 = new Set(ranking.slice(0, 20));
  return {
    ndcg10: idealDcg > 0 ? dcg(ranking.slice(0, 10).map(gain)) / idealDcg : 0,
    recall20: relevant.length > 0 ? relevant.filter((id) => top20.has(id)).length / relevant.length : 0,
    precision10: ranking.slice(0, 10).filter((id) => gain(id) >= 1).length / 10,
  };
}

export function meanMetrics(all: Metrics[]): Metrics {
  const mean = (pick: (m: Metrics) => number): number =>
    all.length ? all.reduce((sum, m) => sum + pick(m), 0) / all.length : 0;
  return { ndcg10: mean((m) => m.ndcg10), recall20: mean((m) => m.recall20), precision10: mean((m) => m.precision10) };
}

// TREC-style pooling: the union of each strategy's top-k is what gets labeled,
// so no strategy is judged on cards nobody looked at.
export function pool(rankings: string[][], depth: number): string[] {
  return [...new Set(rankings.flatMap((ranking) => ranking.slice(0, depth)))];
}
