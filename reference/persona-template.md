# Persona dossier template

A dossier is a **decision-making lens**, not a biography. It steers a model that *already knows* these public figures — so its job is to anchor verified positions, enforce the voice, and supply the blind spots. Optimize for **density, not length**.

**What the lens is made of: worked examples, not abstractions.** The model already has the abstractions — "make something people want", "disagree and commit". Restating those adds nothing. What it lacks, and what makes a simulated board member useful in a *debate*, is **situated reasoning**: when this person faced *that* situation, what they did, and the verbatim line they said it in. A worked example is `situation → what they did/argued → verbatim quote → source`. Examples are what let the advisor take a defensible position on a *new* problem by analogy — so a framework without an example is half-built. This is "the essence of all their texts" the dossier is reaching for: not one line per essay, but enough concrete cases that the reasoning pattern is reconstructable.

**Examples are the default, not a quota.** Aim for a sourced example on *every* core idea, mental model, heuristic, and position — it's strongly desirable everywhere, and required for mental models. But where you genuinely can't source one, **keep the item and leave it visibly example-less** — never invent an example to fill the slot (that violates the no-fabricated-quotes rule). A missing example is a signal to find a better source, not a license to manufacture one.

Copy the structure below into `advisors/<slug>.md`. Fill every section. Keep it grounded in sourced public material — if you can't source it, mark it as your own paraphrase/extrapolation or leave it out. The seam between *documented* and *extrapolated* must stay visible to the reader.

---

## Build process (run all four passes)

Building or refreshing a dossier is a four-pass pipeline. Don't skip passes — Verify in particular is non-negotiable.

### 1. Research
- Read the current dossier first (the baseline) so you know what's already covered.
- Do **deep web search** (WebSearch / WebFetch, many queries) for **new primary material** beyond what's already cited: essays, long-form interview/podcast transcripts, talks, letters, books, posts. Then serious, sourced criticism.
- Collect, each item with its **exact URL**:
  - (a) **verbatim quotes**
  - (b) **concrete positions/decisions** tied to the situation they faced
  - (c) **frameworks** + where they actually applied them
  - (d) where they **disagree** with *other named thinkers*
  - (e) **critiques / blind spots**, with a source
- Prioritize **genuine novelty** — new *kinds of situations* the person addressed, not a reworded version of something the dossier already has.
- Include only what you verified.

### 2. Synthesize
Rewrite the dossier following the section structure below **exactly** (frontmatter; Bio; Core ideas; Mental models; Decision heuristics; Signature quotes; Voice & style; Blind spots; Provenance notes) **plus the two newer sections** (Positions by decision type; Where they disagree). Update the frontmatter (`last_updated`, `source_count`, `sources[]`). Write the complete file (overwrite).

### 3. Dedup
Re-read the file and cut redundancy aggressively. The cut is **asymmetric**: restated *abstractions* across Core ideas / Mental models / Positions are the #1 thing to trim (keep the sharpest phrasing, cross-reference instead of repeating), but **never cut a distinct worked example, primary quote, or decision situation** — those are the payload, not the filler. When two passages compete, keep the one carrying the concrete example. Do not remove the two newer sections. Rewrite in place.

### 4. Verify
Re-read. For **every quoted line and every source URL**, spot-check the riskiest via WebFetch/WebSearch:
- A quote that doesn't trace to a real source → demote to a marked paraphrase, or remove it.
- A fabricated or dead URL → fix it or remove it (adjust `source_count`).
- Confirm the documented-vs-extrapolated seam is intact.
Rewrite in place. Then report: **# quotes checked, # demoted, # removed, # sources verified/removed.**

---

## Hard rules
- **Never fabricate a quote.** Anything in quotation marks must trace to a real URL from the research. If you can't source it, write it as your own paraphrase and mark it as such.
- **Keep the seam visible** between what's documented and what you're extrapolating.
- **Critiques must be real and sourced** — not invented weaknesses, not hagiography.
- **Primary voice over secondary commentary.** Their own words beat what others say about them.

---

## Structure

```markdown
---
name: Full Name
slug: kebab-case-slug
role: One-line title (e.g. "Co-founder, Y Combinator")
domains: [comma, separated, topics, they, speak, on]
last_updated: YYYY-MM-DD
source_count: 0
sources:
  - { type: essay|interview|podcast|talk|paper|letter|book|post|profile|statement, title: "...", url: "https://..." }
---

## Bio
Who they are, what they built, and why their judgment is worth borrowing. 3-6 sentences.

## Core ideas
The handful of things they actually believe at the foundation — what they optimize the world around.

## Mental models
Named, reusable frameworks. (e.g. "Make something people want", "Do things that don't scale", "Disagree and commit".)
Each: the name, the one-line gist, **and at least one worked example** — a concrete situation where they applied it and what it produced, with a source. The gist is commodity; the example is the payload. Cross-reference Core ideas rather than restating them.

## Decision heuristics
How they actually decide under uncertainty — the questions they ask themselves, what they cut first.

## Positions by decision type
Documented position per *concrete situation*, each with a source. Cover the recurring founder/operator forks, e.g.:
- pivot vs. persevere
- how to price
- when to fire / when to sell
- raise vs. bootstrap
- focus vs. diversify
Tie each to the actual situation they faced and what they did or advised. If a position is your inference rather than documented, mark it.

## Signature quotes
Verbatim lines, each traceable to a `sources[]` entry. Strong, specific, sometimes contrarian — including what they argue *against*. This is the section that makes the advisor useful as a counterpoint.

## Voice & style
How they talk: sentence rhythm, vocabulary, recurring metaphors, rhetorical moves, what they're blunt about, what they hedge. Enough that a reader could recognize a paraphrase as "sounds like them".

## Where they disagree
A matrix of how this advisor diverges from *other named advisors* on specific questions. One row per disagreement: the question, their position, the other advisor's contrasting position. This is what powers `/second-opinion` and `/boardroom`.

## Blind spots
Where they're known to be wrong, what serious critics say about them, the contexts where their advice misfires. Sourced. Keeps the simulation honest rather than hagiographic.

## Provenance notes
How thick/thin the source base is, what's well-documented vs. inferred, and any disambiguation notes.
```

---

## Quality bar
- **≥5 real sources** for a normal advisor; reclusive figures may have fewer — record that in `source_count` and Provenance notes.
- Every quoted line traces to a `sources[]` entry (enforced by the Verify pass).
- Prefer primary sources (their own words) over secondary commentary.

### Size: dedup-driven, not a target
Length is an **output of de-duplication, not a goal**. There's a hard ceiling of **2,000 lines**, but do **not** pad to reach it.
- Include all new, specific material; **stop where quality saturates.**
- **Density over volume.** It's a decision lens for a model that already knows the person — not a biography.
- **Primary voice and range beat tonnage.** Add real quotes and *new kinds of situations* — not a seventh example of a framework already captured.
- **Cut redundancy before adding.** The same idea restated across Core ideas / Mental models / Positions is the first thing to trim.
- If a dossier feels shallow, the fix is **better sources, not more words.**
