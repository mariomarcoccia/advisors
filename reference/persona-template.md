# Persona dossier template

A dossier is a **decision-making lens** built by **exhaustively distilling** everything a figure has put on record. It steers a model that *already knows* these public figures — so its job is to anchor *verified* positions in their own words, enforce the voice, and supply the blind spots. It is **not** a biography and **not** a summary: it is the **complete set of distinct, sourced positions, heuristics, mental models, and worked examples** the figure's corpus yields, deduplicated. Length is whatever that coverage requires — a prolific figure (hundreds of essays, years of talks) correctly produces a **long** dossier. The failure mode to avoid is capturing only the famous top slice.

**What the lens is made of: worked examples, not abstractions.** The model already has the abstractions — "make something people want", "disagree and commit". Restating those adds nothing. What it lacks, and what makes a simulated board member useful in a *debate*, is **situated reasoning**: when this person faced *that* situation, what they did, and the verbatim line they said it in. A worked example is `situation → what they did/argued → verbatim quote → source`. Examples are what let the advisor take a defensible position on a *new* problem by analogy — so a framework without an example is half-built. This is "the essence of all their texts" the dossier is reaching for — captured **source by source across the whole corpus**, so that every distinct reasoning pattern the figure put on record is reconstructable, not just the famous handful.

**Examples are the default, not a quota.** Aim for a sourced example on *every* core idea, mental model, heuristic, and position — it's strongly desirable everywhere, and required for mental models. But where you genuinely can't source one, **keep the item and leave it visibly example-less** — never invent an example to fill the slot (that violates the no-fabricated-quotes rule). A missing example is a signal to find a better source, not a license to manufacture one.

Copy the structure below into `advisors/<slug>.md`. Fill every section. Keep it grounded in sourced public material — if you can't source it, mark it as your own paraphrase/extrapolation or leave it out. The seam between *documented* and *extrapolated* must stay visible to the reader.

---

## Build process (run all four passes)

Building or refreshing a dossier is a four-pass pipeline. Don't skip passes — Verify in particular is non-negotiable.

### 1. Research
- Read the current dossier first (the baseline) so you know what's already covered.
- **Enumerate the figure's full primary corpus, then cover it systematically.** Find the canonical index (an essays/articles page, a talks list, a podcast/episode archive, a book's table of contents) and walk it **piece by piece** — do **not** rely on the famous works surfacing through search, which yields only the top slice. Prioritize idea-dense pieces; skim-and-skip the purely topical/announcement ones, but make that triage **explicit**. For large corpora this is a **fan-out**: partition the index and extract in parallel, then merge and dedup.
- From each source collect **new primary material** beyond what's already cited: essays, long-form interview/podcast transcripts, talks, letters, books, posts. Then serious, sourced criticism.
- Collect, each item with its **exact URL**:
  - (a) **verbatim quotes**
  - (b) **concrete positions/decisions** tied to the situation they faced
  - (c) **frameworks** + where they actually applied them
  - (d) where they **disagree** with *other named thinkers*
  - (e) **critiques / blind spots**, with a source
- Prioritize **genuine novelty** — new *kinds of situations* the person addressed, not a reworded version of something the dossier already has.
- Include only what you verified.

### 2. Synthesize
Rewrite the dossier following the section structure below **exactly**: frontmatter; **Summary**; Bio; Core ideas; Mental models; Decision heuristics; Positions by decision type; Signature quotes; Voice & style; Where they disagree; Blind spots; Provenance notes. The **Summary** is the selection digest — write it last, once everything else is done. Update the frontmatter (`last_updated`, `source_count`, `sources[]`). Write the complete file (overwrite).

### 3. Dedup
Re-read the file and cut redundancy aggressively. The cut is **asymmetric**: restated *abstractions* across Core ideas / Mental models / Positions are the #1 thing to trim (keep the sharpest phrasing, cross-reference instead of repeating), but **never cut a distinct worked example, primary quote, or decision situation** — those are the payload, not the filler. When two passages compete, keep the one carrying the concrete example. Do not remove the two newer sections. Rewrite in place.

### 4. Verify
Re-read. Check **every load-bearing quoted line and every source URL**:
- **Verify quotes against the raw source, not a WebFetch summary.** WebFetch / reader tools sometimes *fabricate* plausible verbatim text. Confirm each load-bearing quote against the raw page (e.g. `curl` the HTML) or an independent reproduction; if you can't, demote it to a marked paraphrase.
- A quote that doesn't trace to a real source → demote to a marked paraphrase, or remove it.
- A fabricated or dead URL → fix it or remove it (adjust `source_count`).
- Confirm the documented-vs-extrapolated seam is intact.
Rewrite in place. Then report: **# quotes checked, # demoted, # removed, # sources verified/removed.**

---

## Model split (cost vs. quality)

The four passes above are model-agnostic, but they don't cost the same to get right. Use the seams the pipeline already gives you: **draft the volume on a cheaper model, then spend the expensive model where the dossier lives or dies.**

- **Sonnet — Research, Dedup, and the preliminary Verify.** Corpus enumeration, quote/position/URL extraction, the asymmetric dedup against explicit rules, and the raw-source quote comparison (it's string-matching — a cheaper model handles it, and its false positives are cheap to review).
- **Opus — one consolidated pass over the whole file.** Not scoped to the template's Verify. It does three things:
  1. **Fidelity** — the Verify pass as specified above (every quote against the raw source, demote fabrications, fix dead URLs).
  2. **Completeness** — audit corpus coverage: did Research walk the full canonical index, or stop at the *famous top slice*? Missing distinct positions is the #1 silent failure of a cheaper Research pass, and a fidelity check never surfaces it.
  3. **Depth, fixed in place** — where synthesis went shallow (worked examples collapsed into restated abstractions, a thin "Where they disagree" matrix), **rewrite it**, don't just flag it. Opus is already reading the whole file to verify; letting it repair shallow synthesis in the same pass captures most of the value of running Synthesize on Opus, at a fraction of the cost.

**Why not "draft everything on the cheap model, then just verify with the expensive one":** a Verify pass by definition checks *what's on the page against its sources* — it guards **fidelity** only. The two failure modes a cheaper model is most prone to here are modes of *absence* — incomplete corpus coverage and shallow synthesis — and no fidelity check recovers them. That's why the Opus pass must also audit completeness and repair depth, not just quotes.

**Rule of thumb:** the expensive model doesn't validate quotes — it validates **quotes + completeness + depth, and fixes the last two in place.**

---

## Hard rules
- **Never fabricate a quote.** Anything in quotation marks must trace to a real URL from the research. If you can't source it, write it as your own paraphrase and mark it as such.
- **Verify quotes against the raw source, never trust a WebFetch summary's verbatim text** — reader tools hallucinate plausible quotes; confirm against raw HTML or an independent reproduction.
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

## Summary
2-4 dense sentences, read at the **selection** stage (deciding which advisors to seat) *before* the full dossier is loaded. Who they are, the lens they offer, their sharpest/most contrarian positions, and who they tend to oppose — enough for a chair to judge relevance and tension at a glance. This is the only section guaranteed to be read for *every* advisor on *every* consult, so make it earn that. Write it **last**, once the dossier is complete.

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

### Size: completeness of corpus coverage, not a word target
Length is an **output**, never a goal — no target, no padding. The rule is **asymmetric**:
- **Cover the corpus, not a sample.** The yardstick is *what fraction of the figure's distinct, sourced positions are captured* — aim for ~all of them. A dossier that cites 20% of a prolific figure's essays is incomplete by definition, however polished it reads. Enumerate the index and work through it; don't stop at the famous pieces.
- **Cut redundancy ruthlessly:** the same *abstraction* restated across Core ideas / Mental models / Positions is the first thing to trim — density of distinct ideas, not repetition.
- **Never drop a distinct, sourced worked example, quote, or decision situation to save space** — those are the payload. A prolific author (books, years of essays) correctly yields a *long* dossier; that's signal, not bloat. Do not "stop where it saturates" if there is still distinct, sourced material to capture.
- **The test is simple:** is this a distinct, sourced situation/quote/position? If yes, it stays — however long the file gets. If it's a restated abstraction, it goes.
- If a dossier feels shallow, the fix is **more sourced worked examples, not fewer words.**
