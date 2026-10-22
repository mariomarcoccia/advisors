---
name: second-opinion
description: "Get a dissenting second opinion from a DIFFERENT advisor, one likely to disagree with the first. You name the first advisor (or it uses your last /advice consult); the skill finds members with a documented disagreement with them (the council's disagreement graph) and ranks them for your decision, then delivers the strongest opposing view, grounded in a decision-specific pack and with every quote verified. Use after /advice when an answer felt too clean and you want a genuinely different mind to challenge it."
argument-hint: "[first-advisor] [topic]; optionally name the second advisor too"
model: opus
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
  - Bash
  - AskUserQuestion
  - WebSearch
  - WebFetch
  - Skill
---

# /second-opinion: a dissenting view from a different advisor

You got one advisor's take. This brings in a **different** advisor, chosen because they'd likely **disagree**, to argue the opposing view on the same decision. The clash is the point: it surfaces the assumptions the first take depended on.

**First, read `$ADVISORS_HOME/reference/runtime.md`** (default `~/.advisors/reference/runtime.md`): context gate, `council` CLI, packs, and the citation contract apply here. Ethics: `voice-guide.md`.

## How it works

### 1. Resolve advisor #1 and their position
- **Advisor #1**: from `$ARGUMENTS`, else the last `/advice` consult in this conversation, else the newest file in `$CURRENT/consults/`; otherwise ask via `AskUserQuestion`.
- **Their position**: from the conversation or that consult file. If #1's conclusion isn't on record, build #1's pack (`"$COUNCIL" pack <slug1> ...`) and characterize the position they'd most likely take, saying you're doing so.

### 2. Choose advisor #2 (the dissenter)
- **Documented clashes first:** `"$COUNCIL" graph <slug1>` lists members with a sourced disagreement with #1, with the card ids behind each.
- **Relevance second:** `"$COUNCIL" select --decision "$CURRENT/decision.en.md" --k 8 --exclude <slug1>` plus the brief's tensions.
- Prefer a member who is both on the graph list **and** relevant to this decision; a documented clash on an unrelated topic is not a dissent on this one. Read the graph labels to judge.
- **Suggest** your pick with a one-line reason for the expected disagreement (cite the graph card when there is one), plus 1-2 alternatives, and **confirm via `AskUserQuestion`**. If the user already named #2, use theirs. No dossier: offer `/advice add`.

### 3. Deliver the dissent
- `"$COUNCIL" pack <slug2> --decision "$CURRENT/decision.en.md" --out "$CURRENT/packs"`, then read it. Answer in **#2's** first-person voice.
- Open by engaging #1's position directly: where #2 thinks it's wrong and **why**, rooted in #2's cited positions, frameworks, and track record. If a graph card documents this exact clash, use it.
- Make the strongest opposing case (steelman, not strawman). Name the scenario in which following #1 would be a mistake, and the assumption #1's view quietly depends on.
- If #2 would actually largely agree with #1, say so plainly and offer a better-matched dissenter instead of manufacturing conflict.

### 4. Close
- The single strongest reason #1 might still be right.
- The one piece of evidence that would settle the disagreement.
- Optionally suggest `/boardroom` for more voices.

### 5. Verify, then show
Write it to `"$CURRENT/consults/$(date +%Y%m%d-%H%M)-<slug2>-vs-<slug1>.md"` and run `"$COUNCIL" verify <file> --advisors <slug2>,<slug1>` (quoting #1 to rebut them is allowed). Fix until PASS, then show it with the footer line.

Open with: `*Second opinion: <Advisor #2>, in the style of their public work, dissenting from <Advisor #1>. Not the real people.*`

## Hard rules
1. **A different advisor, genuinely chosen to disagree**: not the same person, not a random pick.
2. **Steelman the dissent.** The opposing case must be the strongest one, argued in good faith.
3. **No fabricated quotes, enforced** by `council verify`; mark extrapolation.
4. **Don't manufacture conflict.** No real disagreement: say so and re-pick.
5. **No defamation**: critiques stay real and sourced.
