#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Claude Code status line.

Shows:
  - Context window usage for the current conversation (used %)
  - Claude.ai subscription session usage (5-hour window, used %) and its reset time
"""

import json
import sys
from datetime import datetime


RESET = "\033[0m"
DIM = "\033[2m"
CYAN = "\033[2;36m"
YELLOW = "\033[2;33m"
GRAY = "\033[2;37m"


def fmt_pct(value):
    if value is None:
        return "--"
    return f"{value:.0f}%"


def fmt_reset_time(epoch_seconds):
    if epoch_seconds is None:
        return None
    try:
        return datetime.fromtimestamp(epoch_seconds).strftime("%-I:%M %p")
    except (OSError, OverflowError, ValueError):
        return None


def main():
    try:
        data = json.load(sys.stdin)
    except json.JSONDecodeError:
        print(f"{GRAY}status line: invalid input{RESET}")
        return

    context_window = data.get("context_window") or {}
    context_used = context_window.get("used_percentage")

    rate_limits = data.get("rate_limits") or {}
    five_hour = rate_limits.get("five_hour") or {}
    session_used = five_hour.get("used_percentage")
    session_reset = fmt_reset_time(five_hour.get("resets_at"))

    parts = [f"{CYAN}Context {fmt_pct(context_used)}{RESET}"]

    session_part = f"{YELLOW}Session {fmt_pct(session_used)}"
    if session_reset:
        session_part += f" (resets {session_reset})"
    session_part += RESET
    parts.append(session_part)

    print(f"{DIM}|{RESET} ".join(parts))


if __name__ == "__main__":
    main()
