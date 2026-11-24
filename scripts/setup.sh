#!/usr/bin/env bash
set -euo pipefail

echo "⚡ NoteForge setup"
echo "------------------"

if ! command -v node >/dev/null; then
  echo "Node.js is required (18+)."
  exit 1
fi

npm install

if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "Created .env.local — add your API keys."
else
  echo ".env.local already exists"
fi

echo "Done. Run: npm run dev"
