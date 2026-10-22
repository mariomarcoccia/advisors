import { Bm25 } from "./bm25.ts";
import { JEV_MAX_QUESTIONS_PER_REQUEST, JEV_REQUEST_TOKEN_BUDGET } from "./config.ts";
import { JevApiError, mapLimit, nouls, type JevQuestion, type JevTransport } from "./jev.ts";

export interface Item {
  id: string;
  material: string;
}

export interface NoulSpec {
  task: string;
  // Lexical query for the BM25 fallback; defaults to the decision itself.
  query?: string;
  criteria: { true: string; false: string };
}

export interface Scorer {
  readonly name: string;
  score(decision: string, items: Item[], spec: NoulSpec): Promise<Map<string, number>>;
}

export const CARD_RELEVANCE: NoulSpec = {
  task: "Would this advisor material change or sharpen the advice for the decision in `decision`?",
  criteria: {
    true: "The material states a position, heuristic, worked example, or blind spot that bears directly on the choice in `decision`: its options, tradeoffs, constraints, timing, or the current leaning.",
    false: "The material is about a different topic, or only shares a keyword with `decision` without bearing on the choice.",
  },
};

export const ADVISOR_RELEVANCE: NoulSpec = {
  task: "Does this advisor's documented work bear directly on the decision in `decision`?",
  criteria: {
    true: "The profile shows first-hand experience or documented positions on the kind of choice in `decision` (its domain, stage, or core tradeoff).",
    false: "The profile's expertise is in a different domain or would only offer generic advice on this choice.",
  },
};

export function tensionSpec(tension: string): NoulSpec {
  return {
    query: tension,
    task: `Does this advisor hold a strong, documented stance on this tension: "${tension}"?`,
    criteria: {
      true: `The profile shows a clear, sourced position on "${tension}", leaning toward one side.`,
      false: `The profile is silent or neutral on "${tension}".`,
    },
  };
}

export class Bm25Scorer implements Scorer {
  readonly name = "bm25";

  score(decision: string, items: Item[], spec: NoulSpec): Promise<Map<string, number>> {
    const query = spec.query ?? decision;
    const raw = new Bm25(items.map((item) => ({ id: item.id, text: item.material }))).score(query);
    const max = Math.max(...raw.values(), Number.EPSILON);
    return Promise.resolve(new Map([...raw].map(([id, value]) => [id, value / max])));
  }
}

// One request carries many questions over a shared state; Jev answers them
// independently, so cost and latency barely grow with the number of items.
export class JevFanoutScorer implements Scorer {
  readonly name = "jev-fanout";

  private readonly jev: JevTransport;
  private readonly budget: number;
  private readonly concurrency: number;

  constructor(jev: JevTransport, budget = JEV_REQUEST_TOKEN_BUDGET, concurrency = 6) {
    this.jev = jev;
    this.budget = budget;
    this.concurrency = concurrency;
  }

  async score(decision: string, items: Item[], spec: NoulSpec): Promise<Map<string, number>> {
    const room = this.budget - conservativeTokens(JSON.stringify({ decision }));
    if (room < this.budget / 2) throw new JevApiError(400, "decision text is too long for Jev requests; shorten decision.en.md");
    const chunks = chunkQuestions(items, spec, room);
    const parts = await mapLimit(chunks, this.concurrency, async (chunk) => {
      const questions: Record<string, JevQuestion> = {};
      chunk.forEach((item, i) => {
        questions[`q${i}`] = noulQuestion(spec, item.material);
      });
      const answers = nouls(await this.jev.systemOne({ state: { decision }, questions }));
      return chunk.map((item, i): [string, number] => [item.id, requireAnswer(answers, `q${i}`)]);
    });
    return new Map(parts.flat());
  }
}

// One request per item with the material inside the state, as in TypeSafe's
// re-ranking cookbook. Slower and pricier than fan-out; kept for evaluation.
export class JevPairScorer implements Scorer {
  readonly name = "jev-pair";

  private readonly jev: JevTransport;
  private readonly concurrency: number;

  constructor(jev: JevTransport, concurrency = 8) {
    this.jev = jev;
    this.concurrency = concurrency;
  }

  async score(decision: string, items: Item[], spec: NoulSpec): Promise<Map<string, number>> {
    const scored = await mapLimit(items, this.concurrency, async (item): Promise<[string, number]> => {
      const question: JevQuestion = { type: "noul", instructions: spec.task, criteria: spec.criteria };
      const answers = nouls(
        await this.jev.systemOne({ state: { decision, material: item.material }, questions: { q: question } }),
      );
      return [item.id, requireAnswer(answers, "q")];
    });
    return new Map(scored);
  }
}

function noulQuestion(spec: NoulSpec, material: string): JevQuestion {
  return { type: "noul", instructions: { task: spec.task, material }, criteria: spec.criteria };
}

export function requireAnswer(answers: Map<string, number>, id: string): number {
  const value = answers.get(id);
  if (value === undefined) throw new JevApiError(200, `no noul answer for question ${id}`);
  return value;
}

// chars / 3 overestimates tokens for English and JSON, which is the safe side.
export function conservativeTokens(text: string): number {
  return Math.ceil(text.length / 3);
}

// Packs items into requests by the real size of each question (material, task,
// and criteria as sent), capped by count. An item too large for any request is a
// dossier problem worth surfacing, not something to send and fail on.
export function chunkQuestions(items: Item[], spec: NoulSpec, budget: number): Item[][] {
  const chunks: Item[][] = [];
  let current: Item[] = [];
  let used = 0;
  for (const item of items) {
    const cost = conservativeTokens(JSON.stringify(noulQuestion(spec, item.material))) + 10;
    if (cost > budget) throw new JevApiError(400, `item ${item.id} is too large for one Jev request (~${cost} tokens)`);
    if (current.length > 0 && (used + cost > budget || current.length >= JEV_MAX_QUESTIONS_PER_REQUEST)) {
      chunks.push(current);
      current = [];
      used = 0;
    }
    current.push(item);
    used += cost;
  }
  if (current.length > 0) chunks.push(current);
  return chunks;
}
