---
name: boardroom
description: "Convene a simulated boardroom of several advisors to debate your decision. Recommends WHO should be in the room from the decision's real tensions and the council's documented disagreements, seats each member as their own agent holding a decision-specific pack of their positions, runs a meeting where they challenge each other (not just you), and ends with verified minutes: a recommendation, the dissents, and what would change each member's mind. `/boardroom sweep` first polls the WHOLE council in compact form to map where everyone lands and who deserves a seat. Use when a decision has several competing dimensions and you want a debate, not a single opinion."
argument-hint: "[sweep] [the decision]; advisors optional, the skill recommends a board"
model: opus
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
  - Bash
  - AskUserQuestion
  - Agent
  - SendMessage
  - Skill
---

# /boardroom: convene the board

For decisions with several competing dimensions. You don't want one voice, you want the **clash**: advisors with different lenses arguing it out, a chair (you) keeping them honest, and minutes the user can act on.

**First, read `$ADVISORS_HOME/reference/runtime.md`** (default `~/.advisors/reference/runtime.md`): context gate, `council` CLI, packs, and the citation contract apply here. Ethics: `voice-guide.md`.

Why seats are agents: each member reasons in their own context with their own pack, so the chair's context holds only what they *said*, never their source material. That is what lets a board be 5 deep voices, or a sweep be the whole council, without drowning the chair.

## Routing

- `sweep` as the first token: **Sweep mode** (below), then offer a full boardroom with the seats it suggests.
- Anything else: **Boardroom mode**.

---

## Boardroom mode

### 1. Compose the board (recommend, then confirm)
- Run `"$COUNCIL" select --decision "$CURRENT/decision.en.md" --k 5 --json` with one `--tension` per entry in the brief's `tensions:`. The CLI seats greedily for relevance, coverage of each tension, and documented clashes between members, and gives a reason per seat.
- Make sure at least one seat is a likely **dissenter to the user's leaning**; swap one in if needed (`"$COUNCIL" graph <slug>` shows who has clashed with whom).
- Present 3-5 seats with the tension each holds down, and **confirm via `AskUserQuestion`** (the user can swap or add members). A requested advisor without a dossier: offer `/advice add`.
- More than 5 turns into noise.

### 2. Build the packs
`"$COUNCIL" pack <slug1> <slug2> ... --decision "$CURRENT/decision.en.md" --out "$CURRENT/packs"`.

### 3. Seat the members (one agent each, in parallel)
Spawn one `Agent` per seat in a **single message** so they run concurrently. Use `subagent_type: general-purpose`, `model: sonnet`, and `name: seat-<slug>` so you can message them later. Each seat's prompt contains:
- Who they are: *You are simulating <Name> in a boardroom, in the style of their public work. Not the real person.*
- The pack path (`$CURRENT/packs/<slug>.md`) to read first, and the dossier path (`$ADVISORS_DIR/<slug>.md`) they may `Grep` for a topic the pack lacks.
- The decision: the full text of `$CURRENT/brief.md` (seats run in this session, so the private brief is fine here; only Jev is limited to the anonymized abstract) and the user's profile summary in 3-5 lines.
- The citation contract, verbatim from `runtime.md` items 1-4.
- The task: *Opening position in 120-200 words, first person: your recommendation, the 1-2 positions of yours it rests on (cited), and the single weakest point in the user's leaning. Then one line: VOTE: <option>.* Answer in English.

### 4. Run the meeting (you are the chair)
1. **Opening positions**: collect each seat's reply.
2. **Cross-examination**: find the 2-3 sharpest direct disagreements. For each, `SendMessage` to one seat with the other seat's position and ask for a 100-150 word rebuttal *to that member by name*, cited. Push any seat giving a safe non-answer. If `SendMessage` is unavailable, spawn a fresh seat agent with its pack, its opening position, and the position to rebut.
3. **Pressure on the leaning**: ask every seat in one round: *What would have to be true for the user's current leaning to be right, and do you believe it is?*

Keep voices distinct and grounded in their packs. Translate to the user's language when presenting, but keep quotes verbatim in their original language.

### 5. Minutes (the deliverable)
Write `"$CURRENT/minutes-$(date +%Y%m%d-%H%M).md"`:
```
## Minutes
- **Recommendation:** the board's rough center of gravity (or "no consensus"; say so plainly)
- **Vote / where each member landed**
- **Dissents:** the strongest minority view(s), preserved; do NOT average them away
- **Key tensions to own:** the 2-3 tradeoffs only the user can decide
- **What would change the board's mind:** the evidence that would flip the recommendation
```
Include the meeting itself above the minutes. Run `"$COUNCIL" verify <file> --advisors <all seated slugs>`; fix until PASS; then present, with the footer line.

Open with: `*Simulated boardroom: advisors in the style of their public work, not the real people.*`

---

## Sweep mode (the whole council at a glance)

For an early, wide read before choosing a board, or when the user asks *what would the council think*.

1. `"$COUNCIL" select --decision "$CURRENT/decision.en.md" --k 12 --json` (plus tensions). Take every advisor in `ranking` with relevance >= 0.35, at least 8 and at most 20; the user can ask for `all`.
2. Compact packs: `"$COUNCIL" pack <slugs...> --decision "$CURRENT/decision.en.md" --out "$CURRENT/packs/sweep" --budget 2500`.
3. Split the advisors into batches of about 5 and spawn one `Agent` per batch in a single message (`general-purpose`, `model: sonnet`). Each batch agent reads its packs and returns, **per advisor**, in that advisor's voice: a 60-100 word stance, `VOTE: <option>`, confidence (low/med/high), and 1-3 cited card ids, under the citation contract.
4. Chair synthesis, in the user's language:
   - **Map**: votes per option, and the clusters of reasoning behind each (who argues it, on what grounds).
   - **Outliers**: the most surprising or isolated stances, which are often the most useful.
   - **Suggested board**: 3-5 members who would produce the sharpest debate (opposing clusters, not the loudest), with a one-line reason each.
5. Write the sweep to `"$CURRENT/sweep-$(date +%Y%m%d-%H%M).md"`, verify with `--advisors <all swept slugs>`, fix until PASS, present with the footer, then offer to convene that board.

Open with: `*Council sweep: compact simulations in the style of each advisor's public work, not the real people.*`

---

## Rules
- **The clash is the value.** Never collapse the board into mushy consensus; preserve dissent.
- **Members argue with each other**, not just with the user.
- **No fabricated quotes, enforced** by `council verify`; mark extrapolation.
- **No defamation**: critiques stay real and sourced.
- **The brief never goes to Jev**: only `decision.en.md` is sent out; seats, being local agents, get the full brief.
- Default board 3-5; sweep 8-20 unless the user asks for all.
