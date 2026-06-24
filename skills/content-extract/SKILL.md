---
name: content-extract
description: "Turn long-form media (a video, podcast, or talk) by or about ONE person into faithful, attributed text — never fabricating. Discovers the media, downloads it, transcribes (existing transcript > YouTube captions > Whisper), isolates the target person's speech, verifies fidelity, and emits one of four modes: persona (verbatim quotes + positions + frameworks with URL+timestamp, ready for /advice feed), article (2–3k first-person essays), quotes (short attributed pull-quotes), or transcript (clean speaker-tagged text). Use it to feed an advisor dossier from a talk/podcast, or to repurpose someone's appearances into writing. Usage: /content-extract <url-or-search> [--person <name>] [--mode persona|article|quotes|transcript] [--lang en|pt,en]"
argument-hint: "<url-or-search> [--person <name>] [--mode persona|article|quotes|transcript] [--lang en]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - WebSearch
  - WebFetch
  - AskUserQuestion
  - Agent
  - Skill
---

# /content-extract — Long-form media → faithful, attributed text

Takes one appearance (podcast, video, talk, interview) and extracts what **one specific person** said, as usable text, **without ever inventing**. The pipeline core is shared; only the **output mode** differs at the end.

The primary use in this repo is **feeding an advisor dossier**: `--mode persona` produces sourced material that `/advice feed <slug>` ingests, following [`reference/persona-template.md`](../../reference/persona-template.md) and [`reference/voice-guide.md`](../../reference/voice-guide.md). It also serves general content reuse — turning a person's own appearances into blog articles or pull-quotes.

## Inputs (`$ARGUMENTS`)

| Flag | Default | Meaning |
|------|---------|---------|
| `<url-or-search>` | — | A direct URL (YouTube/Spotify/RSS) **or** a search phrase. If empty, ask. |
| `--person <name>` | the dossier subject (persona) / the session owner (other modes) | Whose speech to extract. |
| `--mode` | `persona` | `persona` \| `article` \| `quotes` \| `transcript`. |
| `--lang` | `en` for persona; user's language otherwise | Output language(s), e.g. `pt,en`. |
| `--out <dir>` | mode-dependent | Output folder. |

Respond in the user's language. If the input is ambiguous (no person, no mode, no URL), use `AskUserQuestion` to close only what's missing — don't guess the mode.

## Hard rules (all modes)

Inherited from this repo's `voice-guide.md` — output often lands in shared or public repos:

- **Never fabricate a quotation.** Anything in quotation marks must trace to a real source (URL + timestamp). If you can't sustain it, it is **your paraphrase** and must read that way.
- **Keep the seam visible** between what is **documented** and what is **extrapolated**.
- **A proper noun garbled by the auto-caption → neutral reference + flag.** Don't guess a mangled name into a real one; write a neutral reference (e.g. "my co-founder", "a benefits startup") and record the doubt. Same for companies/cases.
- **Edit from spoken to written without changing the meaning.** Removing filler and hesitations is fine; inventing a fact, number, or opinion is not.
- **Drop sponsor/ad reads** by the host — they aren't the person's substantive speech.
- **Public material only.** In persona mode, label it a simulation and never use private communications.

---

## Pipeline (phases 1–5 shared; phase 6 = mode)

### Phase 1 — Discover the media
If a URL was given, skip. Otherwise:
- **Web**: `WebSearch` by podcast/host + the person's name. Watch for **homonyms** (filter look-alike names that aren't the person). Web search is often US-biased and noisy.
- **YouTube**: find the podcast's channel and list its uploads to pin the exact episode (see phase 2, `--flat-playlist`).
- **The user's own private sources** (when authorized and available via MCP): meeting-transcript tools, email (invites/published-episode links), chat (host coordination). Most useful for surfacing appearances that slipped by and for filling in dates/links.

Record each find in a catalog (table: title · channel · date · type · public url · media url · has transcript? · status).

### Phase 2 — Acquire
Check tooling first:
```bash
for b in yt-dlp ffmpeg whisper; do command -v $b || echo "MISSING $b"; done
```
Install what's missing (ask first — it writes to the system): `brew install yt-dlp ffmpeg`. Whisper: `pipx install faster-whisper` or `uv tool install faster-whisper`.

- **Find the exact video in a channel** (YouTube):
  ```bash
  yt-dlp --flat-playlist --print "%(title)s | %(id)s" "<CHANNEL_URL>/videos" | grep -iE "<term>"
  ```
- **Download audio + captions** (YouTube):
  ```bash
  yt-dlp -x --audio-format mp3 --write-auto-subs --write-subs \
    --sub-langs "en.*,en,pt.*" --convert-subs srt -o "<slug>.%(ext)s" "<URL>"
  ```
  On `HTTP 429`, wait and retry; fetch captions and audio in separate calls.
- **Audio-only (Spotify/Substack/RSS)**: pull the `.mp3` from the RSS enclosure (Substack exposes it at `api.substack.com/feed/podcast/<id>.rss`). Spotify-only with no RSS → find the version on YouTube or the show's site.

Keep media in a **gitignored** `media/` folder (audio is heavy).

### Phase 3 — Transcribe (cascade: use the first that exists)
1. **An existing transcript** (e.g. from a meeting-notes tool) → use directly.
2. **YouTube captions** (`--write-auto-subs`) → clean with the bundled script:
   ```bash
   python3 "$SKILL_DIR/scripts/clean_vtt.py" media/<slug>.<lang>.vtt \
     --out transcripts/<slug>.<lang>.txt --title "<title>" --url "<url>"
   ```
   It removes scrolling/markup, normalizes entities, and marks speaker changes with `»`.
3. **Whisper** (audio-only or poor captions): `faster-whisper large-v3 --language <lang>`. Slower (~10–20 min per hour of audio on CPU), more faithful. To separate speakers, use **whisperX** (alignment + diarization via pyannote).

### Phase 4 — Isolate the target person's speech
- In an interview the turns alternate: **host asks → guest answers**. The `»` from the auto-caption marks those changes; the episode intro usually fixes who is host vs. guest.
- Where diarization exists (whisperX), use the speaker labels.
- **Read the whole transcript** (in chunks) and map the target person's passages by theme/timestamp before writing. Mark ad segments to drop.

### Phase 5 — Verify fidelity
- Sensitive passages (numbers, anything that becomes a quote) → check against the **audio** or the raw transcript, not just the auto-caption.
- List the **points of doubt** (uncertain names/numbers) explicitly when handing off.
- No paraphrase may change the meaning; no quote may be absent from the source.

### Phase 6 — Produce (choose by `--mode`)

For volume (many themes from one episode), **parallelize with `Agent`**: one agent per theme, each reading the transcript and following a reference piece to lock the voice. Give every agent the hard rules above and ask it to return **only** the file path + word count + fidelity doubts (not the text).

**`persona`** (default) — material for an advisor dossier. For EACH item, capture with **URL + timestamp**: (a) verbatim quotes; (b) positions/decisions tied to the situation faced; (c) frameworks + an applied example (`situation → what they did → quote → source`); (d) where they disagree with named others; (e) critiques/blind spots. Structure it per [`reference/persona-template.md`](../../reference/persona-template.md). Language: **English** (dossiers are in English). Don't fill gaps with invention — an item with no sourced example stays visibly example-less. **Handoff**: offer to run `/advice feed <slug> <file>` to fold it into the dossier.

**`article`** — blog essays of **2,000–3,000 words**, first person, in the person's voice, **one article per theme** (not one giant per episode). Front-matter: `source, url, date, theme, lang, status: draft`. Deliver the primary language first; generate translations only after the user approves it. Output to `<out>/articles/<slug>--<theme>.md`.

**`quotes`** — short, striking pull-quotes, edited from spoken to written, each with a one-line context, a theme, and a **timestamp + link** to the minute (`?t=<sec>` on YouTube). Output to `<out>/quotes/<slug>--<theme>.md`.

**`transcript`** — just the cleaned, speaker-tagged transcript + fidelity notes. Output to `<out>/transcripts/<slug>.<lang>.txt`.

---

## Resolve paths
```bash
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"   # this skill's dir; scripts/clean_vtt.py
ADVISORS_HOME="${ADVISORS_HOME:-$HOME/.advisors}"               # reference/, advisors/
```

## Suggested output layout (content-reuse modes)
```
<project>/
  catalog.md                   # master table of appearances
  media/                       # audio/video (gitignored)
  transcripts/<slug>.<lang>.txt
  articles/<slug>--<theme>.md  # mode article
  quotes/<slug>--<theme>.md    # mode quotes
  .gitignore                   # ignores media/ and *.mp3/*.mp4/*.wav
```

## Notes
- Always confirm **before** downloading a lot of media or installing tooling (these are write actions).
- YouTube auto-captions are good but imperfect; for the final faithful version of sensitive quotes, run Whisper on the audio.
- Audio-only episodes (Spotify) require Whisper — there is no caption track to reuse.
