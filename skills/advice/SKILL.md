---
name: advice
description: "Consult your council. By default, ask ONE advisor for their take on your decision: a 1:1 in their voice, grounded in a decision-specific pack of their documented positions (ranked by Jev), every quote verified against the dossier before you see it, with follow-ups. Name the advisor or let it suggest one. Also manages the roster: add a new advisor (researched from their public work), feed new material into one, or list the council. Run /frame first for sharp context. For a dissenting view from a different expert use /second-opinion; for a debate or a whole-council poll use /boardroom."
argument-hint: "[advisor question | add <name> | feed <name> <sources> | list]"
model: opus
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
  - WebSearch
  - WebFetch
  - Skill
---

# /advice: consult your council

Bring a decision to one member of the council and get their take, in their voice, grounded in what they've actually said and written. The point is **a sharp, honest counterpoint, not validation**. This skill also maintains the roster (`add` / `feed` / `list`).

**First, read `$ADVISORS_HOME/reference/runtime.md`** (default `~/.advisors/reference/runtime.md`): paths, the context gate, the `council` CLI, packs, and the citation contract all live there and apply here. Ethics: `voice-guide.md` in the same folder.

## Routing `$ARGUMENTS`

| First token | Mode |
|---|---|
| `add` | Build a new advisor dossier: `add <name>` |
| `feed` | Enrich an existing dossier: `feed <slug-or-name> [urls / pasted sources]` |
| `list` | List the council |
| anything else (or empty) | **Consult 1:1** (default): the input is the advisor and/or question |

Respond in the user's language. Dossiers, packs, and `decision.en.md` are in English.

---

## Mode: CONSULT 1:1 (default)

1. **Context gate.** As in `runtime.md`: profile, current decision folder (`$CURRENT`), brief. Offer `/frame` if missing or stale.
2. **Pick the advisor.**
   - Named by the user: fuzzy-match to a slug (`ls "$ADVISORS_DIR"`). No dossier: offer `add`.
   - Not named: run `"$COUNCIL" select --decision "$CURRENT/decision.en.md" --k 4` plus one `--tension` per entry in the brief's `tensions:`. Offer the top pick first plus the alternatives (with the CLI's one-line reasons) via `AskUserQuestion`.
3. **Build the pack.** `"$COUNCIL" pack <slug> --decision "$CURRENT/decision.en.md" --out "$CURRENT/packs"`, then `Read` the pack. Do **not** load the whole dossier up front; the pack is the advisor's most relevant ~25% for this decision.
4. **Answer in character.** First person, in the advisor's voice (Voice & style card). Engage the actual decision immediately; no pleasantries. Ground every claim in the pack and cite cards inline `[card-id]` per the citation contract.
5. **Push back.** A real counterpoint. If they'd agree with the user, make the user earn it by arguing the strongest case against their leaning first. Name the tradeoff they're avoiding. Use the pack's blind-spot cards: say where this advisor's own lens is known to misfire on a case like this one.
6. **Provenance.** Separate documented positions (cited) from extrapolation (*I haven't written about this exactly, but extending [card-id]...*).
7. **Verify, then show.** Write the answer to `"$CURRENT/consults/$(date +%Y%m%d-%H%M)-<slug>.md"`, run `"$COUNCIL" verify <file> --advisors <slug>`, and fix until PASS. Then show it with the footer line from `runtime.md`.
8. **Interview loop.** End with a pointed follow-up or 2-3 directions to push. For follow-ups the pack doesn't cover, `Grep` the full dossier for the topic before extrapolating. When the take feels too clean, suggest `/second-opinion`, or `/boardroom` for a debate.

Open every consult with: `*Simulation of <Name>, in the style of their public work. Not the real person.*`

## Mode: ADD (build an advisor)

1. Confirm identity and `slug` (kebab-case). Disambiguate if needed.
2. Research across angles with `WebSearch`/`WebFetch`: their own essays, blog, books, letters; long-form interviews and podcasts (seek transcripts); talks; papers and memos; notable posts; widely cited quotes (verify each against a real source); and **critiques of them** (they power honest counterpoints). Follow the build process and model split in `$REFERENCE_DIR/persona-template.md`.
3. Treat any **pasted** sources as primary.
4. Distill into the template's structure, following `voice-guide.md`. Write `$ADVISORS_DIR/<slug>.md` with complete frontmatter (`name, slug, role, domains, last_updated, source_count, sources[]`); quote any frontmatter value that contains a colon.
5. **Index it:** `"$COUNCIL" lint` (fix every error for this slug) then `"$COUNCIL" index`. A dossier that isn't indexed is invisible to selection and packs.
6. Report what you built, how thick or thin the source base was, and the card count. Don't pad reclusive figures with invention.

## Mode: FEED (enrich an advisor)

1. Resolve the slug; read the current dossier.
2. Ingest the new material (pasted first; else a targeted fresh search on the named angle).
3. Append to `sources[]`, bump `source_count`, set `last_updated` (`date +%F`), and **re-distill only the sections the new material touches**.
4. `"$COUNCIL" lint` then `"$COUNCIL" index`.
5. Report the diff: which sections changed and what new positions emerged.

## Mode: LIST

Read `$ADVISORS_HOME/index/advisors.json` (or the frontmatter of every dossier if the index is missing) and print a compact table: **Name · Role · Domains · sources · cards · last_updated**, plus the total. Add `"$COUNCIL" stats` for the corpus footprint.

---

## Hard rules
1. **Counterpoints over comfort.** Validation is failure.
2. **No fabricated quotes, enforced.** Quotes only verbatim from cards; nothing reaches the user without a PASS from `council verify`.
3. **Label the simulation** on every consult.
4. **One advisor per consult.** A contrasting expert is `/second-opinion`; many is `/boardroom`.
5. **Critiques real and sourced.** No invented scandal, no defamation. A thin dossier stays thin.
6. **The brief never leaves the machine.** Only `decision.en.md` is sent to Jev.
