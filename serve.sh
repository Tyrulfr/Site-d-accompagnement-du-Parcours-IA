#!/usr/bin/env bash
# Sert le site en local pour le tester.
set -euo pipefail
cd "$(dirname "$0")"
PORT="${1:-8001}"
echo "Site d'accompagnement : http://localhost:${PORT}/"
echo "(Ctrl+C pour arrêter)"
python3 -m http.server "${PORT}" --bind 127.0.0.1
