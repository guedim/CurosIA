# ClaudeCodeHub — Spec (superseded)

This document described the original MVP (a single `data/hooks.ts` array of
~10–15 hooks, a static RSC-only page, no filtering, no star counts). That
MVP shipped and was then substantially extended — none of what follows is
current.

**For the actual current data model, features, and curation workflow, see:**

- `data/catalog.ts` — the live schema (`CatalogItem`, a discriminated union
  over 4 entity types: `hook`, `plugin`, `rag`, `agent`), plus the per-tab
  curation bar in its header docblock.
- `data/candidates.ts` — the weekly-discovery curation queue and workflow,
  documented in its header docblock.
- `README.md` — feature overview, "Adding a new hook, plugin, RAG tool, or
  agent" section, and the weekly source-discovery bot's design.

Notable differences from the original MVP scope below, for anyone tracing
history: the catalog grew from 1 entity type to 4 (hooks/plugins/RAG/agents,
~290 entries total); `app/page.tsx` now has interactive tab and stack-tag
filtering (a `CatalogBrowser` client island, with the actual catalog data
still rendered server-side); GitHub star counts and an "official" badge were
added, fed by an automated weekly discovery bot (`scripts/find-new-sources.mjs`)
that opens PRs for human curation.
