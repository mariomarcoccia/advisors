# Contributing to advisors

Thanks for wanting to improve the council. Contributions are welcome from anyone — you don't need write access. You **fork** the repo, make your change, and open a **Pull Request**; a maintainer reviews and merges. Lighter ideas and corrections can just be an **Issue**.

## What you can contribute

- **A new advisor** — a dossier for an operator or thinker worth consulting.
- **Enrich an existing advisor** — add newly surfaced public material (recent talks, interviews, essays, letters) and sharpen the sections it touches.
- **Fix errors** — wrong facts, dead source links, mis-attributed quotes.
- **Improve the skills** — clearer instructions in `skills/*/SKILL.md`, docs, install.

## The non-negotiable rules (read before writing a dossier)

These keep the project honest and safe — see [`reference/voice-guide.md`](reference/voice-guide.md) for the full version. A PR that breaks them won't be merged.

1. **Public material only.** Build from what the person chose to publish. No private communications, leaks, or speculation about private lives.
2. **Never fabricate a quotation.** Anything in quotation marks must trace to a real, linked source. Otherwise write it as *your paraphrase of their view* and make it read that way.
3. **Separate documented from extrapolated.** "They argued X" (sourced) vs. "extending that, they'd likely say Y" (inference) — make the seam visible.
4. **Critiques must be real and sourced.** No invented scandal, no defamation. Report controversies neutrally, with links.
5. **A thin source base stays thin.** Don't pad reclusive figures with invention — fewer sources, more hedging.
6. **Signal over volume.** A dossier is a decision-making lens, not a biography. Optimize for primary voice, real frameworks, and range of situations — not length. ~2,000–4,000 words is the healthy zone (~5,000–6,000 for marquee thinkers if it's primary voice or new lenses). Cut redundancy before adding; if a dossier feels shallow, the fix is better sources, not more words. See `reference/persona-template.md` → "Size: signal over volume".

## How to add a new advisor

1. Fork the repo and create a branch.
2. Copy the structure in [`reference/persona-template.md`](reference/persona-template.md) into `advisors/<slug>.md` (`<slug>` is kebab-case, e.g. `jane-doe`).
3. Fill **every** section, grounded in **≥5 real sources** (reclusive figures may have fewer — note it in `source_count` and Provenance).
4. Complete the frontmatter: `name, slug, role, domains, last_updated` (today's date), `source_count`, and a `sources` list with working URLs.
5. Open a PR. The checklist will appear automatically.

## How to enrich an existing advisor

1. Edit `advisors/<slug>.md`.
2. **Append** new entries to `sources[]` (keep the existing ones), bump `source_count`, set `last_updated` to today.
3. Add/sharpen only the sections the new material touches — don't gut accurate existing content.
4. Open a PR describing what you added.

## Reporting without coding

Open an **Issue**: "Suggest an advisor" or "Report an error / feedback". You don't need to write any dossier — a maintainer or another contributor can pick it up.

## If you're modeled here

If you're one of the people simulated in this repo and want your dossier amended or removed, open an Issue — that request will be honored.
