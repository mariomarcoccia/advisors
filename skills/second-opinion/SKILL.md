---
name: second-opinion
description: "A contrarian re-take from a single advisor. Takes one expert (named, or the last one you consulted) and produces the OPPOSITE of their obvious advice — the 'alternative version' of them that steelmans the case against their own first instinct. Use when an advisor's answer felt too clean, when you want one expert to argue both sides, or when you got advice (from the council or elsewhere) and want it stress-tested by a single sharp mind."
argument-hint: "[advisor] [the advice or decision to challenge]"
model: opus
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
  - AskUserQuestion
  - WebSearch
  - WebFetch
  - Skill
---

# /second-opinion — The alternative version of one advisor

Every strong thinker contains their own counter-argument. This skill summons the **alternative version** of a single advisor: same person, same dossier, but deliberately arguing the side they'd be *least* likely to lead with — to stress-test a recommendation instead of confirming it.

## Paths

```bash
COUNCIL_HOME="${COUNCIL_HOME:-$HOME/.council}"
ADVISORS_DIR="$COUNCIL_HOME/advisors"
REFERENCE_DIR="$COUNCIL_HOME/reference"
STATE_DIR="$COUNCIL_HOME/state"
BRIEF="$STATE_DIR/current-brief.md"
```

## Context gate

Read `$BRIEF` if present. If it's missing or stale for this topic, offer to run `/frame` first (invoke `frame` via `Skill`). The user may skip — note the thin context if so.

## How it works

1. **Resolve the advisor and the target.**
   - Advisor: from `$ARGUMENTS`, else infer from the brief / last consult, else ask via `AskUserQuestion` (fuzzy-match name → slug in `$ADVISORS_DIR`). If no dossier, offer to `/council add` them.
   - Target view: the recommendation or decision to challenge — from `$ARGUMENTS`, the brief's `leaning`, or ask.
2. **Load the full dossier.** Read `<slug>.md` end to end so the alternative take stays *in character*, not a generic contrarian.
3. **Produce the alternative version.** In the advisor's own voice, argue the strongest case **against** the obvious/first take:
   - Use *their own* mental models and values turned toward the opposite conclusion — the version of them that would dissent.
   - Surface the assumptions the first take depends on, and where they're fragile.
   - Name the scenario in which the original advice is exactly wrong.
   - This is not a different person's view (that's `/boardroom`); it's the same mind, less comfortable.
4. **Stay honest.** Ground it in documented beliefs; mark extrapolation; **no fabricated quotes**. If the advisor genuinely has no plausible counter-position, say so — don't manufacture one.
5. **Close** with: the single strongest reason the original advice might still be right, and the one piece of evidence that would settle it.

Open with: `*Second opinion — the contrarian version of <Name>, in the style of their public work. A stress-test, not their settled view.*`

## Rules
- **Same advisor, opposite lean.** Stay inside their worldview; don't smuggle in someone else's.
- **No fabricated quotes.** Ground in the dossier.
- **Steelman, don't strawman.** The alternative take must be the *strongest* opposing case, argued in good faith.
- **No defamation.** Critiques stay real and sourced.
