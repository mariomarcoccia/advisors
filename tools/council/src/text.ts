import { createHash } from "node:crypto";

// Rough token estimate (chars / 4). Good enough for budgeting packs and Jev requests.
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function shortHash(text: string, length = 6): string {
  return createHash("sha256").update(text).digest("hex").slice(0, length);
}

// Normalizes typography so a quote copied from a dossier matches regardless of
// curly vs. straight quotes, dash style, markdown emphasis, or line wrapping.
export function normalizeForMatch(text: string): string {
  return text
    .normalize("NFKC")
    .replace(/[‘’‛′]/g, "'")
    .replace(/[“”‟″]/g, '"')
    .replace(/[–—−]/g, "-")
    .replace(/\*+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

const QUOTE_PATTERN = /["“]([^"“”]+?)["”]/g;

// Extracts double-quoted spans with at least `minWords` words. Short spans are
// usually scare quotes ("manager mode"), not citations.
export function extractQuotes(text: string, minWords = 3): string[] {
  const spans: string[] = [];
  for (const match of text.matchAll(QUOTE_PATTERN)) {
    const span = (match[1] ?? "").trim();
    if (countWords(span) >= minWords) spans.push(span);
  }
  return spans;
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

// Splits a quote on ellipses so elided quotes can be matched fragment by fragment.
export function quoteFragments(quote: string, minWords = 3): string[] {
  return quote
    .split(/\.{3}|…|\[\.\.\.\]/)
    .map((part) => part.trim())
    .filter((part) => countWords(part) >= minWords);
}

const STOPWORDS = new Set(
  "a an the and or but if of to in on for with at by from as is are was were be been being it its this that these those i you he she we they them his her their our your my me us do does did not no so than then there here what which who whom how why when where can could should would will just about into over under more most less very also have has had".split(" "),
);

export function tokenize(text: string): string[] {
  return normalizeForMatch(text)
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOPWORDS.has(token));
}
