#!/usr/bin/env bash
# Verify the native OpenCode 2 configuration and its global policies.
#
#     ./scripts/verify.sh

set -euo pipefail

if ! command -v opencode >/dev/null 2>&1; then
  echo "error: opencode not on PATH" >&2
  exit 1
fi

VERSION="$(opencode --version)"
if [[ ! "$VERSION" =~ ^(opencode[[:space:]]+)?v?2([.][0-9]+){1,2}([+-][0-9A-Za-z.-]+)?$ ]]; then
  echo "error: OpenCode 2 required, found: $VERSION" >&2
  exit 1
fi

echo "OpenCode: $VERSION"
echo "resolved config:"
CONFIG_JSON="$(opencode debug config)"

fail=0
check() {
  local label="$1" pattern="$2"
  if grep -Eq "$pattern" <<<"$CONFIG_JSON"; then
    echo "  ok   — $label"
  else
    echo "  MISS — $label"
    fail=1
  fi
}

check "native v2 permissions"          '"permissions"[[:space:]]*:'
check "native v2 agents"               '"agents"[[:space:]]*:'
check "native v2 MCP servers"          '"servers"[[:space:]]*:'
check "provider policy present"        '"action"[[:space:]]*:[[:space:]]*"provider.use"'
check "permission policy present"      '"action"[[:space:]]*:[[:space:]]*"permission"'
check "git push policy denied"         '"resource"[[:space:]]*:[[:space:]]*"shell:git push\*"'
check "external directory asks"        '"action"[[:space:]]*:[[:space:]]*"external_directory"'

echo
if [[ "$fail" -eq 0 ]]; then
  echo "configuration verified."
else
  echo "configuration NOT fully verified." >&2
  exit 1
fi
