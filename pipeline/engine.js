// Dossier build pipeline, run by Claude Code's Workflow tool.
//
// This file is a TEMPLATE. `npm run render` in pipeline/ validates every
// specs/<slug>.json and writes .claude/workflows/build-advisor.js with the specs
// embedded below. Specs are embedded rather than passed as args because large
// Workflow args are unreliable; the run only needs a small `args` object:
//
//   { slug: "paul-graham", mode: "rebuild" | "create", repoDir: "/abs/path/to/advisors",
//     notesDir?: "/abs/path/for/research/notes", date?: "YYYY-MM-DD" }
//
// Five phases, model split per reference/persona-template.md: Sonnet does the
// volume (enumerate, extract, draft, preliminary quote check); Opus does one
// consolidated pass for fidelity, corpus completeness, and depth.

export const meta = {
  name: 'build-advisor',
  description: 'Build or rebuild an advisor dossier to the gold standard: Sonnet enumerates, extracts, drafts, and pre-checks quotes; Opus makes one consolidated pass (fidelity + completeness + depth).',
  phases: [
    { title: 'Enumerate', detail: 'Sonnet: parallel sweeps of the corpus' },
    { title: 'Extract', detail: 'Sonnet: one agent per batch of sources' },
    { title: 'Synthesize', detail: 'Sonnet: full dossier draft' },
    { title: 'Pre-verify', detail: 'Sonnet: string-match load-bearing quotes against raw sources' },
    { title: 'Consolidate', detail: 'Opus: fidelity + completeness + depth, fixed in place' },
  ],
}

const SPECS = /*__SPECS__*/ {}

const SONNET = 'sonnet'
const OPUS = 'opus'
const SOURCE_CAP = 28

// ---------- inputs ----------

const spec = SPECS[args.slug]
if (!spec) throw new Error(`No spec for "${args.slug}". Add pipeline/specs/${args.slug}.json and run \`npm run render\` in pipeline/.`)
if (!args.repoDir || !args.repoDir.startsWith('/')) throw new Error('args.repoDir must be the absolute path of the advisors repo')
const mode = args.mode ?? 'rebuild'
if (mode !== 'create' && mode !== 'rebuild') throw new Error('args.mode must be "create" or "rebuild"')

const date = args.date ?? new Date().toISOString().slice(0, 10)
const repo = args.repoDir.replace(/\/+$/, '')
const notesDir = args.notesDir ?? `${repo}/.build/${spec.slug}`
const dossierPath = `${repo}/advisors/${spec.slug}.md`
const templatePath = `${repo}/reference/persona-template.md`
const voiceGuidePath = `${repo}/reference/voice-guide.md`
const exampleSlug = spec.example ?? (spec.lang === 'pt' ? 'caito-maia' : 'michael-seibel')
const examplePath = `${repo}/advisors/${exampleSlug}.md`
const PERSON = spec.person
const fill = (text) => text.replaceAll('{{PERSON}}', PERSON).replaceAll('{{DATE}}', date)

// ---------- per-spec wording ----------

const PT = spec.lang === 'pt'
const LANGUAGE_EXTRACT = PT
  ? 'Most sources are in Portuguese: extract in Portuguese, do not translate at this stage.'
  : 'Sources are expected to be in English.'
const LANGUAGE_QUOTES = PT
  ? 'in the original Portuguese if that is the source language'
  : 'exact wording'
const LANGUAGE_CONVENTION = PT
  ? 'Convention: dossier PROSE is English throughout, but QUOTES stay verbatim in Portuguese followed by a bracketed [translation], e.g. "citação original" [translation].'
  : 'All prose and quotes are in English (no translation-bracket convention needed).'
const LANGUAGE_MATCH = PT ? ' Quotes may be in Portuguese: match the original-language text, not a translation.' : ''

const CORPUS_CALIBRATION = {
  thin: `Read ${examplePath} for STRUCTURE only, not size: ${spec.name} has a genuinely thin public corpus. Do NOT pad sections, invent frameworks, or stretch weak paraphrase into "mental models". An honest, thinner dossier that reflects how little they have said publicly is the correct output; say so in Provenance notes.`,
  normal: `Read ${examplePath} as a calibration example for size and structure: don't inflate for its own sake.`,
  large: `Read ${examplePath} as a calibration example for structure. ${spec.name} has a large corpus (books, letters, or years of essays and long interviews), so a substantial dossier is earned here if the material supports it, but dedup restated abstractions hard.`,
}[spec.corpus]

const ATTRIBUTION = spec.notes?.attribution ? `\nATTRIBUTION CAUTION: ${spec.notes.attribution}` : ''
const FOCUS = spec.notes?.focus ? `\nEXPLICIT PRIORITY: ${spec.notes.focus}` : ''
const STRAY_NOTES = `If the notes directory is empty or incomplete (known bug: agents sometimes write to "undefined/" relative to their own working directory), look for stray batch-*.md files in ${repo}/undefined/, ~/undefined/, and ~/.advisors/undefined/ before proceeding, and move them into ${notesDir}/.`
const BASELINE = mode === 'rebuild'
  ? `Read the CURRENT dossier at ${dossierPath} first: it is the baseline. This is an EXPANSION: nothing distinct and sourced in it may be lost.`
  : 'This is a from-scratch build: there is no prior dossier.'

const DEFAULT_ENUM_PROMPTS = [
  { label: 'own-writing', prompt: `Enumerate WRITTEN material authored by ${PERSON}: find the canonical index (blog or essay archive, newsletter archive, shareholder letters, books and their excerpts, op-eds) and walk it piece by piece rather than relying on the famous top slice. Return exact URLs, each marked high/medium/low priority by idea density.` },
  { label: 'long-form-spoken', prompt: `Enumerate LONG-FORM SPOKEN material by ${PERSON}: podcast episodes, long interviews, talks, and lectures, preferring pages with full transcripts. Cover different years and venues, not one famous appearance. Return exact URLs, each marked high/medium/low priority.` },
  { label: 'critiques', prompt: `Enumerate serious, sourced CRITIQUES of ${PERSON} and their ideas or decisions (named critics, analysts, journalists, academics), plus documented disagreements with other named thinkers. No gossip or private matters. Return exact URLs, each marked high/medium/low priority.` },
]
const enumPrompts = (spec.enumPrompts ?? DEFAULT_ENUM_PROMPTS).map((p) => ({ label: p.label, prompt: fill(p.prompt) }))

// ---------- 1. enumerate ----------

const SOURCES_SCHEMA = {
  type: 'object', required: ['sources'],
  properties: { sources: { type: 'array', items: {
    type: 'object', required: ['title', 'url', 'type', 'priority'],
    properties: {
      title: { type: 'string' },
      url: { type: 'string' },
      type: { type: 'string', description: 'essay|talk|podcast|interview|post|profile|critique|statement|book|paper|letter' },
      priority: { type: 'string', enum: ['high', 'medium', 'low'] },
      why: { type: 'string' },
    } } } },
}

phase('Enumerate')
const enumerated = (await parallel(enumPrompts.map((p) => () =>
  agent(p.prompt, { label: `enumerate:${p.label}`, phase: 'Enumerate', schema: SOURCES_SCHEMA, model: SONNET })
))).filter(Boolean).flatMap((r) => r.sources)

const normUrl = (u) => u.replace(/[?#].*$/, '').replace(/\/+$/, '').toLowerCase()
const seen = new Set()
const all = []
for (const s of enumerated) {
  const key = normUrl(s.url)
  if (!seen.has(key)) { seen.add(key); all.push(s) }
}
const ordered = ['high', 'medium', 'low'].flatMap((p) => all.filter((s) => s.priority === p))
const sources = ordered.slice(0, SOURCE_CAP)
log(`${all.length} unique sources enumerated; processing ${sources.length} (${Math.max(0, all.length - SOURCE_CAP)} lowest-priority left out)`)

// ---------- 2. extract ----------

const NBATCH = Math.min(6, Math.max(1, Math.ceil(sources.length / 6)))
const batches = Array.from({ length: NBATCH }, () => [])
sources.forEach((s, i) => batches[i % NBATCH].push(s))

const EXTRACT_SCHEMA = {
  type: 'object', required: ['file', 'covered', 'failed'],
  properties: {
    file: { type: 'string' }, covered: { type: 'integer' },
    failed: { type: 'array', items: { type: 'string' } },
    highlights: { type: 'array', items: { type: 'string' } },
  },
}

phase('Extract')
const extractions = (await parallel(batches.map((batch, i) => () =>
  agent(`You are extracting raw material for a persona dossier of ${PERSON}.
${BASELINE}
Process EACH of these sources (curl -sL --compressed; try a browser user-agent for pages that block plain curl). ${LANGUAGE_EXTRACT}
${JSON.stringify(batch, null, 2)}

For each source extract, with the EXACT URL attached to every item:
(a) VERBATIM quotes: exact wording only inside quotation marks (${LANGUAGE_QUOTES}); otherwise clearly-marked paraphrase
(b) named frameworks/mental models + a worked example of each (the payload: a framework without an example is half-built)
(c) decision heuristics and positions on specific hard-call situations
(d) explicit or implicit disagreements with named thinkers
(e) critiques/blind spots with source${ATTRIBUTION}${FOCUS}
Prioritize NOVELTY: new kinds of situations, not restatements.
IMPORTANT (known bug): write your notes to the FULL ABSOLUTE path ${notesDir}/batch-${i + 1}.md, never a relative path, even if it looks equivalent. Double-check the path is absolute before writing. Return file path, covered count, failed URLs, 3-5 highlights.`,
    { label: `extract:batch-${i + 1}`, phase: 'Extract', schema: EXTRACT_SCHEMA, model: SONNET })
))).filter(Boolean)

const covered = extractions.reduce((sum, e) => sum + e.covered, 0)
const failed = extractions.flatMap((e) => e.failed)
log(`Extraction: ${covered} sources covered, ${failed.length} failed`)

// ---------- 3. synthesize ----------

phase('Synthesize')
const draft = await agent(`Write ${mode === 'rebuild' ? 'a DRAFT rebuild of the' : 'the FIRST DRAFT of a brand-new'} persona dossier for ${PERSON}.
1. ${BASELINE}
2. Read the template at ${templatePath} and the voice guide at ${voiceGuidePath}; follow the section structure EXACTLY, including "Writing for the index (cards)" if present.
3. ${CORPUS_CALIBRATION} ${LANGUAGE_CONVENTION}
4. Read ALL research notes: every .md file in ${notesDir}/ (list the directory first). ${STRAY_NOTES}
5. ${mode === 'rebuild' ? 'OVERWRITE' : 'WRITE'} ${dossierPath} as a complete file: slug: ${spec.slug}, last_updated: ${date}; sources[] = every source actually cited; source_count matches exactly; quote any frontmatter value containing a colon.${mode === 'rebuild' ? ' Keep every existing mental model, heuristic, worked example, and "Where they disagree" row; add new ones.' : ''} Never quote anything the notes don't show verbatim with a URL. Where a section is thin, say so honestly in Provenance notes rather than padding. Write the Summary last.${FOCUS}${ATTRIBUTION}
6. Return: final source_count, the enumerated source URLs NOT cited in the final draft (for the completeness audit downstream), and a 3-4 sentence report. Do NOT return placeholder or example values: every field must reflect this run's real output.`,
  { label: 'synthesize:draft', phase: 'Synthesize', model: SONNET, effort: 'high',
    schema: { type: 'object', required: ['sourceCount', 'unusedSources', 'report'], properties: {
      sourceCount: { type: 'integer' },
      unusedSources: { type: 'array', items: { type: 'string' } },
      report: { type: 'string' },
    } } })

log(`Draft (Sonnet): ${draft.sourceCount} sources cited, ${draft.unusedSources.length} enumerated but unused`)

// ---------- 4. pre-verify ----------

phase('Pre-verify')
const dossierText = await agent(`Read the file at ${dossierPath} and return its FULL raw text verbatim: no summary, no commentary, just the complete file content.`,
  { label: 'read:draft', phase: 'Pre-verify', model: SONNET })

const QUOTES_SCHEMA = { type: 'object', required: ['quotes'], properties: { quotes: { type: 'array', maxItems: 24, items: {
  type: 'object', required: ['quote', 'url'], properties: { quote: { type: 'string' }, url: { type: 'string' } },
} } } }
const quotesToCheck = await agent(`Read this dossier text and extract the 15-24 most LOAD-BEARING verbatim quotes (in quotation marks) with the source URL each is attributed to (check sources[] in the frontmatter and inline citations). Prioritize quotes used in Core ideas, Mental models, and Signature quotes. Return each quote in its ORIGINAL language exactly as it appears (do not translate) so it can be string-matched against the raw source. Do NOT return placeholder values.

${dossierText}`,
  { label: 'pre-verify:pick-quotes', phase: 'Pre-verify', model: SONNET, schema: QUOTES_SCHEMA })

const VERDICTS_SCHEMA = { type: 'object', required: ['verdicts'], properties: { verdicts: { type: 'array', items: {
  type: 'object', required: ['quote', 'url', 'verdict'], properties: {
    quote: { type: 'string' }, url: { type: 'string' },
    verdict: { type: 'string', enum: ['verified', 'mismatch', 'not_found', 'unreachable'] },
    note: { type: 'string' },
  } } } } }
const chunks = []
for (let i = 0; i < quotesToCheck.quotes.length; i += 5) chunks.push(quotesToCheck.quotes.slice(i, i + 5))
const verdicts = (await parallel(chunks.map((chunk, i) => () =>
  agent(`Verify these quotes attributed to ${spec.name} by fetching the RAW source (\`curl -sL --compressed <url>\` via Bash, grep for a distinctive substring; try a browser user-agent for blocked pages) and string-matching.${LANGUAGE_MATCH} Do NOT trust reader-mode summaries.${ATTRIBUTION} Verdict per quote: verified / mismatch (actual wording and, if different, the actual speaker in note) / not_found / unreachable. This is a preliminary, mechanical check: flag anything uncertain rather than guessing.
${JSON.stringify(chunk, null, 2)}`,
    { label: `pre-verify:batch-${i + 1}`, phase: 'Pre-verify', model: SONNET, schema: VERDICTS_SCHEMA })
))).filter(Boolean).flatMap((r) => r.verdicts)

const flagged = verdicts.filter((v) => v.verdict !== 'verified')
log(`Pre-verify (Sonnet): ${verdicts.length - flagged.length}/${verdicts.length} confirmed; ${flagged.length} flagged for the Opus pass`)

// ---------- 5. consolidate ----------

phase('Consolidate')
const consolidated = await agent(`You are the FINAL, consolidated quality pass on the persona dossier for ${PERSON} at ${dossierPath}. A cheaper model (Sonnet) drafted it from research notes in ${notesDir}/. Your job is NOT just to check quotes: do all three of these and REWRITE THE FILE IN PLACE.

1. **Fidelity.** These quotes were flagged by the preliminary raw-source check:
${JSON.stringify(flagged, null, 2)}
For each: re-read the dossier text around it first (the preliminary check sometimes flags quotes already correctly attributed to a third party, such as an interviewer or co-host; don't "fix" what isn't broken). Then re-verify by fetching the EXACT URL cited (curl -sL --compressed; a different user-agent or web.archive.org if unreachable).${LANGUAGE_MATCH} If the person gave several talks or interviews at the same event or in the same year, try the obvious alternative source before accepting not_found. A WebSearch snippet is NOT verification: if you cite or re-attribute a quote to a URL, you must have fetched THAT URL and found the string there (pages can change content under the same URL). Fix genuine errors: wrong wording to correct wording; wrong attribution to correct attribution or a marked paraphrase; dead source to demote or remove.${ATTRIBUTION}

2. **Completeness audit.** These sources were enumerated but NOT cited in the draft:
${JSON.stringify(draft.unusedSources, null, 2)}
For each, check the research notes in ${notesDir}/ (${STRAY_NOTES}): did the draft skip genuinely novel material? If so, fold it in. Also judge independently whether enumeration walked the person's full canonical index or stopped at the famous top slice; if you spot an obvious gap (a known essay, talk, letter, or interview series), do one targeted search and fetch, and add it only if it is real and citable. ${spec.corpus === 'thin' ? 'This figure has a thin public corpus: an honest, modest source_count is correct; never pad with weak secondary sources.' : 'Do not pad with weak secondary sources just to look thicker.'}${FOCUS}

3. **Depth repair.** Read the whole dossier critically. Where synthesis went shallow (a mental model with no worked example, a generic "Where they disagree" row, a Core idea without a concrete situation), REWRITE that section in place with specific, sourced content from the notes. ${LANGUAGE_CONVENTION}

Rules: never invent a quote; anything in quotation marks must trace to a URL in the notes or one you verified yourself. Keep slug, last_updated, and source_count consistent. Edit ${dossierPath} in place (Edit/Write tools).

Return: # quotes fixed, # completeness gaps closed, # sections deepened, final source_count, and a short report. No placeholder values.`,
  { label: 'consolidate:opus', phase: 'Consolidate', model: OPUS, effort: 'high',
    schema: { type: 'object', required: ['quotesFixed', 'completenessGapsClosed', 'sectionsDeepened', 'finalSourceCount', 'report'], properties: {
      quotesFixed: { type: 'integer' }, completenessGapsClosed: { type: 'integer' },
      sectionsDeepened: { type: 'integer' }, finalSourceCount: { type: 'integer' }, report: { type: 'string' },
    } } })

log(`Consolidate (Opus): ${consolidated.quotesFixed} quotes fixed, ${consolidated.completenessGapsClosed} completeness gaps closed, ${consolidated.sectionsDeepened} sections deepened, final source_count ${consolidated.finalSourceCount}`)

return {
  slug: spec.slug,
  mode,
  sourcesEnumerated: all.length,
  sourcesProcessed: sources.length,
  sourcesCovered: covered,
  sourcesFailed: failed,
  draftSourceCount: draft.sourceCount,
  draftReport: draft.report,
  preVerifyFlagged: flagged,
  consolidationReport: consolidated.report,
  quotesFixed: consolidated.quotesFixed,
  completenessGapsClosed: consolidated.completenessGapsClosed,
  sectionsDeepened: consolidated.sectionsDeepened,
  finalSourceCount: consolidated.finalSourceCount,
  dossier: dossierPath,
  next: 'Spot-check 2-4 quotes against their URLs yourself, delete the notes directory, then run `council lint` and `council index` if the council CLI is installed.',
}
