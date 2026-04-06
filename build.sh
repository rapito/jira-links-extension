#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SHARED="$SCRIPT_DIR/shared"
ICONS="$SCRIPT_DIR/icons"

for BROWSER in chrome firefox edge; do
  TARGET="$SCRIPT_DIR/$BROWSER"

  # Copy shared JS/HTML into each browser folder
  cp "$SHARED/constants.js" "$TARGET/constants.js"
  cp "$SHARED/storage.js"   "$TARGET/storage.js"
  cp "$SHARED/content.js"   "$TARGET/content.js"
  cp "$SHARED/settings.html" "$TARGET/settings.html"
  cp "$SHARED/settings.js"  "$TARGET/settings.js"

  # Copy icons
  mkdir -p "$TARGET/icons"
  if [ -d "$ICONS" ]; then
    cp "$ICONS"/* "$TARGET/icons/" 2>/dev/null || true
  fi

  echo "Built: $BROWSER"
done

echo "Done. Load each browser folder as an unpacked extension."
