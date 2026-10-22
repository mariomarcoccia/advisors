import type { Card, GraphEdge } from "./schemas.ts";
import { normalizeForMatch } from "./text.ts";

export interface AdvisorName {
  slug: string;
  name: string;
}

// Builds "who disagrees with whom" edges from each dossier's "Where they disagree"
// cards. A card that names a council member becomes an internal edge; a card that
// only names outsiders becomes an external edge so /second-opinion can still see it.
export function buildGraph(cards: Card[], advisors: AdvisorName[]): GraphEdge[] {
  const matchers = advisors.map((advisor) => ({
    slug: advisor.slug,
    keys: [...nameKeys(advisor.name), ...(ALIASES[advisor.slug] ?? []).map(fold)],
  }));
  return cards
    .filter((card) => card.kind === "disagreement")
    .flatMap((card) => edgesForCard(card, matchers));
}

interface Matcher {
  slug: string;
  keys: string[];
}

function edgesForCard(card: Card, matchers: Matcher[]): GraphEdge[] {
  const haystack = fold(card.text);
  const label = edgeLabel(card);
  const targets = matchers.filter((m) => m.slug !== card.advisor && m.keys.some((k) => mentions(haystack, k)));
  if (targets.length === 0) {
    return [{ from: card.advisor, to: "external", external: true, label, cardId: card.id }];
  }
  return targets.map((m) => ({ from: card.advisor, to: m.slug, external: false, label, cardId: card.id }));
}

// Full name always counts; a surname counts only when it is distinctive enough
// not to collide ("Page", "Brown", "Clark" would match ordinary English).
function nameKeys(name: string): string[] {
  const full = fold(name);
  const parts = full.split(" ");
  const surname = parts.at(-1) ?? "";
  const keys = [full];
  if (surname.length >= 6 && !AMBIGUOUS_SURNAMES.has(surname)) keys.push(surname);
  return keys;
}

// Shared surnames (two Trajanos, two Amodeis, Benjamin Graham, Sam Walton) only
// match on the full name.
const AMBIGUOUS_SURNAMES = new Set(["trajano", "amodei", "graham", "walton"]);

// Short surnames and first-name-famous figures that the length rule would miss.
const ALIASES: Record<string, string[]> = {
  "naval-ravikant": ["naval"],
  "paul-graham": ["pg"],
  "jensen-huang": ["huang", "jensen"],
  "jeff-bezos": ["bezos"],
  "elon-musk": ["musk"],
  "sergey-brin": ["brin"],
  "sam-altman": ["altman"],
  "garry-tan": ["garry"],
  "chris-olah": ["olah"],
  "carol-dweck": ["dweck"],
  "dario-amodei": ["dario"],
  "daniela-amodei": ["daniela"],
  "luiza-helena-trajano": ["luiza trajano", "luiza"],
  "frederico-trajano": ["fred trajano", "frederico"],
};

function fold(text: string): string {
  return normalizeForMatch(text).normalize("NFD").replace(/\p{M}/gu, "");
}

function mentions(haystack: string, key: string): boolean {
  return new RegExp(`(^|[^\\p{L}])${escapeRegExp(key)}([^\\p{L}]|$)`, "u").test(haystack);
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function edgeLabel(card: Card): string {
  const source = card.title ?? card.text;
  const firstLine = source.split("\n")[0] ?? source;
  return firstLine.length > 160 ? `${firstLine.slice(0, 157)}...` : firstLine;
}
