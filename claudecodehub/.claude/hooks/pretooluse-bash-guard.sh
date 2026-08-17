#!/usr/bin/env bash
# PreToolUse hook (matcher: Bash) — blocks a short list of destructive/irreversible
# command patterns before they run. Reads hook input JSON on stdin.
set -euo pipefail

cmd="$(jq -r '.tool_input.command // empty')"

deny_pattern='(rm -rf /($|[[:space:]])|:\(\)\{ ?:\|:& ?\};:|mkfs\.|dd if=.*of=/dev/(sd|nvme|hd)|> ?/dev/(sd|nvme|hd)|chmod -R 777 /|curl[^|]*\| *(sh|bash)|wget[^|]*\| *(sh|bash)|git push[^&]*--force|git reset --hard)'

if [[ -n "$cmd" ]] && echo "$cmd" | grep -qE "$deny_pattern"; then
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"Blocked by security hook: potentially destructive command pattern detected"}}'
else
  printf '{}'
fi
