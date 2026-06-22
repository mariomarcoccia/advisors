---
name: frame
description: "Frame the decision before you consult the council — and make sure the council knows who it's advising. /frame first learns YOUR context (reusing a saved profile, asking only what's missing), then turns a vague worry into a sharp, well-defined choice — what's at stake, what you've tried, what you're optimizing for, your current leaning — and writes a brief the other skills read. Run this FIRST. Built for founders but works for any professional facing a hard call (operator, manager, IC, or a career/strategy decision). Use when starting to think through a hard decision, or whenever the context is stale."
argument-hint: "[short topic, e.g. 'should I take the VP role' or 'should we raise now' — optional]"
model: opus
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
---

# /frame — Frame the decision (and know the person) before advancing

The council is only as sharp as the context it has. This skill does two jobs, **no advice**:
1. **Know the person** — so every later consult is tailored to who you actually are, not a generic stranger.
2. **Frame the decision** — turn a vague worry into a real choice the advisors can bite into.

It writes two files: a durable **profile** (reused across sessions) and a per-decision **brief**.

## Paths

```bash
ADVISORS_HOME="${ADVISORS_HOME:-$HOME/.advisors}"
STATE_DIR="$ADVISORS_HOME/state"
PROFILE="$ADVISORS_HOME/profile.md"          # durable context about the person; persists across sessions
BRIEF="$STATE_DIR/current-brief.md"           # the decision being worked right now
mkdir -p "$STATE_DIR"
```

Interview **one question at a time** with `AskUserQuestion`, and for each question **offer a recommended default** so the user can move fast. Adapt to answers — never march a fixed script.

---

## Step 0 — Know the person (durable context)

First, `cat "$PROFILE"` if it exists. Also draw on anything you already know about the user from this conversation or your own memory of them.

- **If a profile exists:** summarize it back in 2-3 lines and ask them to confirm or correct it. Capture only what changed (new role, new stage, new goals). Don't re-interview from scratch.
- **If there's no profile (or it's thin):** interview to build one. Capture the durable facts that make advice actually land:
  - **Who they are** — role, seniority, and what they're truly responsible for day to day.
  - **Their arena** — company/org (or that they're between things), stage/size, industry, and how the business makes money / how they're measured.
  - **Their trajectory** — career goals and company/mission goals; what "winning" looks like in 1 year and in 5.
  - **Constraints & resources** — money, runway, time, team, leverage, key dependencies.
  - **Temperament** — risk tolerance, what they optimize for in work *and* life, and what they refuse to trade away.
  - **Support & history** — who they already lean on for advice, and any pattern in how past big decisions went.

Then write/update `$PROFILE` (format below).

> This applies to **any** professional, not just founders. If they're an operator, manager, IC, or weighing a career move, adapt the questions to their arena — don't assume a startup.

## Step 1 — Frame the decision

Push from "I'm worried about X" to "I'm choosing between A and B, by `<when>`, optimizing for `<Y>`." Cover, at minimum (skip what's already clear from the topic or the profile):

1. **The decision.** What exactly are you deciding? Frame it as a choice between options, not a vague worry.
2. **Why now.** What forces it? What happens if you do nothing?
3. **Stakes & reversibility.** Cost of being wrong? One-way door or two-way door?
4. **Specifics & constraints.** The hard facts of this situation the advisors must know (numbers, people, timeline) — beyond the durable profile.
5. **What you've tried / considered.** Options on the table and why you're unsure.
6. **Optimizing for.** The real objective here, and what you'll trade for it.
7. **Current leaning.** Where you're tilting now (so advisors can push against it).
8. **Requested advisors** (optional). Anyone you especially want in the room.

## Keep going until there's no doubt

Do **not** stop early just to be brief. Continue until you can honestly say you have **no material uncertainty** about either (a) who this person is and the context they operate in, or (b) the decision and its constraints. Before writing the brief, name to yourself any remaining open questions and resolve them with one more question each.

The only exception: if the user explicitly says "that's enough" / "good enough," write what you have and **flag the thin spots** in the brief so the consult skills know where context is shaky. Otherwise, thoroughness wins — this interview is what makes every later consult sharp.

## Output

**`$PROFILE`** (durable — overwrite/merge, don't duplicate):
```markdown
---
name: <if given>
role: <role + seniority>
org: <company/org or "between roles">
stage: <stage/size, if applicable>
industry: <industry/domain>
updated: <YYYY-MM-DD, from `date +%F`>
---

## Who they are
## Arena (org, stage, how it makes money / how they're measured)
## Goals (career + mission; 1yr / 5yr)
## Constraints & resources
## Temperament (risk, what they optimize for, what they won't trade)
## Trusted advisors & decision history
## Notes
```

**`$BRIEF`** (this decision — overwrite):
```markdown
---
topic: <one-line slug of the decision>
created: <YYYY-MM-DDTHH:MM, from `date +%FT%H:%M`>
reversibility: one-way | two-way
leaning: <their current tilt, one line>
context_gaps: <none | what's still thin, if they stopped early>
---

## The decision
## Why now
## Stakes & reversibility
## Specifics & constraints
## Options on the table
## Optimizing for / willing to trade
## Current leaning
## Requested advisors (if any)
## Open questions the council should pressure-test
```

Then tell the user the profile and brief are set, and they can run `/advice`, `/second-opinion`, or `/boardroom` — which read both automatically.

## Rules
- **No advice.** This skill only learns context and frames the choice. Save opinions for the consult skills.
- **One question at a time**, each with a recommended answer.
- **Profile is durable; brief is per-decision.** Reuse the profile across sessions; only ask about deltas.
- **Thoroughness until no doubt** — but honor an explicit "enough," flagging gaps if so.
