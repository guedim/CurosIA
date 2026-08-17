# Phase 1: Code Quality & Architecture Review

**Scope:** HookHub codebase (see `00-scope.md`). Both reviews independently ran `next build` / `npm run lint` and scripted consistency checks over the 290-row catalog and 158-row candidate queue.

## Code Quality Findings

### High
- **H1 — Page-level `"use client"` ships the entire 111 KB catalog to the browser** (`app/page.tsx:1`). Whole route is a client entry point; all 290 catalog entries cross the network as a JS chunk (98 KB raw / 23.3 KB gzip) in addition to the prerendered HTML. Fix: move `"use client"` down to an extracted `CatalogBrowser` component, or drive filters via `searchParams`.
- **H2 — `Category` is a flat union; nothing ties it to `type`** (`data/catalog.ts:41,87-101`). `{ type: "hook", category: "vector-db" }` compiles. Currently 0 violations across 290 rows (verified), but it's an unenforced invariant in a hand-curated, weekly-growing dataset. Fix: discriminated union on `type`.
- **H3 — Discovery script swallows every GitHub API failure and exits 0** (`scripts/find-new-sources.mjs:81-87`). A fully broken run (expired token, rate limit, 5xx) is indistinguishable from "0 new candidates found" — job stays green, PR step is skipped, nobody is notified. Related: `daysAgo()` silently passes stale-filter on missing `pushed_at` (NaN comparison).

### Medium
- **M4** — Duplicated/already-diverged filter pipeline between the org-search and topic-search loops (`find-new-sources.mjs:159-189`).
- **M5** — Regenerating `candidates.ts` from the marker onward discards anything a human adds below the array (reviewer notes, extra fields) on every weekly run (`find-new-sources.mjs:127-138`).
- **M6** — `CandidateStatus` is documented as load-bearing for dedup but is never actually read for that purpose; `"pending"` and `"rejected"` behave identically. Queue has 154 pending vs. 3 rejected, never draining. Top pending entries include `anthropics/claude-code` itself and repos exceeding the "implausible stars" guard's intended reach.
- **M7** — Brand color tokens defined in `globals.css`/`@theme inline` are used **zero times**; 34 raw hex literals instead, including two disagreeing "brand gradients" (one using an undocumented `#7a2ea8`).
- **M8** — Discovery API cost grows linearly with catalog size: 75 orgs + 12 topics = 87 sequential queries, ~3 min runtime, ~28.6 req/min against a 30 req/min GitHub limit with no backoff/retry.
- **M9** — Filter state lives only in `useState` — unshareable, not indexable, browser back doesn't undo a filter. No `app/error.tsx` (Next 16 renamed `reset`→`retry`).
- **M10** — Incomplete ARIA tabs implementation: `role="tab"`/`aria-selected` present but no `aria-controls`, no `role="tabpanel"`, no roving tabindex/arrow-key handling.
- **M11** — Four exported category-array constants (42 lines) are dead code, imported nowhere, duplicating the type unions by hand.
- **M12** — Star counts are one-time snapshots with no refresh path; no `starsAsOf` field, so staleness is invisible to readers.

### Low
- L13 `formatStars` has no NaN/negative/≥1M-format guard. L14 `capitalize` mangles hyphenated categories (`"ci-cd"` → `"Ci-cd"`). L15 composite React key `item.repoUrl + item.name` has no separator (11 rows already share one `repoUrl`). L16 non-portable dynamic `import()` of a raw path (breaks on Windows). L17 `repoUrl` misnamed for 2 vendor-page entries. L18 project name inconsistent across 4 places (`hookhub`/`claudecodehub`/`ClaudeCodeHub`/bot user-agent). L19 `sleep` fires needlessly after the final loop iteration. L20 lint has no `--max-warnings 0`; no standalone typecheck script; `.mjs` script excluded from `tsconfig.json` include. L21 empty `next.config.ts` scaffold comment. L22 heading hierarchy skips `h2`. L23 README inlines full workflow YAML verbatim (drift risk).

## Architecture Findings

### High
- **A1 — Whole catalog shipped client-side; 82% of content absent from prerendered HTML** (`app/page.tsx:1`). Same root cause as code-quality H1, confirmed independently via build output diffing: only the 51 `hook` rows appear in `.next/server/app/index.html`; the other 239 rows exist only as client JS. Contradicts the project's own written standards (`memory/spec/CLAUDE.md`, `memory/frontend/CLAUDE.md` both mandate RSC / no `use client`) and Next 16's own bundle-size guidance.
- **A2 — Same as code-quality H2**, framed as a data-model defect: `Category` union loses information on collision (`"testing"`, `"code-review"`, `"documentation"` belong to multiple entity types).
- **A3 — `repoUrl` is not an identity; repo-level facts are denormalized and have *already diverged*.** One repo backs up to 11 rows (`affaan-m/everything-claude-code`). `stars`/`official` are copied per-row and have measurably drifted: `affaan-m/everything-claude-code` shows both 238799 and 239029; `obra/superpowers` shows 269273 and 269133; the same `anthropics/claude-plugins-official` bundle shows both 33269 and 33330 stars *in the same file*. Recommend splitting `SourceRepo` from `CatalogItem` with a stable `id`.
- **A4 — Dual-write between `catalog.ts` and `candidates.ts` with a manual, unenforced delete step; 5 records are already inconsistent.** `aws-samples/sample-claude-code-agent-team` is simultaneously marked `"rejected"` in candidates *and* published as 5 live catalog rows — a direct contradiction. Four more repos sit as `"pending"` while already curated. CI runs only lint+build, which cannot catch this class of defect (it's data, not code). **Ranked as the single highest-value fix**: a `scripts/validate-catalog.mjs` wired into CI would convert every finding in this cluster from "recurs weekly" to "blocked at PR."
- **A5 — `official` does double duty as a UI badge and as the discovery bot's trust boundary**, and the derived trusted-org allowlist has silently grown to 75 orgs (including `microsoft`, `apache`, `aws`, `vercel`, `cloudflare`...) admitted at a much lower star bar. A presentation flag is driving ingestion policy — inverted dependency direction.

### Medium
- B1 (=code-quality H3, same finding from the architecture lens: no failure signal on total API outage). B2 — lossy code-generation into a hand-edited source file (`candidates.ts`); recommends switching to JSON. B3 — candidate queue has no bound and no terminal "curated" status, so accepted items simply vanish (no positive-decision record) once deleted. B4 — `categoryStyles` presentation map is keyed on the global flat category union, coupling the UI component to the entire cross-type taxonomy. B5 — hand-mirrored unions/arrays (`StackTag`, `tabs`) plus the same dead-code category arrays noted in M11. B6 — `stars` has no `MAX_PLAUSIBLE_STARS` enforcement on the *catalog* (only on the untrusted candidate intake) — 16 catalog rows already exceed the script's own plausibility ceiling. B7 — checked-in spec (`memory/spec/CLAUDE.md`) describes a product that no longer exists (10-15 hooks, RSC-only, no star counts, no search/filtering) — actively misleading for a new contributor; recommends an ADR-style pivot record.

### Low
- C1 — single route means no deep links/shareable filters/per-item pages (explicitly notes the *absence* of API routes is architecturally correct for this static site — the routing surface is the gap, not the HTTP surface). C2 — no `sitemap.ts`/`robots.ts`/per-page metadata (low priority until C1 lands). C3 — script portability issues (same as L16) plus missing `discover` npm script and missing `"type": "module"`. C4 — CI validates code but not data (same conclusion as A4: the validation script is "the highest-value test in this repo"). C5 — design tokens defined but unused (same as M7), with additional detail: the "official" `--bold-gradient` doesn't even match what's rendered in the four hardcoded gradient instances.

## Critical Issues for Phase 2 Context

Both reviewers converged independently on the same core findings, which strongly signals these are real (not reviewer artifacts):

1. **`"use client"` on `app/page.tsx` ships 100% of catalog data to every visitor and hides 82% of content from prerendered HTML/crawlers** — performance-relevant for Phase 2's performance review (bundle size, unnecessary client-side data transfer, no code-splitting by tab).
2. **Data-integrity defects are live, not hypothetical**: 5 repos exist in contradictory states across `catalog.ts`/`candidates.ts` (one marked "rejected" yet published), and star counts have diverged for the same repo within a single file. Relevant to Phase 2 security/performance only tangentially, but critical for Phase 3 (testing — no data validation exists) and should be flagged again in the final report regardless of Phase 2 findings.
3. **Discovery script (`scripts/find-new-sources.mjs`) fails silently on total API outage** and has no request timeout — worth checking in Phase 2 for any auth/token-handling or SSRF-adjacent concerns given it's an unattended, cron-triggered script calling an external API with a `GITHUB_TOKEN`.
4. **75-org trust allowlist derived from a UI display flag (`official`)** — worth a security-lens look at whether this expands the automated ingestion attack surface (e.g., a bad actor squatting under a trusted org namespace) beyond what Phase 1 flagged as an architectural coupling issue.
