---
name: commite-code
description: Generate a conventional commit message and commit staged changes
disable-model-invocation: true
allowed-tools: Bash(git diff --staged) Bash(git status) Bash(git commit *)
---

## Context
- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`

## Your task
Based on the above changes, create a single git commit.