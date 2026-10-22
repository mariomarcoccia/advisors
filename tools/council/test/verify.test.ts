import { describe, expect, it } from "vitest";
import { citedCardIds, renderReport, verifyAnswer } from "../src/verify.ts";
import { card } from "./helpers.ts";

const cards = [
  card("pg", "quote", "“The market doesn’t give a shit how hard you worked.” (*mit*.) And more text about growth being everything.", 1),
  card("naval", "quote", '"Play long-term games with long-term people." (tweet)', 2),
];
const opts = { advisors: ["pg"], minQuoteWords: 4 };

describe("verifyAnswer", () => {
  it("passes a verbatim quote with typographic differences and a valid card id", () => {
    const answer = `As I wrote, "The market doesn't give a shit how hard you worked." [${cards[0]?.id}]`;
    const report = verifyAnswer(answer, cards, opts);
    expect(report).toMatchObject({ ok: true, quotesChecked: 1, quotesVerified: 1, cardIdsChecked: 1 });
  });

  it("matches elided quotes fragment by fragment", () => {
    const report = verifyAnswer('"The market doesn\'t give ... how hard you worked"', cards, opts);
    expect(report.ok).toBe(true);
  });

  it("flags an invented quote", () => {
    const report = verifyAnswer('I always say "growth fixes every single problem eventually".', cards, opts);
    expect(report.problems).toEqual([{ kind: "unsourced_quote", quote: "growth fixes every single problem eventually" }]);
  });

  it("flags a quote that belongs to another advisor", () => {
    const report = verifyAnswer('"Play long-term games with long-term people."', cards, opts);
    expect(report.problems[0]).toMatchObject({ kind: "misattributed_quote", foundIn: ["naval"] });
  });

  it("flags unknown card ids and ignores short scare quotes", () => {
    const report = verifyAnswer('This is "founder mode" thinking [pg/q-ffffff].', cards, opts);
    expect(report.problems).toEqual([{ kind: "unknown_card", cardId: "pg/q-ffffff" }]);
    expect(renderReport(report)).toContain("FAIL");
  });
});

describe("verifyAnswer: review regressions", () => {
  it("rejects a fabricated tail glued to a real fragment with an ellipsis", () => {
    const report = verifyAnswer('"The market doesn\'t give ... xx yy" [pg/quote-000001]', cards, opts);
    expect(report.problems).toEqual([{ kind: "unsourced_quote", quote: "The market doesn't give ... xx yy" }]);
  });

  it("requires elided fragments in order within one card", () => {
    expect(verifyAnswer('"how hard you worked ... The market doesn\'t give" [pg/quote-000001]', cards, opts).ok).toBe(false);
  });

  it("verifies quotes whose fragments are all short", () => {
    const short = [card("pg", "quote", '"Be bold. Then win. Then rest." (x)', 9)];
    expect(verifyAnswer('"Be bold ... win ... rest" [pg/quote-000009]', short, opts).ok).toBe(true);
  });

  it("rejects spans that cut words at the edges", () => {
    expect(verifyAnswer('"he market doesn\'t give a sh" [pg/quote-000001]', cards, opts).ok).toBe(false);
  });

  it("flags an answer that cites nothing", () => {
    expect(verifyAnswer("Just my opinion, no sources.", cards, opts).problems).toEqual([{ kind: "nothing_cited" }]);
  });

  it("flags malformed card ids instead of ignoring them", () => {
    expect(verifyAnswer("A claim [pg/q-zzzzzz].", cards, opts).problems).toEqual([{ kind: "unknown_card", cardId: "pg/q-zzzzzz" }]);
  });
});

describe("citedCardIds", () => {
  it("dedupes ids and accepts collision suffixes", () => {
    expect(citedCardIds("[a/q-abcdef] x [a/q-abcdef] [b/mm-012345-2]")).toEqual(["a/q-abcdef", "b/mm-012345-2"]);
  });
});
