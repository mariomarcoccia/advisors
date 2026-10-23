#!/usr/bin/env python3
"""Clean a YouTube (or similar) auto-caption VTT into a readable transcript.

Auto-captions repeat each line as it scrolls and carry per-word timing markup.
This strips both, keeping the spoken text in order with the start timestamp of
each cue. When the captions include ">>" (a speaker change), it is rendered as
"»" — a cheap diarization signal for interviews (host asks / guest answers).

Usage:
    python3 clean_vtt.py INPUT.vtt --out OUTPUT.txt [--title "..."] [--url "..."]

Without --out, writes to stdout. No external dependencies.
"""
import argparse
import html
import re
import sys


def hms(ts: str) -> str:
    # "00:01:23.456" -> "00:01:23"
    return ts.split(".")[0]


def parse_vtt(path: str):
    raw = open(path, encoding="utf-8").read()
    out = []
    last = None
    for block in raw.split("\n\n"):
        lines = block.strip().split("\n")
        if not lines or "-->" not in lines[0]:
            continue
        start = lines[0].split(" --> ")[0].strip()
        # The "real" line carries <c> word-timing markup (the text being built);
        # if none does, fall back to the first non-empty content line.
        content = [l for l in lines[1:] if "<c>" in l]
        if not content:
            content = [l for l in lines[1:] if l.strip()]
        if not content:
            continue
        text = re.sub(r"<[^>]+>", "", content[0]).strip()
        text = html.unescape(text)            # &gt;&gt; -> >>
        text = text.replace(">>", "»")        # mark speaker change
        text = re.sub(r"\s+", " ", text).strip()
        if not text or text == last:
            continue
        last = text
        out.append((hms(start), text))
    return out


def main() -> None:
    ap = argparse.ArgumentParser(description="Clean an auto-caption VTT into a transcript.")
    ap.add_argument("input", help="input .vtt file")
    ap.add_argument("--out", help="output file (default: stdout)")
    ap.add_argument("--title", default="", help="title for the header")
    ap.add_argument("--url", default="", help="source URL for the header")
    args = ap.parse_args()

    rows = parse_vtt(args.input)
    if not rows:
        sys.exit("no speech extracted — check that the file is a valid VTT")

    fh = open(args.out, "w", encoding="utf-8") if args.out else sys.stdout
    if args.title:
        fh.write(f"# {args.title}\n")
    if args.url:
        fh.write(f"# Source: {args.url}\n")
    fh.write("# Transcript: cleaned auto-caption. '»' marks a (approximate) speaker change.\n\n")
    for ts, text in rows:
        fh.write(f"[{ts}] {text}\n")
    if args.out:
        fh.close()
        print(f"{len(rows)} cues -> {args.out}")
        turns = sum(1 for _, t in rows if "»" in t)
        print(f"speaker changes detected (»): {turns}")


if __name__ == "__main__":
    main()
