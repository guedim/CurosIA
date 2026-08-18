# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

All commands run from this directory (`claudecodehub/`):

- `npm run dev` — start the dev server (<http://localhost:3000>)
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`: `eslint-config-next` core-web-vitals + TypeScript presets)
- `npm run validate-catalog` — data-integrity gate for `data/catalog.ts` / `data/candidates.json` (also runs in CI); catches a `"rejected"` candidate that's nonetheless published, a `"pending"` candidate already curated into the catalog, diverging star counts for the same repo, and category/type mismatches

There is no test framework configured.

## Monorepo context

This directory is a subfolder of the `CurosIA` monorepo, not its own git repository. Two things follow from that:

- GitHub Actions workflows for this project (CI, PR review, weekly source discovery, the `@claude` responder) live at the **monorepo root**, `../.github/workflows/`, not inside `claudecodehub/` — Actions only reads workflow files from the repo root. Run `git rev-parse --show-toplevel` to confirm the real root before creating or editing one.
- The monorepo's root `.gitignore` has a blanket `data/` rule (meant for AI dataset folders elsewhere in the monorepo). `claudecodehub/.gitignore` negates it (`!data/`, `!data/**`) so `data/catalog.ts` — the file holding the entire site catalog — stays tracked. Don't remove that negation.

## Architecture

Next.js 16 App Router project (React 19, TypeScript strict, Tailwind CSS v4). It's a static, no-backend gallery site: no database, no env vars, no auth — every entry is a plain data record rendered as a card.

- `app/page.tsx` — home page; renders every catalog item server-side and passes the resulting markup as `children` into `CatalogBrowser`.
- `components/catalog-browser.tsx` — the only client component (`"use client"`). It owns the Hooks/Plugins/RAG/Agentes/Workflows/Commands tab state and the stack-tag filter, but never receives item content (name, description, etc.) as props — only lightweight `{id, type, tags}` metadata. Filtering toggles a `hidden` class on the pre-rendered server children rather than conditionally rendering them, so the full catalog stays present in the static/prerendered HTML (crawlable, works with JS disabled) while item data never enters the client bundle.
- `components/item-card.tsx`, `site-header.tsx`, `site-footer.tsx` — presentational server components.
- `data/catalog.ts` — the entire production catalog (`CatalogItem` type + `catalogItems[]`), assembled from separate `hooks` / `plugins` / `rag` / `agents` / `workflows` / `commands` arrays. Each type has its own category union (`HookCategory`, `PluginCategory`, `RagCategory`, `AgentCategory`, `WorkflowCategory`, `CommandCategory`) plus a shared optional `StackTag[]`. This file *is* the database — adding/removing a catalog entry means editing it directly, no migration involved. Curation bar differs by tab (documented in the file's header comment): hooks/plugins are admitted broadly, RAG keeps a high bar (only the most popular, actively maintained tools), agents/workflows/commands are curated specifically for a fintech/banking, DDD/hexagonal-architecture, 100% Python, 100% AWS-serverless audience — workflows favor end-to-end orchestration frameworks over single hooks or individual subagents, while commands favor one atomic slash command per entry (linked to its specific file, not the whole repo), which already have their own tabs.
- `data/candidates.ts` / `data/candidates.json` — curation queue populated weekly by the `find-new-sources.mjs` GitHub Action; not imported by the site itself. To curate: move a good entry into the matching array in `catalog.ts` and delete it here, or set `status: "rejected"` on a bad one (never delete a rejected entry outright — that's what stops the bot from re-suggesting the same repo).
- `scripts/validate-catalog.mjs` — the script behind `npm run validate-catalog`.
- `scripts/trusted-orgs.mjs` — an allowlist, keyed by pinned numeric GitHub org id, that lowers the discovery bot's admission bar for those orgs' repos. Treat changes here as security-relevant, not a routine catalog edit.
- Styling: Tailwind v4 via the `@tailwindcss/postcss` PostCSS plugin — no `tailwind.config` file; the Bold.co-inspired dark theme tokens live in `app/globals.css`.
- Path alias: `@/*` maps to the project root (see `tsconfig.json`).

## Claude Code skill

This repo ships a project-level skill at `.claude/skills/commit-push-code/SKILL.md`, invoked with `/commit-push-code`: stages all changes, generates a conventional commit message, commits, and pushes to the current branch's remote. Explicit-invocation only (`disable-model-invocation: true`) — Claude won't run it unprompted.

The AGENTS.md block above is authoritative: this Next.js version may differ from training data — consult `node_modules/next/dist/docs/` before writing Next.js-specific code.
