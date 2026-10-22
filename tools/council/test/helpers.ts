import type { JevRequest, JevResponse, JevTransport } from "../src/jev.ts";
import type { Card, CardKind } from "../src/schemas.ts";
import { estimateTokens, extractQuotes, tokenize } from "../src/text.ts";

// Deterministic stand-in for Jev: a noul is the share of the material's distinct
// tokens that also appear in the decision. Lets retrieval logic be tested offline.
export class FakeJev implements JevTransport {
  calls: JevRequest[] = [];

  systemOne(request: JevRequest): Promise<JevResponse> {
    this.calls.push(request);
    const state = request.state as Record<string, string>;
    const decision = new Set(tokenize(state["decision"] ?? ""));
    const answers: JevResponse["answers"] = {};
    for (const [id, question] of Object.entries(request.questions)) {
      const material = typeof question.instructions === "string" ? (state["material"] ?? "") : String(question.instructions["material"]);
      const tokens = [...new Set(tokenize(material))];
      const overlap = tokens.filter((t) => decision.has(t)).length;
      answers[id] = { type: "noul", noul: tokens.length ? overlap / tokens.length : 0 };
    }
    return Promise.resolve({ model: "jev-fake", answers, usage: { input_tokens: 1, output_tokens: 1 } });
  }
}

export function card(advisor: string, kind: CardKind, text: string, n = 0): Card {
  return {
    id: `${advisor}/${kind}-${String(n).padStart(6, "0")}`,
    advisor,
    kind,
    section: kind,
    text,
    quotes: extractQuotes(text),
    tokens: estimateTokens(text),
  };
}

export const DOSSIER = `---
name: Test Person
slug: test-person
role: Founder, Example Co
domains: [startups, pricing]
last_updated: 2026-01-02
source_count: 1
sources:
  - { type: essay, title: "An Essay", url: "https://example.com/essay" }
---

## Summary
Test Person argues that "pricing is a product decision, not a finance one" and opposes Paul Graham on growth.

## Bio
Founded Example Co.

## Core ideas
Each idea carries an example.

- **Charge more early.** "If nobody complains about price, you are too cheap." (*essay*.)
  - Nested detail that belongs to the parent.
- **Focus beats breadth.** Wrapped line one
continues here.

A standalone paragraph long enough to be its own card because it carries a real position about focus and the cost of saying yes to every customer request that arrives, which is a recurring theme throughout the essays.

## Mental models
### A Book (2020)
- **Default alive.** "Do you make it to profitability on the money you have left?" (*essay*.)

## Decision heuristics
- Ask what you would cut first.

## Positions by decision type
- **Pricing.** Raise prices before you think you can.

## Signature quotes
- "If nobody complains about price, you are too cheap." (*essay*.)

## Voice & style
Short sentences.

## Where they disagree
| Question | Their position | Other |
|---|---|---|
| Growth vs. profit | Profit first | Paul Graham: growth is everything |
- **Scale — vs. Naval Ravikant.** Disagrees about staying small.
- **Brands — vs. some marketer.** Thinks brand is overrated.

## Blind spots
- Survivorship bias.

## Provenance notes
- Thin.
`;
