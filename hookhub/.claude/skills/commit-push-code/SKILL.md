---
name: commit-push-code
description: Stage all changes, generate a conventional commit message, commit, and push to the remote
disable-model-invocation: true
allowed-tools: Bash(git diff --staged) Bash(git status) Bash(git add *) Bash(git commit *) Bash(git push *)
---

## Context
- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Current remote tracking status: !`git status -sb`
- Recent commits: !`git log --oneline -10`

## Your task
Based on the above changes:
1. Stage all changes with `git add`.
2. Create a single git commit with a conventional commit message that reflects the staged changes.
3. Push the commit to the current branch's remote (set upstream with `git push -u origin <branch>` if it has none yet).