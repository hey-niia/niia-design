#!/usr/bin/env bash
# Store a Figma personal access token in the MCP configs.
#
# Prompts for the token (input hidden), checks it against the Figma API, and
# only writes if it's actually valid — so a mistyped or already-expired token
# fails here instead of halfway through an export. Backs up each file first.
#
#   bash scripts/set-figma-token.sh
#
# Figma caps personal access tokens at 90 days, so expect to rerun this.
# Create one at: figma.com → Settings → Security → Personal access tokens
# Scope needed: File content → Read

set -euo pipefail

CONFIGS=(
  "$HOME/Library/Application Support/Claude/claude_desktop_config.json"
  "$HOME/.claude.json"
)

read -rsp "Paste Figma token (input hidden): " TOKEN
echo
# Guard against the double-paste that produced figd_figd_… last time.
TOKEN="$(printf '%s' "$TOKEN" | tr -d '[:space:]')"
TOKEN="${TOKEN/#figd_figd_/figd_}"

if [[ ${#TOKEN} -ne 45 || $TOKEN != figd_* ]]; then
  echo "✗ Doesn't look like a Figma token (expected 45 chars starting figd_, got ${#TOKEN})."
  exit 1
fi

echo -n "Checking with Figma… "
# No -f: when Figma says no, show why instead of an empty "no response".
RESP="$(curl -sS -w $'\n%{http_code}' -H "X-Figma-Token: $TOKEN" https://api.figma.com/v1/me 2>&1 || true)"
CODE="${RESP##*$'\n'}"
BODY="${RESP%$'\n'*}"
if [[ $CODE == 200 ]]; then
  echo "✓ $(printf '%s' "$BODY" | sed -n 's/.*"email":"\([^"]*\)".*/\1/p')"
elif [[ $CODE == 000 || -z $CODE ]]; then
  echo "✗"
  echo "  Couldn't reach Figma (network): $BODY"
  exit 1
elif [[ $BODY == *xpired* || $BODY == *"Invalid token"* ]]; then
  echo "✗"
  echo "  Figma rejected it ($CODE): $BODY"
  exit 1
else
  # A token made with only "File content: Read" can export files but isn't
  # allowed to read /v1/me, so Figma answers 403 here — that's still fine.
  echo "✓ (can't read your profile with this token's scopes, which is fine for exports: $CODE)"
fi

for f in "${CONFIGS[@]}"; do
  [[ -f $f ]] || { echo "– skipped (not found): $f"; continue; }
  cp "$f" "$f.bak"
  TOKEN="$TOKEN" python3 - "$f" <<'PY'
import os, re, sys
path, tok = sys.argv[1], os.environ["TOKEN"]
s = open(path).read()
new, n = re.subn(r'("FIGMA_ACCESS_TOKEN"\s*:\s*")[^"]*(")', lambda m: m.group(1) + tok + m.group(2), s)
if n == 0:
    print(f"– no FIGMA_ACCESS_TOKEN key in {os.path.basename(path)}; left alone")
else:
    open(path, "w").write(new)
    print(f"✓ updated {n} entr{'y' if n == 1 else 'ies'} in {os.path.basename(path)} (backup: {os.path.basename(path)}.bak)")
PY
done

echo
echo "Done. Exports work immediately — the scripts read the file directly."
