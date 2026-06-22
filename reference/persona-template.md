# Persona dossier template

Copy this structure into `advisors/<slug>.md`. Fill every section. Keep it grounded in sourced public material — if you can't source it, mark it as extrapolation or leave it out.

```markdown
---
name: Full Name
slug: kebab-case-slug
role: One-line title (e.g. "Co-founder, Y Combinator")
domains: [comma, separated, topics, they, speak, on]
last_updated: YYYY-MM-DD
source_count: 0
sources:
  - { type: essay|interview|podcast|talk|paper|letter|book|post|profile, title: "...", url: "https://..." }
---

## Bio & context
Who they are, what they built, and why their judgment is worth borrowing. 3-6 sentences.

## Core beliefs / worldview
The handful of things they actually believe at the foundation. What they optimize the world around.

## Mental models & frameworks
Named, reusable. (e.g. "Make something people want", "Do things that don't scale", "Disagree and commit".)
Each: the name, the one-line gist, and where it shows up in their work.

## Decision heuristics
How they actually decide under uncertainty. The questions they ask themselves. What they cut first.

## Signature positions & hot takes
Their strong, specific, sometimes contrarian views — INCLUDING what they argue *against*.
This section is what makes the advisor useful as a counterpoint.

## Voice & style
How they talk: sentence rhythm, vocabulary, recurring metaphors, rhetorical moves, what they're blunt about,
what they hedge. Enough that a reader could recognize a paraphrase as "sounds like them".

## Blind spots / critiques
Where they're known to be wrong, what serious critics say about them, the contexts where their advice misfires.
Sourced. This keeps the simulation honest rather than hagiographic.

## Provenance notes
How thick/thin the source base is, what's well-documented vs. inferred, and any disambiguation notes.
```

## Quality bar
- **≥5 real sources** for a normal advisor; reclusive figures may have fewer — record that in `source_count` and Provenance notes.
- Every quoted line must be traceable to a `sources[]` entry.
- Prefer primary sources (their own words) over secondary commentary.

### Size: signal over volume
A dossier is a **decision-making lens**, not a biography — it can't capture a whole human, and shouldn't try. It steers a model that already knows these public figures; its job is to anchor verified positions, enforce the voice, and supply the blind spots. So optimize for **density, not length**:
- **Primary voice and range beat tonnage.** Add real quotes and *new kinds of situations* the person addressed — not a seventh example of a framework already captured.
- **Cut redundancy before adding.** The same idea restated across Core beliefs / Mental models / Books distilled is the first thing to trim.
- **No hard word cap**, but ~2,000–4,000 words is the healthy zone; marquee thinkers may run to ~5,000–6,000 if the extra is primary voice or genuinely new lenses. Past that, you're usually adding filler, and `/boardroom` loads several dossiers at once — keep each tight.
- If a dossier feels shallow, the fix is **better sources, not more words**.
