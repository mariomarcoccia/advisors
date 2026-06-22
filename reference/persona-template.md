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
