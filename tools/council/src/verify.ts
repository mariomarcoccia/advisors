import type { Card } from "./schemas.ts";
import { extractQuotes, indexOfWords, normalizeForMatch, quoteFragments } from "./text.ts";

export type CitationProblem =
  | { kind: "unknown_card"; cardId: string }
  | { kind: "unsourced_quote"; quote: string }
  | { kind: "misattributed_quote"; quote: string; foundIn: string[] }
  | { kind: "nothing_cited" };

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

// Anything bracketed that looks like `[slug/...]` is a citation attempt, so a
// mistyped or invented id is reported instead of silently ignored.
const CARD_REF = /\[([a-z0-9]+(?:-[a-z0-9]+)*\/[^\]\s]+)\]/g;

export function citedCardIds(answer: string): string[] {
  return [...new Set([...answer.matchAll(CARD_REF)].map((m) => m[1] ?? ""))].filter(Boolean);
}

// Every double-quoted span of `minQuoteWords`+ words must appear verbatim in one
// card of an advisor the answer speaks for: word-aligned, after typographic
// normalization, with elided fragments in order inside that same card. Every
// cited card id must exist, and an answer must cite something.
export function verifyAnswer(answer: string, cards: Card[], options: VerifyOptions): VerifyReport {
  const byId = new Map(cards.map((card) => [card.id, card]));
  const ids = citedCardIds(answer);
  const problems: CitationProblem[] = ids
    .filter((id) => !byId.has(id))
    .map((cardId) => ({ kind: "unknown_card", cardId }));
  const normalized = cards.map((card) => ({ advisor: card.advisor, text: normalizeForMatch(card.text) }));
  const quotes = extractQuotes(answer.replace(CARD_REF, ""), options.minQuoteWords);
  let verified = 0;
  for (const quote of quotes) {
    const problem = checkQuote(quote, normalized, options.advisors);
    if (problem) problems.push(problem);
    else verified += 1;
  }
  if (quotes.length === 0 && ids.length === 0) problems.push({ kind: "nothing_cited" });
  return { ok: problems.length === 0, quotesChecked: quotes.length, quotesVerified: verified, cardIdsChecked: ids.length, problems };
}

interface NormalizedCard {
  advisor: string;
  text: string;
}

function checkQuote(quote: string, cards: NormalizedCard[], advisors: string[]): CitationProblem | undefined {
  const fragments = quoteFragments(quote).map((part) => normalizeForMatch(trimEdgePunctuation(part)));
  const holders = [...new Set(cards.filter((card) => inOrder(fragments, card.text)).map((card) => card.advisor))];
  if (holders.some((slug) => advisors.includes(slug))) return undefined;
  return holders.length > 0 ? { kind: "misattributed_quote", quote, foundIn: holders } : { kind: "unsourced_quote", quote };
}

export function inOrder(fragments: string[], text: string): boolean {
  if (fragments.length === 0) return false;
  let from = 0;
  for (const fragment of fragments) {
    const at = indexOfWords(text, fragment, from);
    if (at === -1) return false;
    from = at + fragment.length;
  }
  return true;
}

function trimEdgePunctuation(text: string): string {
  return text.replace(/^[\s,.;:!?'"‘’()-]+|[\s,.;:!?'"‘’()-]+$/g, "");
}

export function renderReport(report: VerifyReport): string {
  const head = `${report.ok ? "PASS" : "FAIL"}: ${report.quotesVerified}/${report.quotesChecked} quotes verified, ${report.cardIdsChecked} card ids cited`;
  return [head, ...report.problems.map(describe)].join("\n");
}

function describe(problem: CitationProblem): string {
  switch (problem.kind) {
    case "unknown_card":
      return `- unknown card id: [${problem.cardId}]`;
    case "misattributed_quote":
      return `- misattributed (belongs to ${problem.foundIn.join(", ")}): "${problem.quote}"`;
    case "unsourced_quote":
      return `- not found verbatim in any card of the cited advisor(s): "${problem.quote}"`;
    case "nothing_cited":
      return "- nothing cited: the answer has no card ids and no checkable quotes";
  }
}
