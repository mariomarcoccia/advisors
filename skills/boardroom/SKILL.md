---
name: boardroom
description: "Convene a simulated boardroom of several advisors to debate your decision. Recommends WHO should be in the room based on the problem's real tensions, runs a structured meeting where they challenge each other (not just you), and ends with minutes: a recommendation, the dissents, and what would change each member's mind. Use when a decision has multiple competing dimensions and you want a debate, not a single opinion."
argument-hint: "[the decision] — advisors optional; the skill recommends a board"
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

# /boardroom — Convene the board

For decisions with several competing dimensions. You don't want one voice — you want the **clash**: a room of advisors with different lenses arguing it out, a chair keeping them honest, and minutes you can act on.

## Paths

```bash
ADVISORS_HOME="${ADVISORS_HOME:-$HOME/.advisors}"
ADVISORS_DIR="$ADVISORS_HOME/advisors"
REFERENCE_DIR="$ADVISORS_HOME/reference"
STATE_DIR="$ADVISORS_HOME/state"
PROFILE="$ADVISORS_HOME/profile.md"            # durable context about the person
BRIEF="$STATE_DIR/current-brief.md"
```

## Context gate

Read `$PROFILE` if it exists — it tells the board who they're advising (role, arena, what they optimize for); the members should speak to *this* person, not a generic one. Then read `$BRIEF`. If the brief is missing or stale for this decision, **offer to run `/frame` first** (invoke `frame` via `Skill`) — a boardroom with no brief wastes everyone's time. User may skip; note thin context if so.

## How it works

### 1. Compose the board (recommend, then confirm)
- Read the frontmatter (`name`, `role`, `domains`) **and the `## Summary`** of every `$ADVISORS_DIR/*.md` — extract just those (the Summary is a 2-4 sentence digest for exactly this selection step; don't load full dossiers yet — those are loaded only for the advisors actually seated). If a dossier has no `## Summary`, fall back to its frontmatter.
- Identify the decision's **2-4 core tensions** (e.g. speed vs. durability, growth vs. focus, capital vs. discipline, product vs. distribution).
- Recommend **3-5 advisors** chosen to *cover and oppose* across those tensions — maximize productive disagreement, not seniority. Briefly justify each seat: which tension they hold down.
- Deliberately seat at least one likely **dissenter** to your `leaning`.
- Confirm the roster with `AskUserQuestion` (let the user swap members or add a requested advisor). If a desired advisor has no dossier, offer to `/advice add` them.

### 2. Run the meeting
Load each seated advisor's full dossier before speaking for them. Then run it as a real session, you (the model) acting as **chair**:
1. **Opening positions** — each member's stance in 2-4 sentences, in their own voice.
2. **Cross-examination** — members respond to *each other*, not just to the user. Surface the sharpest direct disagreements. The chair pushes anyone giving a safe non-answer.
3. **Pressure on the user's leaning** — the board collectively stress-tests where the user is currently tilting.

Keep voices distinct and grounded in each dossier. **No fabricated quotes**; mark extrapolation.

### 3. Minutes (the deliverable)
Close with:
```
## Minutes
- **Recommendation:** the board's rough center of gravity (or "no consensus" — say so plainly)
- **Vote / where each member landed**
- **Dissents:** the strongest minority view(s), preserved — do NOT average them away
- **Key tensions to own:** the 2-3 tradeoffs only the user can decide
- **What would change the board's mind:** the evidence that would flip the recommendation
```

Open with: `*Simulated boardroom — advisors in the style of their public work, not the real people.*`

## Rules
- **The clash is the value.** Never collapse the board into a mushy consensus; preserve dissent.
- **Members argue with each other**, not just the user.
- **No fabricated quotes**; ground every voice in its dossier; flag extrapolation.
- **No defamation** — critiques stay real and sourced.
- Default board size 3-5. More than 5 turns into noise.
