# Review Scope

## Target

Whole codebase review of HookHub — a small Next.js 16 App Router application (~5K LOC) that catalogs Claude Code hooks/plugins/agents. User selected "Whole codebase" over "recent changes only" or a narrower focus.

## Files

- `app/layout.tsx`, `app/page.tsx`, `app/globals.css` — App Router routes, root layout, global styles
- `components/item-card.tsx`, `components/site-footer.tsx`, `components/site-header.tsx` — UI components
- `data/catalog.ts` — curated catalog data
- `data/candidates.ts` — candidate/staging data from weekly source discovery
- `scripts/find-new-sources.mjs` — weekly GitHub source-discovery script
- Config: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `package.json`
- Docs: `README.md`, `CLAUDE.md`, `AGENTS.md`, `memory/frontend/CLAUDE.md`, `memory/spec/CLAUDE.md`
- `.claude/settings.json`, `.claude/skills/commit-push-code/SKILL.md`

Excluded: `node_modules/`, `.next/` (build output), `package-lock.json`, `public/*.svg` (static assets), `.playwright-mcp/` (recorded test session artifact), `tsconfig.tsbuildinfo`.

## Flags

- Security Focus: no
- Performance Critical: no
- Strict Mode: no
- Framework: Next.js 16 (App Router) + React 19 + TypeScript (strict) + Tailwind CSS v4 — note: this Next.js version has breaking changes vs. training data; consult `node_modules/next/dist/docs/` before proposing Next.js-specific fixes.

## Review Phases

1. Code Quality & Architecture
2. Security & Performance
3. Testing & Documentation
4. Best Practices & Standards
5. Consolidated Report
