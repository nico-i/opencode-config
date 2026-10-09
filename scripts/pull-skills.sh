#!/usr/bin/env sh
set -eu

REPO="$(cd "$(dirname "$0")/../managed/congstar-ai" && pwd)"

git -C "$REPO" pull --ff-only origin main
echo "skills updated from congstar-ai (main)."
