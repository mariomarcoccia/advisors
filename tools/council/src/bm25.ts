import { tokenize } from "./text.ts";

export interface Bm25Doc {
  id: string;
  text: string;
}

const K1 = 1.2;
const B = 0.75;

// Plain Okapi BM25. It is the offline fallback when Jev is unavailable and the
// baseline every Jev strategy is evaluated against.
export class Bm25 {
  private readonly docs: { id: string; tf: Map<string, number>; length: number }[];
  private readonly df = new Map<string, number>();
  private readonly avgLength: number;

  constructor(docs: Bm25Doc[]) {
    this.docs = docs.map((doc) => {
      const tokens = tokenize(doc.text);
      const tf = new Map<string, number>();
      for (const token of tokens) tf.set(token, (tf.get(token) ?? 0) + 1);
      for (const token of tf.keys()) this.df.set(token, (this.df.get(token) ?? 0) + 1);
      return { id: doc.id, tf, length: tokens.length };
    });
    const total = this.docs.reduce((sum, doc) => sum + doc.length, 0);
    this.avgLength = this.docs.length ? total / this.docs.length : 1;
  }

  score(query: string): Map<string, number> {
    const terms = [...new Set(tokenize(query))];
    const scores = new Map<string, number>();
    for (const doc of this.docs) {
      scores.set(doc.id, terms.reduce((sum, term) => sum + this.termScore(term, doc), 0));
    }
    return scores;
  }

  private termScore(term: string, doc: { tf: Map<string, number>; length: number }): number {
    const freq = doc.tf.get(term) ?? 0;
    if (freq === 0) return 0;
    const n = this.docs.length;
    const df = this.df.get(term) ?? 0;
    const idf = Math.log(1 + (n - df + 0.5) / (df + 0.5));
    return (idf * freq * (K1 + 1)) / (freq + K1 * (1 - B + (B * doc.length) / this.avgLength));
  }
}
