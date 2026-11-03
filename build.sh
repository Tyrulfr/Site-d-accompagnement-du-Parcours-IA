#!/usr/bin/env bash
# Assemble les pages du site (pages/*.html -> *.html).
set -euo pipefail
cd "$(dirname "$0")"
python3 scripts/construire.py
