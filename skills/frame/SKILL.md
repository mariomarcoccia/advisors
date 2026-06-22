---
name: frame
description: "Frame the decision before you consult the council. Interviews you to turn a vague worry into a sharp, well-defined choice — what's really at stake, what you've tried, what you're optimizing for, and your current leaning — then writes a brief the other skills read. Run this FIRST, at the start of a session, before /advice, /second-opinion, or /boardroom. Use when starting to think through a hard decision, or whenever the context brief is stale."
argument-hint: "[short topic, e.g. 'should we raise now' — optional]"
model: opus
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
---

# /frame — Frame the decision before advancing

The council is only as sharp as the context it has. Before any consult, this skill interviews you, **frames the decision as a real choice**, and writes a **brief** the other skills read. No advice here — just disciplined framing.

## Paths

```bash
COUNCIL_HOME="${COUNCIL_HOME:-$HOME/.council}"
STATE_DIR="$COUNCIL_HOME/state"
BRIEF="$STATE_DIR/current-brief.md"
mkdir -p "$STATE_DIR"
```

## How it works

Interview the user **one question at a time** (like a good board chair prepping for a meeting), and for each question **offer a recommended default** so they can move fast. Use `AskUserQuestion`. Adapt follow-ups to their answers — don't robotically march through a script. If `$ARGUMENTS` names a topic, start there.

The core move is **framing**: push the user from "I'm worried about X" to "I'm choosing between A and B, by <when>, optimizing for <Y>." Cover, at minimum, this decision tree (skip what's already obvious from a provided topic or an existing brief):

1. **The decision.** What exactly are you deciding? Frame it as a choice between options, not a vague worry.
2. **Why now.** What forces the decision? What happens if you do nothing?
3. **Stakes & reversibility.** What's the cost of being wrong? Is this a one-way door or a two-way door?
4. **Context.** Stage, constraints (money, time, people), and any hard facts the advisors must know.
5. **What you've tried / considered.** Options already on the table, and why you're unsure.
6. **What you're optimizing for.** The real objective — and what you're willing to trade away.
7. **Your current leaning.** Where you're tilting right now (so advisors can push against it).
8. **Who you trust on this** (optional). Any advisor you especially want in the room.

Stop when you have enough to give an advisor real purchase on the problem — usually 5-8 exchanges. Don't pad.

## Output

Write `$BRIEF` (overwrite) with this structure:

```markdown
---
topic: <one-line slug of the decision>
created: <YYYY-MM-DDTHH:MM, from `date +%FT%H:%M`>
reversibility: one-way | two-way
leaning: <their current tilt, one line>
---

## The decision
## Why now
## Stakes & reversibility
## Context & constraints
## Options on the table
## Optimizing for / willing to trade
## Current leaning
## Requested advisors (if any)
## Open questions the council should pressure-test
```

Keep it tight — a board brief, not a memoir. Then tell the user the brief is set and they can now run `/advice`, `/second-opinion`, or `/boardroom`, which will read it automatically.

## Rules
- **No advice.** This skill only frames and gathers context. Save opinions for the consult skills.
- **One question at a time**, each with a recommended answer.
- **Respect "good enough."** If the user says they've given enough, write the brief and stop.
