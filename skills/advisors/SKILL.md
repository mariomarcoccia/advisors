---
name: advisors
description: "Manage your council roster: add a new advisor (researched from their public work), feed new material into an existing one, or list the council. This skill builds and maintains the advisor dossiers — it does NOT give advice. To consult one advisor 1:1 use /advice; for a dissenting second view use /second-opinion; for a debate use /boardroom; to set context first use /frame."
argument-hint: "[add <name> | feed <name> <sources> | list]"
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

# /advisors — Manage your council roster

This skill maintains the **dossiers** that power the council — building new advisors from their public work, enriching existing ones, and listing who's on the board. It is the library/registry, not a consult. For advice, use `/advice`, `/second-opinion`, or `/boardroom`.

Every dossier is a **simulation in the style of** a real person, built only from public material — never the real person, never with fabricated quotes. See `$REFERENCE_DIR/voice-guide.md`.

## Paths (resolve once)

```bash
COUNCIL_HOME="${COUNCIL_HOME:-$HOME/.council}"
ADVISORS_DIR="$COUNCIL_HOME/advisors"        # dossiers: <slug>.md
REFERENCE_DIR="$COUNCIL_HOME/reference"       # persona-template.md, voice-guide.md
```

If `$ADVISORS_DIR` doesn't exist, the skill isn't installed — tell the user to run `install.sh` from the repo.

## Routing `$ARGUMENTS`

| First token | Mode |
|---|---|
| `add` | Build a new advisor dossier. `add <name>` |
| `feed` | Enrich an existing dossier. `feed <slug-or-name> [urls / pasted sources]` |
| `list` | List the current council |
| empty / anything else | Default to **list**, then ask whether they want to `add` or `feed` |

Respond in the user's language. The dossiers themselves are written in English.

---

## Mode: ADD (build an advisor)

1. Confirm identity + `slug` (kebab-case). Disambiguate if the name is ambiguous.
2. Research across angles with `WebSearch`/`WebFetch`: their own essays/blog/books/letters; long-form interviews & podcasts (seek transcripts); talks; papers/memos; notable posts; widely-cited quotes (verify each against a real source); and **critiques of them** (this powers honest counterpoints later). For a high-value advisor you may invoke `deep-research` via `Skill`.
3. Incorporate any **pasted** sources as primary.
4. Distill into `$REFERENCE_DIR/persona-template.md`'s structure, following `voice-guide.md`.
5. Write `$ADVISORS_DIR/<slug>.md` with complete frontmatter (`name, slug, role, domains, last_updated, source_count, sources[]`) and every section filled.
6. Report what you built and how thick/thin the source base was. Don't pad reclusive figures with invention — a thin dossier stays thin, with that noted in `source_count` and Provenance.

## Mode: FEED (enrich an advisor)

1. Resolve slug (fuzzy-match name → file in `$ADVISORS_DIR`), read the current dossier.
2. Ingest new material (pasted first; else a targeted fresh search on the named angle).
3. Append to `sources[]`, bump `source_count`, set `last_updated` (`date +%F`), and **re-distill only the sections the new material touches** — don't rewrite the whole file blindly.
4. Report the diff: which sections changed, what new positions emerged.

## Mode: LIST

Read frontmatter of every `$ADVISORS_DIR/*.md`; print a compact table — **Name · Role · Domains · sources · last_updated** — and the total count.

---

## Hard rules
1. **No fabricated quotes, ever.** Quote only what traces to a real source; everything else reads as synthesis/extrapolation.
2. **Ground in public material**; capture the shape of their thinking, not a costume.
3. **Critiques must be real and sourced** — no invented scandal. No defamation.
4. **Honest depth** — surface uncertainty; a thin dossier stays thin.
