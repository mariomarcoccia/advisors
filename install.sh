#!/usr/bin/env bash
# Installs the advisors skills into Claude Code, links the shared data dir, and
# sets up the council CLI (index, Jev retrieval, citation verification).
# Safe to re-run (idempotent).
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ADVISORS_HOME="${ADVISORS_HOME:-$HOME/.advisors}"
SKILLS_DIR="$HOME/.claude/skills"

mkdir -p "$ADVISORS_HOME/state/decisions" "$SKILLS_DIR"

# Canonical data home: link the repo's content here; keep state/ and cache/ local.
for dir in advisors reference index tools; do
  ln -sfn "$REPO/$dir" "$ADVISORS_HOME/$dir"
done

# Link each skill directory into ~/.claude/skills/ so each becomes a /command.
for d in "$REPO"/skills/*/; do
  name="$(basename "$d")"
  ln -sfn "${d%/}" "$SKILLS_DIR/$name"
  echo "  linked skill: /$name"
done

# Council CLI: Node >= 22.18 runs the TypeScript sources directly.
if command -v node >/dev/null 2>&1; then
  if node -e 'const [a,b]=process.versions.node.split(".").map(Number); process.exit(a>22||(a===22&&b>=18)?0:1)'; then
    (cd "$REPO/tools/council" && npm ci --omit=dev --silent)
    "$REPO/tools/council/bin/council" index --check >/dev/null || "$REPO/tools/council/bin/council" index
    echo "  council CLI ready: $ADVISORS_HOME/tools/council/bin/council"
  else
    echo "  WARNING: node $(node -v) is too old for the council CLI (need >= 22.18); skills run in degraded mode."
  fi
else
  echo "  WARNING: node not found; skills run in degraded mode (full dossiers, no verification)."
fi

# One-time migration: the single legacy brief becomes its own decision folder.
LEGACY="$ADVISORS_HOME/state/current-brief.md"
if [ -f "$LEGACY" ] && [ ! -e "$ADVISORS_HOME/state/current" ]; then
  MIGRATED="$ADVISORS_HOME/state/decisions/legacy-brief"
  mkdir -p "$MIGRATED/packs" "$MIGRATED/consults"
  cp "$LEGACY" "$MIGRATED/brief.md"
  ln -sfn "$MIGRATED" "$ADVISORS_HOME/state/current"
  echo "  migrated legacy brief to $MIGRATED (run /frame to write its decision.en.md)"
fi

if [ -z "${TYPESAFE_API_KEY:-}" ]; then
  echo ""
  echo "  Optional: set TYPESAFE_API_KEY (https://console.typesafe.ai/keys) so Jev ranks advisors"
  echo "  and dossier cards for each decision. Without it the CLI falls back to BM25."
fi

echo ""
echo "advisors installed. Data home: $ADVISORS_HOME"
echo "Start with /frame, then /advice, /second-opinion, or /boardroom (try /boardroom sweep)."
