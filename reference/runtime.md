# Council runtime (shared by /frame, /advice, /second-opinion, /boardroom)

Read this once per consult. It defines where things live, how context reaches an advisor, and how every answer is checked before the user sees it.

## Paths

```bash
ADVISORS_HOME="${ADVISORS_HOME:-$HOME/.advisors}"
ADVISORS_DIR="$ADVISORS_HOME/advisors"            # dossiers: <slug>.md (source of truth)
REFERENCE_DIR="$ADVISORS_HOME/reference"          # this file, persona-template.md, voice-guide.md
PROFILE="$ADVISORS_HOME/profile.md"               # durable context about the person being advised
DECISIONS="$ADVISORS_HOME/state/decisions"        # one folder per decision
CURRENT="$ADVISORS_HOME/state/current"            # symlink to the active decision folder
COUNCIL="$ADVISORS_HOME/tools/council/bin/council" # index, retrieval, verification CLI
```

A decision folder (`$CURRENT` resolves to one) holds:

| File | What | Leaves the machine? |
|---|---|---|
| `brief.md` | The full brief from /frame, in the user's language | Never |
| `decision.en.md` | Anonymized English abstract of the decision (no names, no amounts, no URLs) | Yes: Jev scores it |
| `packs/<slug>.md` | Decision-specific context pack per advisor | No |
| `consults/<timestamp>-<slug>.md` | Every delivered consult, verified | No |
| `minutes-<date>.md` | Boardroom minutes, verified | No |

If `$CURRENT` is missing but the legacy `$ADVISORS_HOME/state/current-brief.md` exists, treat it as the brief and offer `/frame` to migrate it (which writes `decision.en.md`).

## Context gate (every consult skill)

1. Read `$PROFILE` if it exists: who you're advising. Tailor every counterpoint to this person.
2. Resolve `$CURRENT`. If it is missing, or its `topic` doesn't match what the user is asking now, say so in one line and **offer `/frame`** (invoke `frame` via `Skill`). The user may say "skip frame": then write a minimal `decision.en.md` yourself from the conversation (anonymized, see below) into a new decision folder, and note the context is thin.
3. Read `brief.md`. Its frontmatter `tensions:` list feeds advisor selection.

## The council CLI

The CLI keeps the expensive part (reading whole dossiers) out of your context. Run it with Bash:

```bash
"$COUNCIL" select --decision "$CURRENT/decision.en.md" --k 5 --tension "speed vs. durability" --tension "..." [--exclude a,b] [--json]
"$COUNCIL" pack <slug> [<slug>...] --decision "$CURRENT/decision.en.md" --out "$CURRENT/packs" [--budget 6000]
"$COUNCIL" graph <slug>                       # documented disagreements with other members
"$COUNCIL" verify <answer.md> --advisors a,b  # quotes + card ids; exit 1 on any problem
"$COUNCIL" check "$CURRENT/decision.en.md"    # anonymized, English, decision-dense?
"$COUNCIL" stats                              # corpus footprint
```

- **Scorer.** With `TYPESAFE_API_KEY` set, ranking uses Jev (TypeSafe's typed decision model, pinned version). Without it the CLI says so on stderr and falls back to BM25; mention once that ranking quality is reduced.
- **Stale index.** If a command says the index is stale, run `"$COUNCIL" index` and retry.
- **Sensitive data.** `select`/`pack` refuse a decision text that contains amounts, emails, tax ids, phone numbers, or URLs, because it is sent to Jev. Fix `decision.en.md` (use buckets like "about a year of personal runway", "low single-digit millions in revenue"); never pass `--allow-sensitive` without the user's explicit OK.
- **CLI unavailable** (node missing, `$COUNCIL` not found): fall back to reading the full dossier for each advisor you voice, and tell the user once that the council runs in degraded mode (`install.sh` fixes it).

## What a pack is

A pack is the advisor's always-on core (Summary, Bio, Voice & style) plus the dossier cards that bear most on *this* decision, under a token budget, with at least the two most relevant blind spots and one documented disagreement. Each card has an id like `paul-graham/mm-8f0c81`.

- Speak from the pack first. When a follow-up goes beyond it, `Grep` the full dossier at `$ADVISORS_DIR/<slug>.md` for the topic, or rebuild the pack with a sharper `decision.en.md`. Read the whole dossier only as a last resort.
- A pack is a selection, not the person: if the decision touches something the pack lacks, say what you're extrapolating from.

## Citation contract (enforced, not hoped)

1. **Cite cards inline** as `[card-id]` after the sentence they support. Every documented position you attribute to the advisor gets one.
2. **Double quotation marks are only for the advisor's verbatim words**, copied from a card. Keep the original language inside the quotes; put a translation after it in brackets or as paraphrase, never inside the quotes.
3. Anything else (the user's words, labels, scare quotes, your paraphrase) uses *italics*, never double quotes.
4. **Mark extrapolation** explicitly ("I haven't written about this exactly, but extending [card-id]...").
5. **Verify before showing.** Write the answer to the decision folder, then run `"$COUNCIL" verify <file> --advisors <slugs voiced>`. On FAIL: remove or demote each flagged quote to a marked paraphrase, fix unknown ids, re-run until PASS. Never show an answer that failed verification.
6. End each delivered consult with one footer line: `Verified: <n>/<n> quotes · <k> cards cited · scorer <name> · pack ~<tokens> tokens`.

## Simulation label

Every consult opens with the label its skill specifies. These are simulations in the style of public work, never the real people. See `voice-guide.md` for the ethics.
