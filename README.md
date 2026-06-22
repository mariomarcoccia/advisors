# council

> A personal board of advisors you can interview when a decision is hard.

`council` is a set of [Claude Code](https://claude.com/claude-code) skills that build **dossiers** of the operators and thinkers you admire — distilled from their public essays, talks, interviews, papers, and letters — and let you **consult** them when you're stuck.

The point isn't a cheering section. It's **counterpoints** — a council that disagrees with you well, surfaces the tradeoff you're avoiding, and tells you the thing you don't want to hear.

> ⭐ If this is useful to you, **please star the repo** — it helps other people find it.

## The five skills

| Skill | What it does |
|---|---|
| **`/frame`** | Run this **first**. Interviews you to turn a vague worry into a sharp decision and writes a context **brief** the other skills read. Great input → great counterpoints. |
| **`/advice`** | Consult **one** advisor 1:1 in their voice, with follow-ups. Name them, or let it suggest the most relevant one. |
| **`/second-opinion`** | A dissenting view from a **different** advisor — one chosen because they'd likely disagree with the first — to challenge a recommendation. |
| **`/boardroom`** | Convenes a **debate**: recommends which advisors belong in the room for *your* problem, runs a structured meeting where they challenge each other, and hands you minutes (recommendation, dissents, what would change their mind). |
| **`/advisors`** | Manage the roster: `add` a new advisor (researched from their public work), `feed` new material into one, or `list` the council. |

Typical flow: `/frame` → `/advice` (or `/boardroom`) → `/second-opinion` to pressure-test the answer.

## Install

```bash
git clone https://github.com/mariomarcoccia/council.git ~/council
cd ~/council && ./install.sh
```

`install.sh` is idempotent. It:
- links each skill in `skills/` into `~/.claude/skills/` so each becomes a `/command`, and
- links the shared data (`advisors/`, `reference/`) into `~/.council/` and creates `~/.council/state/` for your context briefs.

Then, in Claude Code: `/frame` to start, or `/advisors list` to see who's on the board.

## How a dossier is built

Each advisor is one markdown file in [`advisors/`](advisors/) with structured frontmatter and sections for their core beliefs, mental models, decision heuristics, signature (and contrarian) positions, voice, and — importantly — their **blind spots and critiques**, so the simulation argues honestly instead of fawning. The schema lives in [`reference/persona-template.md`](reference/persona-template.md); the fidelity-and-ethics rules in [`reference/voice-guide.md`](reference/voice-guide.md).

Grow the board anytime with `/advisors add "<anyone>"`, or enrich an advisor with `/advisors feed <name> <links or pasted transcripts>`.

## Starter council

22 advisors across YC partners, authors of a few foundational business books, and some of the most consequential operators and investors alive:

Paul Graham · Michael Seibel · Nicolas Dessaigne · Reid Hoffman · Dalton Caldwell · Garry Tan · Ben Horowitz · Naval Ravikant · James Clear · Carol S. Dweck · Reed Hastings · Ryan Breslow · Jeff Bezos · Elon Musk · Mark Zuckerberg · Jensen Huang · Warren Buffett · Larry Ellison · Bernard Arnault · Larry Page · Sergey Brin · Alice Walton

Reclusive figures (e.g. Larry Page, Sergey Brin, Alice Walton) have intentionally thinner dossiers — the `source_count` and provenance notes say so. The council never pads thin material with invention.

## ⚠️ Disclaimer — personal use, no infringement intended

This is a **personal-use thinking tool**, shared in the hope it's useful to others.

- Every advisor here is a **simulation in the style of** a real person, built only from **publicly available** material (essays, talks, interviews, books, letters, public posts). It is **not** the real person, is **not** affiliated with or endorsed by them, and does not claim to represent their actual views.
- The simulations **never fabricate quotes**. Anything in quotation marks traces to a real, cited public source; everything else is clearly synthesis or extrapolation. Critiques are real and sourced, never invented.
- Quotations and references to copyrighted works are used in limited, transformative, **non-commercial** fashion for commentary and study. **No copyright or trademark infringement is intended.** Names and works belong to their respective owners.
- If you are one of the people modeled here and would like your dossier amended or removed, please open an issue — that request will be honored.

Use it to think better. Don't present its output as the real person's words.

## License

MIT — see [`LICENSE`](LICENSE). The MIT license covers the **skills and templates**, not the third-party quotations or referenced works cited within the dossiers.
