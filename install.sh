#!/usr/bin/env bash
# Installs the advisors skills into Claude Code and links the shared data dir.
# Safe to re-run (idempotent).
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ADVISORS_HOME="${ADVISORS_HOME:-$HOME/.advisors}"
SKILLS_DIR="$HOME/.claude/skills"

mkdir -p "$ADVISORS_HOME" "$SKILLS_DIR"

# Canonical data home: link the repo's advisors/ and reference/ here; keep state/ local.
ln -sfn "$REPO/advisors"  "$ADVISORS_HOME/advisors"
ln -sfn "$REPO/reference" "$ADVISORS_HOME/reference"
mkdir -p "$ADVISORS_HOME/state"

# Link each skill directory into ~/.claude/skills/ so each becomes a /command.
for d in "$REPO"/skills/*/; do
  name="$(basename "$d")"
  ln -sfn "${d%/}" "$SKILLS_DIR/$name"
  echo "  linked skill: /$name"
done

echo ""
echo "advisors installed."
echo "  data home: $ADVISORS_HOME (advisors + reference linked, state/ created)"
echo ""
echo "Start a session with /frame, then consult with /advice, /second-opinion, or /boardroom (and /advisors to manage the roster)."
