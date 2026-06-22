# advisors

> A personal board of advisors you can interview when a decision is hard.

`advisors` is a set of [Claude Code](https://claude.com/claude-code) skills that build **dossiers** of the operators and thinkers you admire — distilled from their public essays, talks, interviews, papers, and letters — and let you **consult** them when you're stuck.

The point isn't a cheering section. It's **counterpoints** — a council that disagrees with you well, surfaces the tradeoff you're avoiding, and tells you the thing you don't want to hear.

**Who it's for:** built for founders first, but useful to *any* professional facing a hard call — operators, managers, ICs, or anyone weighing a career or strategy decision. `/frame` learns your context (and saves a reusable profile), so the advice fits *you*, not a generic stranger.

> ⭐ If this is useful to you, **please star the repo** — it helps other people find it.

## The four skills

| Skill | What it does |
|---|---|
| **`/frame`** | Run this **first**. Learns who you are (saving a reusable **profile**) and interviews you until there's no doubt about your context, turning a vague worry into a sharp decision **brief** the other skills read. Great input → great counterpoints. |
| **`/advice`** | Consult **one** advisor 1:1 in their voice, with follow-ups. Name them, or let it suggest the most relevant. Also manages the roster: `add` a new advisor (researched from their public work), `feed` new material into one, or `list` the council. |
| **`/second-opinion`** | A dissenting view from a **different** advisor — one chosen because they'd likely disagree with the first — to challenge a recommendation. |
| **`/boardroom`** | Convenes a **debate**: recommends which advisors belong in the room for *your* problem, runs a structured meeting where they challenge each other, and hands you minutes (recommendation, dissents, what would change their mind). |

Typical flow: `/frame` → `/advice` (or `/boardroom`) → `/second-opinion` to pressure-test the answer.

## Install

```bash
git clone https://github.com/mariomarcoccia/advisors.git ~/advisors
cd ~/advisors && ./install.sh
```

`install.sh` is idempotent. It:
- links each skill in `skills/` into `~/.claude/skills/` so each becomes a `/command`, and
- links the shared data (`advisors/`, `reference/`) into `~/.advisors/` and creates `~/.advisors/state/` for your context briefs.

Then, in Claude Code: `/frame` to start, or `/advice list` to see who's on the board.

## How a dossier is built

Each advisor is one markdown file in [`advisors/`](advisors/) with structured frontmatter and sections for their core beliefs, mental models, decision heuristics, signature (and contrarian) positions, voice, and — importantly — their **blind spots and critiques**, so the simulation argues honestly instead of fawning. The schema lives in [`reference/persona-template.md`](reference/persona-template.md); the fidelity-and-ethics rules in [`reference/voice-guide.md`](reference/voice-guide.md).

Grow the board anytime with `/advice add "<anyone>"`, or enrich an advisor with `/advice feed <name> <links or pasted transcripts>`.

## Starter council

25 advisors across YC partners, SaaS and fintech operators, a leading venture voice, authors of a few foundational business books, and some of the most consequential operators and investors alive:

Paul Graham · Michael Seibel · Nicolas Dessaigne · Reid Hoffman · Dalton Caldwell · Garry Tan · Ben Horowitz · Naval Ravikant · James Clear · Carol S. Dweck · Reed Hastings · Ryan Breslow · Jason Lemkin · Pedro Franceschi · Harry Stebbings · Jeff Bezos · Elon Musk · Mark Zuckerberg · Jensen Huang · Warren Buffett · Larry Ellison · Bernard Arnault · Larry Page · Sergey Brin · Alice Walton

Reclusive figures (e.g. Larry Page, Sergey Brin, Alice Walton) have intentionally thinner dossiers — the `source_count` and provenance notes say so. The council never pads thin material with invention.

## Contributing

Anyone can help grow the council — no write access needed.

- **Suggest an advisor** or **report an error**: open an [Issue](https://github.com/mariomarcoccia/advisors/issues/new/choose).
- **Add or enrich a dossier**, or improve a skill: fork → branch → **Pull Request**. A maintainer reviews and merges.
- **Ideas & questions**: use [Discussions](https://github.com/mariomarcoccia/advisors/discussions).

Dossiers follow strict sourcing rules (public material only, no fabricated quotes, sourced critiques). Read [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`reference/voice-guide.md`](reference/voice-guide.md) before opening a PR.

## ⚠️ Disclaimer — personal use, no infringement intended

This is a **personal-use thinking tool**, shared in the hope it's useful to others.

- Every advisor here is a **simulation in the style of** a real person, built only from **publicly available** material (essays, talks, interviews, books, letters, public posts). It is **not** the real person, is **not** affiliated with or endorsed by them, and does not claim to represent their actual views.
- The simulations **never fabricate quotes**. Anything in quotation marks traces to a real, cited public source; everything else is clearly synthesis or extrapolation. Critiques are real and sourced, never invented.
- Quotations and references to copyrighted works are used in limited, transformative, **non-commercial** fashion for commentary and study. **No copyright or trademark infringement is intended.** Names and works belong to their respective owners.
- If you are one of the people modeled here and would like your dossier amended or removed, please open an issue — that request will be honored.

Use it to think better. Don't present its output as the real person's words.

## License

MIT — see [`LICENSE`](LICENSE). The MIT license covers the **skills and templates**, not the third-party quotations or referenced works cited within the dossiers.
