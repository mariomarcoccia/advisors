import { ADVISOR_RELEVANCE, tensionSpec, type Item, type Scorer } from "./retrieve.ts";
import type { AdvisorEntry, GraphEdge } from "./schemas.ts";

export interface AdvisorScore {
  slug: string;
  name: string;
  relevance: number;
  tensions: Record<string, number>;
}

export interface BoardPick extends AdvisorScore {
  reason: string;
}

export interface SelectOptions {
  k: number;
  tensions: string[];
  exclude?: string[];
}

export function advisorItems(advisors: AdvisorEntry[]): Item[] {
  return advisors.map((advisor) => ({
    id: advisor.slug,
    material: `${advisor.name}. ${advisor.role}. Domains: ${advisor.domains.join(", ")}. ${advisor.summary}`,
  }));
}

export async function scoreAdvisors(
  decision: string,
  advisors: AdvisorEntry[],
  scorer: Scorer,
  tensions: string[],
): Promise<AdvisorScore[]> {
  const items = advisorItems(advisors);
  const relevance = await scorer.score(decision, items, ADVISOR_RELEVANCE);
  const perTension = await Promise.all(tensions.map((t) => scorer.score(decision, items, tensionSpec(t))));
  return advisors
    .map((advisor) => ({
      slug: advisor.slug,
      name: advisor.name,
      relevance: relevance.get(advisor.slug) ?? 0,
      tensions: Object.fromEntries(tensions.map((t, i) => [t, perTension[i]?.get(advisor.slug) ?? 0])),
    }))
    .sort((a, b) => b.relevance - a.relevance);
}

// Greedy board: each seat maximizes relevance plus the tension coverage it adds
// plus documented disagreement with members already seated. The point of a
// board is productive clash, so a relevant clone of a seated member loses to a
// slightly less relevant dissenter.
export function composeBoard(scores: AdvisorScore[], edges: GraphEdge[], options: SelectOptions): BoardPick[] {
  const pool = scores.filter((s) => !(options.exclude ?? []).includes(s.slug));
  const board: BoardPick[] = [];
  while (board.length < options.k && pool.length > 0) {
    const ranked = pool
      .map((candidate) => ({ candidate, gain: seatGain(candidate, board, edges, options.tensions) }))
      .sort((a, b) => b.gain.total - a.gain.total);
    const best = ranked[0];
    if (!best) break;
    board.push({ ...best.candidate, reason: best.gain.reason });
    pool.splice(pool.indexOf(best.candidate), 1);
  }
  return board;
}

interface Gain {
  total: number;
  reason: string;
}

const STRONG = 0.6;
// Coverage outweighs clash: an uncovered tension is a hole in the debate, while a
// documented clash is a tiebreaker between similarly relevant candidates.
const TENSION_WEIGHT = 0.4;
const CLASH_WEIGHT = 0.1;

function seatGain(candidate: AdvisorScore, board: AdvisorScore[], edges: GraphEdge[], tensions: string[]): Gain {
  const uncovered = tensions.filter((t) => !board.some((member) => (member.tensions[t] ?? 0) >= STRONG));
  const covers = uncovered.filter((t) => (candidate.tensions[t] ?? 0) >= STRONG);
  const clashes = board.filter((member) => disagree(candidate.slug, member.slug, edges));
  const total = candidate.relevance + TENSION_WEIGHT * covers.length + CLASH_WEIGHT * Math.min(clashes.length, 2);
  const parts = [`relevance ${candidate.relevance.toFixed(2)}`];
  if (covers.length) parts.push(`holds down: ${covers.join("; ")}`);
  if (clashes.length) parts.push(`documented clash with ${clashes.map((m) => m.name).join(", ")}`);
  return { total, reason: parts.join(" | ") };
}

export function disagree(a: string, b: string, edges: GraphEdge[]): boolean {
  return edges.some((e) => !e.external && ((e.from === a && e.to === b) || (e.from === b && e.to === a)));
}

// For /second-opinion: council members with a documented disagreement with
// `slug`, strongest evidence first (more cards = more documented clash).
export function dissenters(slug: string, edges: GraphEdge[]): { slug: string; cardIds: string[]; labels: string[] }[] {
  const bySlug = new Map<string, { cardIds: string[]; labels: string[] }>();
  for (const edge of edges.filter((e) => !e.external && (e.from === slug || e.to === slug))) {
    const other = edge.from === slug ? edge.to : edge.from;
    const entry = bySlug.get(other) ?? { cardIds: [], labels: [] };
    entry.cardIds.push(edge.cardId);
    entry.labels.push(edge.label);
    bySlug.set(other, entry);
  }
  return [...bySlug]
    .map(([other, entry]) => ({ slug: other, ...entry }))
    .sort((a, b) => b.cardIds.length - a.cardIds.length);
}
