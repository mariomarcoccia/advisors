---
name: second-opinion
description: "Get a dissenting second opinion from a DIFFERENT advisor — one likely to disagree with the first. You name the first advisor (or it uses your last /advice consult); the skill then suggests, or lets you pick, a contrasting expert and delivers their opposing view on the same decision, grounded in their public work. Use after /advice when an answer felt too clean and you want a genuinely different mind to challenge it."
argument-hint: "[first-advisor] [topic] — optionally name the second advisor too"
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

# /second-opinion — A dissenting view from a different advisor

You got one advisor's take. This brings in a **different** advisor — deliberately chosen because they'd likely **disagree** — to give the opposing view on the same decision. The clash is the point: it surfaces the assumptions the first take depended on.

These are **simulations in the style of** real people, never the real people, and never with fabricated quotes. See `$REFERENCE_DIR/voice-guide.md`.

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

Read `$PROFILE` if it exists — it tells you who you're advising (role, arena, what they optimize for); tailor the dissent to them. Then read `$BRIEF` if present. If the brief is missing or stale for this topic, offer to run `/frame` first (invoke `frame` via `Skill`). The user may skip — note the thin context if so.

## How it works

### 1. Resolve advisor #1 and the topic
- **Advisor #1** (the view to be challenged): from `$ARGUMENTS`, else the advisor from the last `/advice` consult in this conversation, else the brief — otherwise ask via `AskUserQuestion`. Fuzzy-match name → slug in `$ADVISORS_DIR`.
- **Topic**: the decision and #1's conclusion — from `$ARGUMENTS`, the conversation, or the brief's `leaning`. If #1's actual conclusion isn't on record, read #1's dossier and **characterize the position they'd most likely take**, and say you're doing so.

### 2. Choose advisor #2 (the dissenter)
- Read the frontmatter (`name`, `role`, `domains`) of every `$ADVISORS_DIR/*.md`.
- Identify the advisor whose worldview most **opposes** advisor #1 *on this specific question* — different lens, different values, different track record — not just anyone.
- **Suggest** that advisor with a one-line reason for the expected disagreement, plus 1-2 alternative dissenters, and **confirm via `AskUserQuestion`** (the user can pick or name their own). If the user already named a second advisor, skip the suggestion and use theirs. If the chosen advisor has no dossier, offer `/advice add`.

### 3. Deliver the dissent
- Load advisor #2's full dossier. Answer in **their** first-person voice.
- Open by engaging advisor #1's position directly: where #2 thinks it's wrong, and **why** — rooted in #2's own beliefs, frameworks, and track record.
- Make the strongest opposing case (steelman, not strawman). Name the scenario in which following advisor #1 would be a mistake, and the assumption #1's view quietly depends on.
- Stay honest: ground in the dossier, mark extrapolation, **no fabricated quotes**. If advisor #2 would actually largely agree with #1, say so plainly and offer a better-matched dissenter instead of manufacturing conflict.

### 4. Close
- The single strongest reason advisor #1 might still be right.
- The one piece of evidence that would settle the disagreement.
- Optionally suggest `/boardroom` if the user wants more voices in the room.

Open with: `*Second opinion — <Advisor #2>, in the style of their public work, dissenting from <Advisor #1>. Not the real people.*`

## Hard rules
1. **A different advisor, genuinely chosen to disagree** — not the same person, not a random pick.
2. **Steelman the dissent.** The opposing case must be the strongest one, argued in good faith.
3. **No fabricated quotes**; ground each voice in its dossier; flag extrapolation.
4. **Don't manufacture conflict.** If there's no real disagreement, say so and re-pick.
5. **No defamation** — critiques stay real and sourced.
