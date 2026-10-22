# Dossier build pipeline

How every dossier in `advisors/` is built and rebuilt to the gold standard described in [`reference/persona-template.md`](../reference/persona-template.md). It runs on Claude Code's Workflow tool.

## Pieces

| Path | What |
|---|---|
| `engine.js` | The pipeline, as a template: Enumerate → Extract → Synthesize → Pre-verify (Sonnet) → Consolidate (Opus). |
| `specs/<slug>.json` | One spec per advisor: who they are and how to search for them. |
| `src/render.ts` | Validates every spec and renders `.claude/workflows/build-advisor.js` with all specs embedded. |
| `../.claude/workflows/build-advisor.js` | Generated and committed. Do not edit by hand. |

Specs are embedded at render time instead of passed as Workflow `args` because large args are unreliable in the Workflow tool. A run only needs a small `args` object.

## Spec format

```json
{
  "slug": "jane-doe",
  "name": "Jane Doe",
  "lang": "en",
  "corpus": "normal",
  "person": "Jane Doe, co-founder of Example Co (2015) and author of \"A Book\" (2021). NOT any other Jane Doe.",
  "example": "michael-seibel",
  "notes": {
    "focus": "Book content is the highest-priority payload: ...",
    "attribution": "She co-hosts a podcast with John Roe: distinguish her words from his."
  },
  "enumPrompts": [
    { "label": "own-writing", "prompt": "Enumerate essays by {{PERSON}} ..." }
  ]
}
```

- `lang`: `en`, or `pt` for figures whose sources are mostly Portuguese (prose stays English; quotes stay verbatim in Portuguese with a bracketed translation).
- `corpus`: `thin` (reclusive or low-output figures: the pipeline is told not to pad), `normal`, or `large` (books, letters, years of essays: a long dossier is earned).
- `person`: the disambiguating description every prompt uses. End it with who they are NOT.
- `example` (optional): the dossier used as a calibration example. Defaults to `caito-maia` for `pt` and `michael-seibel` for `en`.
- `notes` (optional): `focus` becomes an explicit priority in extraction, synthesis, and consolidation; `attribution` warns every phase about voices that are easy to confuse.
- `enumPrompts` (optional): targeted enumeration sweeps. Only `{{PERSON}}` and `{{DATE}}` are filled. Without them the engine runs three generic sweeps (own writing, long-form spoken, critiques).

## Running a build

1. Add or edit `specs/<slug>.json`, then `cd pipeline && npm ci && npm run render`.
2. In Claude Code, run the `build-advisor` workflow with:
   ```json
   { "slug": "jane-doe", "mode": "create", "repoDir": "/absolute/path/to/advisors" }
   ```
   Use `"mode": "rebuild"` to expand an existing dossier (it is read as the baseline and nothing distinct in it may be lost). `notesDir` defaults to `<repo>/.build/<slug>` (gitignored); `date` defaults to today.
3. After the run: spot-check 2-4 quotes against their URLs yourself (the Opus pass is good, not infallible), delete the notes directory, and, if the council CLI is installed, run `council lint` and `council index`.
4. Open a PR with the dossier, its spec, and the regenerated workflow file.

## Checks

`npm run check` type-checks, runs the tests, and fails if the committed workflow is stale. The tests simulate a full run for every spec with stand-in agents, so a broken prompt, a leaked placeholder, or a runtime error shows up before a paid run.
