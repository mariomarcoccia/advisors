import type { Card } from "./schemas.ts";
import { extractQuotes, normalizeForMatch, quoteFragments } from "./text.ts";

export type CitationProblem =
  | { kind: "unknown_card"; cardId: string }
  | { kind: "unsourced_quote"; quote: string }
  | { kind: "misattributed_quote"; quote: string; foundIn: string[] };

export interface VerifyReport {
  ok: boolean;
  quotesChecked: number;
  quotesVerified: number;
  cardIdsChecked: number;
  problems: CitationProblem[];
}

export interface VerifyOptions {
  // Advisors the answer speaks for. Quotes must come from their cards.
  advisors: string[];
  // Shorter double-quoted spans are treated as scare quotes, not citations.
  minQuoteWords: number;
}

const CARD_REF = /\[([a-z0-9-]+\/[a-z]+-[0-9a-f]{6}(?:-\d+)?)\]/g;

export function citedCardIds(answer: string): string[] {
  return [...new Set([...answer.matchAll(CARD_REF)].map((m) => m[1] ?? ""))].filter(Boolean);
}

// Every double-quoted span of `minQuoteWords`+ words must appear verbatim (after
// typographic normalization, fragment by fragment across ellipses) in a card of
// one of the advisors the answer speaks for. Every cited card id must exist.
export function verifyAnswer(answer: string, cards: Card[], options: VerifyOptions): VerifyReport {
  const byId = new Map(cards.map((card) => [card.id, card]));
  const ids = citedCardIds(answer);
  const problems: CitationProblem[] = ids
    .filter((id) => !byId.has(id))
    .map((cardId) => ({ kind: "unknown_card", cardId }));
  const ownText = corpusText(cards.filter((card) => options.advisors.includes(card.advisor)));
  const quotes = extractQuotes(stripCardRefs(answer), options.minQuoteWords);
  let verified = 0;
  for (const quote of quotes) {
    const problem = checkQuote(quote, ownText, cards, options.advisors);
    if (problem) problems.push(problem);
    else verified += 1;
  }
  return {
    ok: problems.length === 0,
    quotesChecked: quotes.length,
    quotesVerified: verified,
    cardIdsChecked: ids.length,
    problems,
  };
}

function checkQuote(quote: string, ownText: string, cards: Card[], advisors: string[]): CitationProblem | undefined {
  if (appearsIn(quote, ownText)) return undefined;
  const foundIn = [...new Set(cards.filter((card) => appearsIn(quote, normalizeForMatch(card.text))).map((c) => c.advisor))];
  const others = foundIn.filter((slug) => !advisors.includes(slug));
  return others.length > 0 ? { kind: "misattributed_quote", quote, foundIn: others } : { kind: "unsourced_quote", quote };
}

function appearsIn(quote: string, normalizedHaystack: string): boolean {
  const fragments = quoteFragments(quote);
  const parts = fragments.length > 0 ? fragments : [quote];
  return parts.every((part) => normalizedHaystack.includes(normalizeForMatch(trimEdgePunctuation(part))));
}

function trimEdgePunctuation(text: string): string {
  return text.replace(/^[\s,.;:!?'"‘’()-]+|[\s,.;:!?'"‘’()-]+$/g, "");
}

function corpusText(cards: Card[]): string {
  return cards.map((card) => normalizeForMatch(card.text)).join("\n");
}

function stripCardRefs(answer: string): string {
  return answer.replace(CARD_REF, "");
}

export function renderReport(report: VerifyReport): string {
  const head = `${report.ok ? "PASS" : "FAIL"}: ${report.quotesVerified}/${report.quotesChecked} quotes verified, ${report.cardIdsChecked} card ids cited`;
  const lines = report.problems.map((problem) => {
    if (problem.kind === "unknown_card") return `- unknown card id: [${problem.cardId}]`;
    if (problem.kind === "misattributed_quote") {
      return `- misattributed (belongs to ${problem.foundIn.join(", ")}): "${problem.quote}"`;
    }
    return `- not found in any cited advisor's dossier: "${problem.quote}"`;
  });
  return [head, ...lines].join("\n");
}
