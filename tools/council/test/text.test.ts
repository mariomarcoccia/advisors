import { describe, expect, it } from "vitest";
import { countWords, estimateTokens, extractQuotes, indexOfWords, normalizeForMatch, quoteFragments, tokenize } from "../src/text.ts";

describe("normalizeForMatch", () => {
  it("unifies curly quotes, dashes, emphasis and whitespace", () => {
    expect(normalizeForMatch("“It’s  **fine**” — ok")).toBe(normalizeForMatch('"It\'s fine" - ok'));
  });
});

describe("extractQuotes", () => {
  it("keeps spans with enough words and drops scare quotes", () => {
    const text = 'He calls it "founder mode" and says "the market does not care how hard you worked".';
    expect(extractQuotes(text, 2)).toEqual(["founder mode", "the market does not care how hard you worked"]);
    expect(extractQuotes(text)).toEqual(["the market does not care how hard you worked"]);
  });

  it("reads curly quotes", () => {
    expect(extractQuotes("“make something people want”")).toEqual(["make something people want"]);
  });
});

describe("quoteFragments", () => {
  it("splits on ellipses, keeps short fragments, drops punctuation-only ones", () => {
    expect(quoteFragments("first part of it ... second part here … ok ... !")).toEqual(["first part of it", "second part here", "ok"]);
  });
});

describe("tokenize / counts", () => {
  it("drops stopwords and short tokens", () => {
    expect(tokenize("The growth of a startup is the thing")).toEqual(["growth", "startup", "thing"]);
  });

  it("estimates tokens and words", () => {
    expect(estimateTokens("abcdefgh")).toBe(2);
    expect(countWords("  one two  three ")).toBe(3);
  });
});

describe("indexOfWords", () => {
  it("only matches on word boundaries", () => {
    expect(indexOfWords("make something people want", "ake something")).toBe(-1);
    expect(indexOfWords("other make something", "make something")).toBe(6);
    expect(indexOfWords("ação boa", "ção")).toBe(-1);
  });
});
