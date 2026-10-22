---
name: frame
description: "Frame the decision before you consult the council, and make sure the council knows who it's advising. /frame first learns YOUR context (reusing a saved profile, asking only what's missing), then turns a vague worry into a sharp choice: what's at stake, what you've tried, what you're optimizing for, your current leaning, and the 2-4 tensions the advisors should fight over. It writes a private brief plus an anonymized English abstract that powers advisor selection and retrieval. Run this FIRST. Built for founders but works for any professional facing a hard call (operator, manager, IC, career or strategy decision). Use when starting to think through a hard decision, or whenever the context is stale."
argument-hint: "[short topic, e.g. 'should I take the VP role' or 'should we raise now'; optional]"
model: opus
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
---

# /frame: frame the decision (and know the person) before advancing

The council is only as sharp as the context it has. This skill does two jobs and gives **no advice**:
1. **Know the person**, so every later consult is tailored to who they actually are.
2. **Frame the decision**, so the advisors have a real choice to bite into.

Read `$ADVISORS_HOME/reference/runtime.md` (default `~/.advisors/reference/runtime.md`) for paths and the decision-folder layout. This skill writes the durable `profile.md` and one decision folder.

Interview **one question at a time** with `AskUserQuestion`, each with a **recommended default** so the user can move fast. Adapt to answers; never march a fixed script.

---

## Step 0: know the person (durable)

`cat "$PROFILE"` if it exists. Also use what you already know about the user from this conversation or your memory of them.

- **Profile exists:** summarize it in 2-3 lines and ask them to confirm or correct. Capture only deltas (new role, stage, goals).
- **No profile (or thin):** interview to build one:
  - **Who they are**: role, seniority, what they own day to day.
  - **Their arena**: company/org (or between things), stage/size, industry, how the business makes money or how they're measured.
  - **Trajectory**: career and mission goals; what winning looks like in 1 and 5 years.
  - **Constraints & resources**: money, runway, time, team, leverage, key dependencies.
  - **Temperament**: risk tolerance, what they optimize for in work and life, what they refuse to trade.
  - **Support & history**: who they lean on, and patterns in how past big decisions went.

This applies to **any** professional. Don't assume a startup.

## Step 1: frame the decision

Push from *I'm worried about X* to *I'm choosing between A and B, by when, optimizing for Y*. Cover (skip what's already clear):

1. **The decision**, framed as a choice between options.
2. **Why now**: what forces it; what happens if they do nothing.
3. **Stakes & reversibility**: cost of being wrong; one-way or two-way door.
4. **Specifics & constraints**: the hard facts (numbers, people, timeline) beyond the profile.
5. **What they've tried / considered**, and why they're unsure.
6. **Optimizing for**: the real objective, and what they'll trade for it.
7. **Current leaning**, so advisors can push against it.
8. **Tensions**: propose the 2-4 core tensions you hear (e.g. *speed vs. durability*, *harvest cash vs. bet on a new market*, *control vs. capital*) and let the user edit them. They decide who gets seated.
9. **Requested advisors** (optional).

## Keep going until there's no doubt

Don't stop early to be brief. Continue until you have **no material uncertainty** about (a) who this person is and their context, and (b) the decision and its constraints. Before writing, name any open questions to yourself and resolve each with one more question.

Exception: if the user says *that's enough*, write what you have and **flag the thin spots** in `context_gaps`.

## Output

Pick a kebab-case `<slug>` for the decision. Then:

```bash
DEC="$ADVISORS_HOME/state/decisions/<slug>"
mkdir -p "$DEC/packs" "$DEC/consults"
ln -sfn "$DEC" "$ADVISORS_HOME/state/current"
```

**`$PROFILE`** (durable; merge, don't duplicate):
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

**`$DEC/brief.md`** (private, the user's language):
```markdown
---
topic: <one-line description of the decision>
created: <YYYY-MM-DDTHH:MM, from `date +%FT%H:%M`>
reversibility: one-way | two-way
leaning: <their current tilt, one line>
tensions:
  - <tension 1>
  - <tension 2>
context_gaps: <none | what's still thin>
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

**`$DEC/decision.en.md`** (the only text that leaves the machine: Jev scores advisors and dossier cards against it):
```markdown
---
topic: <same one-line topic, in English>
---
<120-350 words of plain English: the situation, each option, the constraints, what they optimize for, the leaning, and the tensions.>
```

Rules for the abstract:
- **English** (Jev's strongest language; the dossiers are English too), even when the brief isn't.
- **Anonymized**: no person or company names, no exact amounts, no URLs, emails, or ids. Use roles and buckets (*a two-founder B2B company*, *about a year of personal runway*, *low single-digit millions in annual revenue*).
- **Decision-dense**: every sentence about the choice, its options, constraints, or tradeoffs. Background that wouldn't change the advice stays in the brief; extra text dilutes retrieval.

Then check it: `"$COUNCIL" check "$DEC/decision.en.md"`. Until it prints `ok`, rewrite the abstract (remove what it flags) and re-check.

Finally tell the user the profile and decision are set, and that `/advice`, `/second-opinion`, and `/boardroom` (including `/boardroom sweep` to poll the whole council) read them automatically.

## Rules
- **No advice.** Only context and framing.
- **One question at a time**, each with a recommended answer.
- **Profile is durable; a decision folder is per decision.** Reuse the profile; ask only about deltas.
- **Nothing identifying in `decision.en.md`.** The brief stays private; the abstract is what gets sent out.
- **Thoroughness until no doubt**, but honor an explicit *enough*, flagging gaps.
