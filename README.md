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
| **`/advice`** | Consult **one** advisor 1:1 in their voice, with follow-ups, grounded in a pack of their positions most relevant to *your* decision and with every quote verified before you see it. Name them, or let it suggest the most relevant. Also manages the roster: `add` a new advisor (researched from their public work), `feed` new material into one, or `list` the council. |
| **`/second-opinion`** | A dissenting view from a **different** advisor — one chosen because they'd likely disagree with the first — to challenge a recommendation. |
| **`/boardroom`** | Convenes a **debate**: recommends which advisors belong in the room for *your* problem, seats each as its own agent, runs a structured meeting where they challenge each other, and hands you minutes (recommendation, dissents, what would change their mind). `/boardroom sweep` polls the **whole council** first and maps where everyone lands. |

Typical flow: `/frame` → `/advice` (or `/boardroom`) → `/second-opinion` to pressure-test the answer.

## Install

```bash
git clone https://github.com/mariomarcoccia/advisors.git ~/advisors
cd ~/advisors && ./install.sh
```

`install.sh` is idempotent. It:
- links each skill in `skills/` into `~/.claude/skills/` so each becomes a `/command`, and
- links the shared data (`advisors/`, `reference/`, `index/`, `tools/`) into `~/.advisors/` and creates `~/.advisors/state/` for your decisions, and
- installs the `council` CLI (needs Node 22.18+), which indexes the dossiers, ranks them for each decision, and verifies citations.

Optional but recommended: set `TYPESAFE_API_KEY` ([get one](https://console.typesafe.ai/keys)) so [Jev](https://docs.typesafe.ai/introduction) ranks advisors and dossier content for each decision. Without it the CLI falls back to keyword (BM25) ranking.

Then, in Claude Code: `/frame` to start, or `/advice list` to see who's on the board.

## How a dossier is built

Each advisor is one markdown file in [`advisors/`](advisors/) with structured frontmatter and sections for their core beliefs, mental models, decision heuristics, signature (and contrarian) positions, voice, and — importantly — their **blind spots and critiques**, so the simulation argues honestly instead of fawning. The schema lives in [`reference/persona-template.md`](reference/persona-template.md); the fidelity-and-ethics rules in [`reference/voice-guide.md`](reference/voice-guide.md).

## How the council reads 49 dossiers without drowning

The dossiers add up to roughly 730k tokens; a single one can be 30k. Loading whole dossiers caps a reflection at three to five voices, so the skills don't:

1. **Cards.** `council index` splits every dossier into ~5,600 self-contained, citable cards (a position, heuristic, worked example, quote, disagreement, or blind spot), plus a graph of who documented disagreeing with whom. The index is committed in [`index/`](index/).
2. **Ranking with Jev.** `/frame` writes an anonymized English abstract of your decision (your private brief never leaves your machine). [Jev](https://docs.typesafe.ai/introduction), TypeSafe's typed decision model, scores every advisor and every card against it: cheap and fast enough to score the whole council per decision. Selection also rewards covering each tension and seating documented opponents.
3. **Packs.** Each consulted advisor gets a token-budgeted pack: their summary, bio, and voice, plus the cards that bear most on your decision, always including their top blind spots. Typically about a quarter of the dossier.
4. **Agents per seat.** In `/boardroom`, each member reasons in its own agent with its own pack, so the chair only holds what members said. That is what makes a whole-council sweep possible.
5. **Verified citations.** Every answer cites cards by id, and `council verify` checks every quoted line against the dossier before you see it. A fabricated or misattributed quote fails the check.

Retrieval quality is measured, not assumed: see [`evals/`](evals/).

Grow the board anytime with `/advice add "<anyone>"`, or enrich an advisor with `/advice feed <name> <links or pasted transcripts>`.

## Starter council

49 advisors across YC partners, SaaS and fintech operators, Brazilian retail and brand builders, AI lab founders, a leading venture voice, authors of a few foundational business books, and some of the most consequential operators and investors alive:

Paul Graham · Michael Seibel · Nicolas Dessaigne · Reid Hoffman · Dalton Caldwell · Garry Tan · Ben Horowitz · Naval Ravikant · James Clear · Carol S. Dweck · Reed Hastings · Ryan Breslow · Jason Lemkin · Pedro Franceschi · Harry Stebbings · James Hawkins · Guilherme Horn · Rony Meisler · Caito Maia · Luiza Helena Trajano · Frederico Trajano · Alexandre Birman · Alexandre Ostrowiecki · Miguel Krigsner · Antônio Luiz Seabra · Paulo Corrêa · Jonas Marques Neto · Roberto Jatahy · Manoel Conde Neto · Stéphane Maquaire · Paulo Nassar · Denis Benchimol Minev · Rodrigo Vidigal · Dario Amodei · Daniela Amodei · Jack Clark · Chris Olah · Tom Brown · Sam Altman · Jeff Bezos · Elon Musk · Mark Zuckerberg · Jensen Huang · Warren Buffett · Larry Ellison · Bernard Arnault · Larry Page · Sergey Brin · Alice Walton

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
