#!/usr/bin/env python3
"""NoteForge — lightweight note cleaner for preprocessing uploads.

Usage:
  python tools/python/clean_notes.py notes.txt
  python tools/python/clean_notes.py notes.txt --out cleaned.txt
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


def clean(text: str) -> str:
    # Normalize newlines
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    # Collapse 3+ blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)
    # Strip trailing spaces per line
    text = "\n".join(line.rstrip() for line in text.split("\n"))
    # Remove form-feed / null
    text = text.replace("\x0c", "\n").replace("\x00", "")
    return text.strip() + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description="Clean study notes for NoteForge")
    parser.add_argument("input", type=Path, help="Input text/markdown file")
    parser.add_argument("--out", "-o", type=Path, help="Optional output path")
    args = parser.parse_args()

    if not args.input.exists():
        print(f"File not found: {args.input}", file=sys.stderr)
        return 1

    raw = args.input.read_text(encoding="utf-8", errors="replace")
    cleaned = clean(raw)

    if args.out:
        args.out.write_text(cleaned, encoding="utf-8")
        print(f"Wrote {args.out} ({len(cleaned)} chars)")
    else:
        sys.stdout.write(cleaned)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
