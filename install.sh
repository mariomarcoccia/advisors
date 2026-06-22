#!/usr/bin/env bash
# Installs the council skills into Claude Code and links the shared data dir.
# Safe to re-run (idempotent).
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COUNCIL_HOME="${COUNCIL_HOME:-$HOME/.council}"
SKILLS_DIR="$HOME/.claude/skills"

mkdir -p "$COUNCIL_HOME" "$SKILLS_DIR"

# Canonical data home: link the repo's advisors/ and reference/ here; keep state/ local.
ln -sfn "$REPO/advisors"  "$COUNCIL_HOME/advisors"
ln -sfn "$REPO/reference" "$COUNCIL_HOME/reference"
mkdir -p "$COUNCIL_HOME/state"

# Link each skill directory into ~/.claude/skills/ so each becomes a /command.
for d in "$REPO"/skills/*/; do
  name="$(basename "$d")"
  ln -sfn "${d%/}" "$SKILLS_DIR/$name"
  echo "  linked skill: /$name"
done

echo ""
echo "council installed."
echo "  data home: $COUNCIL_HOME (advisors + reference linked, state/ created)"
echo ""
echo "Start a session with /frame, then consult with /council, /second-opinion, or /boardroom."
