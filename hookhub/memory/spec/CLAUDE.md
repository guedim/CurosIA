# HookHub — MVP Spec

## 1. Overview

HookHub is a directory site for browsing cool, open-source **Claude Code hooks**. Hooks live scattered across individual GitHub repositories and community "awesome list" README files today — HookHub gives them a single, browsable home.

**MVP goal:** display a curated list of hooks in a grid on the home page. Nothing more.

### In scope (MVP)
- A static, curated list of hooks (name, category, description, repo link).
- A single page (`/`) rendering all hooks in a responsive grid.
- Each hook card links out to its GitHub repository.

### Explicitly out of scope (MVP)
- User submissions / "add a hook" form.
- Authentication or accounts.
- Search or category filtering.
- Individual hook detail pages.
- A database or CMS (data is static/local for now).
- GitHub API integration (star counts, last-updated, etc.).

These are noted as future ideas in §6, not part of this build.

## 2. Background: what is a Claude Code hook?

Claude Code hooks are shell commands that run automatically at specific points in Claude Code's execution lifecycle — e.g. `PreToolUse` (before a tool runs, can block it), `PostToolUse` (after a tool runs), `Notification`, `Stop`, `SessionStart`, and others. They're configured in a project or user's `settings.json` and are commonly used for things like blocking edits to sensitive files, auto-formatting after writes, sending notifications, logging tool use, or enforcing custom guardrails.

The community maintains hooks in open-source GitHub repos (e.g. `pascalporedda/awesome-claude-code`, `ithiria894/awesome-claude-code-hooks`, `hesreallyhim/awesome-claude-code`), typically as standalone scripts or as part of larger "awesome list" collections. HookHub's role is to make these individually discoverable and browsable, rather than buried in README lists.

## 3. Data model

```ts
type HookCategory =
  | "security"
  | "formatting"
  | "notifications"
  | "logging"
  | "testing"
  | "automation"
  | "workflow";

interface Hook {
  name: string;
  category: HookCategory;
  description: string; // 1–2 sentences
  repoUrl: string;      // link to the GitHub repo containing the hook
}
```

Categories are grouped by **purpose** (what the hook does for the user) rather than by raw lifecycle event name (`PreToolUse`, etc.) — this is more approachable for browsing. The underlying lifecycle event can be surfaced later as a secondary tag if needed.

### MVP data source

A static local file, `data/hooks.ts`, exporting a `Hook[]` array. Seed it with ~10–15 real, representative hooks sourced from community collections (e.g. a file-protection/security hook, an auto-formatter hook, a desktop-notification hook, a logging hook, a test-runner hook). No database, no CMS, no API calls — the array is imported directly by the page.

## 4. Functional requirements

### Home page (`/`)
- Header: site name ("HookHub") + a short tagline (e.g. "Discover open-source hooks for Claude Code").
- Renders **all** hooks from `data/hooks.ts` in a responsive grid:
  - 1 column on mobile, 2 columns on tablet, 3 columns on desktop (Tailwind `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` or similar).
- Each hook is rendered as a **card** showing:
  - Name (prominent, e.g. `h3`)
  - Category (small badge/pill, color- or label-differentiated per category)
  - Description
  - A link/button to the GitHub repo, opening in a new tab (`target="_blank" rel="noopener noreferrer"`)
- No pagination needed at MVP scale (~10–15 items).

## 5. Non-functional requirements

- Built as a **React Server Component** page — no `'use client'`, no `useState`/`useEffect` needed since there's no interactivity yet.
- Styled with Tailwind CSS v4 utility classes, consistent with the existing scaffold (`app/globals.css`).
- Mobile-first responsive layout.
- Accessible: links have discernible text (hook name, not just "view repo"), sufficient color contrast on category badges.
- No new dependencies required beyond what's already scaffolded (Next.js, React, Tailwind).

## 6. Out of scope / future ideas

- Search bar / category filter chips.
- Individual hook detail pages (`/hooks/[slug]`) with install instructions.
- Community submission flow (form + review, or PR-based).
- Live GitHub metadata (stars, last commit) via the GitHub API.
- Persistent storage (Supabase or similar) once submissions are supported.
- Sorting (by name, category, popularity).

## 7. Acceptance criteria

- [ ] Visiting `/` renders a grid of all hooks defined in `data/hooks.ts`.
- [ ] Grid is 1 column on narrow viewports and expands to multiple columns on wider viewports.
- [ ] Each card displays name, category, description, and a working link to the GitHub repo.
- [ ] Repo links open in a new tab.
- [ ] `npm run lint` passes with no errors.
- [ ] `npm run build` completes successfully.
