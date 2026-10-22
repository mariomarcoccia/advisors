import { CARD_RELEVANCE, type Scorer } from "./retrieve.ts";
import type { AdvisorEntry, Card, CardKind } from "./schemas.ts";

export interface PackOptions {
  budget: number;
  minBlindSpots: number;
  minDisagreements: number;
  // Cap per kind as a share of the retrieved budget, so 40 signature quotes
  // cannot crowd out every worked example.
  kindShare: Partial<Record<CardKind, number>>;
  // Cards scoring below this are never packed, even with budget left: an
  // irrelevant card costs the reader attention and dilutes the voice.
  minScore: number;
}

export const DEFAULT_PACK: PackOptions = {
  budget: 6_000,
  minBlindSpots: 2,
  minDisagreements: 1,
  kindShare: { quote: 0.3, blind_spot: 0.2, disagreement: 0.2 },
  minScore: 0.05,
};

export interface ScoredCard {
  card: Card;
  score: number;
}

export interface Pack {
  advisor: AdvisorEntry;
  scorer: string;
  alwaysOn: Card[];
  retrieved: ScoredCard[];
  tokens: number;
}

const ALWAYS_ON = new Set<CardKind>(["summary", "bio", "voice"]);
const NEVER_RETRIEVED = new Set<CardKind>(["provenance", ...ALWAYS_ON]);

export async function buildPack(
  advisor: AdvisorEntry,
  cards: Card[],
  decision: string,
  scorer: Scorer,
  options: PackOptions = DEFAULT_PACK,
): Promise<Pack> {
  const own = cards.filter((card) => card.advisor === advisor.slug);
  const alwaysOn = own.filter((card) => ALWAYS_ON.has(card.kind));
  const candidates = own.filter((card) => !NEVER_RETRIEVED.has(card.kind));
  const items = candidates.map((card) => ({ id: card.id, material: card.text }));
  const scores = await scorer.score(decision, items, CARD_RELEVANCE);
  const ranked = candidates
    .map((card) => ({ card, score: scores.get(card.id) ?? 0 }))
    .sort((a, b) => b.score - a.score);
  const fixedTokens = sumTokens(alwaysOn);
  const retrieved = selectWithinBudget(ranked, Math.max(0, options.budget - fixedTokens), options);
  return { advisor, scorer: scorer.name, alwaysOn, retrieved, tokens: fixedTokens + sumScored(retrieved) };
}

// Honesty floor first (the best-ranked blind spots and disagreements go in even
// below minScore, but never past the budget), then fill by relevance under
// per-kind caps, stopping at minScore.
export function selectWithinBudget(ranked: ScoredCard[], budget: number, options: PackOptions): ScoredCard[] {
  const chosen: ScoredCard[] = [];
  const used = new Map<CardKind, number>();
  const take = (entry: ScoredCard): void => {
    chosen.push(entry);
    used.set(entry.card.kind, (used.get(entry.card.kind) ?? 0) + entry.card.tokens);
  };
  const floors: [CardKind, number][] = [
    ["blind_spot", options.minBlindSpots],
    ["disagreement", options.minDisagreements],
  ];
  for (const [kind, count] of floors) {
    ranked.filter((e) => e.card.kind === kind && withinBudget(e, chosen, budget)).slice(0, count).forEach(take);
  }
  for (const entry of ranked) {
    if (entry.score < options.minScore) break;
    if (!chosen.includes(entry) && fits(entry, chosen, used, budget, options)) take(entry);
  }
  return chosen.sort((a, b) => b.score - a.score);
}

function withinBudget(entry: ScoredCard, chosen: ScoredCard[], budget: number): boolean {
  return sumScored(chosen) + entry.card.tokens <= budget;
}

function fits(
  entry: ScoredCard,
  chosen: ScoredCard[],
  used: Map<CardKind, number>,
  budget: number,
  options: PackOptions,
): boolean {
  if (!withinBudget(entry, chosen, budget)) return false;
  const share = options.kindShare[entry.card.kind];
  return share === undefined || (used.get(entry.card.kind) ?? 0) + entry.card.tokens <= share * budget;
}

function sumTokens(cards: Card[]): number {
  return cards.reduce((sum, card) => sum + card.tokens, 0);
}

function sumScored(entries: ScoredCard[]): number {
  return entries.reduce((sum, entry) => sum + entry.card.tokens, 0);
}

export function renderPack(pack: Pack): string {
  const a = pack.advisor;
  const coverage = ((pack.tokens / Math.max(a.dossierTokens, 1)) * 100).toFixed(0);
  const lines = [
    `# Pack: ${a.name} (${a.slug})`,
    `${a.role} · sources: ${a.sourceCount} · last_updated: ${a.lastUpdated}`,
    `pack: ~${pack.tokens} tokens of ~${a.dossierTokens} (${coverage}%) · scorer: ${pack.scorer} · ${pack.retrieved.length} of ${a.cardCount} cards`,
    "",
    "Cite cards by id in square brackets. Quote only text that appears verbatim in a card.",
    "",
    "## Always-on",
    ...pack.alwaysOn.flatMap((card) => [`### [${card.id}] ${card.section}`, card.text, ""]),
    "## Retrieved for this decision (most relevant first)",
    ...pack.retrieved.flatMap(({ card, score }) => [
      `### [${card.id}] ${card.kind} · relevance ${score.toFixed(2)}${card.title ? ` · ${card.title}` : ""}`,
      card.text,
      "",
    ]),
  ];
  return lines.join("\n");
}
