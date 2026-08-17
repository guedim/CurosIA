# Phase 4: Best Practices & Standards

**Scope:** HookHub codebase and its CI/CD workflows (see `00-scope.md`). Framework review cross-checked every claim against the bundled `node_modules/next/dist/docs/` for Next.js 16.3.0 rather than training-data assumptions, and ran `npm outdated`. CI/CD review verified live GitHub branch-protection state via `gh api` and inspected all four workflow files at the monorepo root.

## Framework & Language Findings

### Medium
- **Node script flag is a no-op**: `scripts/find-new-sources.mjs` is invoked with `--experimental-strip-types` (both in the file's own shebang comment and in `hookhub-source-discovery.yml`), but the file is `.mjs` with zero TypeScript syntax — the flag only applies to `.ts`/`.mts`/`.cts` files and does nothing here. Also noted: even where applicable, this flag is increasingly unnecessary since recent Node releases strip erasable TS syntax by default without any flag. Fix: drop the flag; if type-annotations were intended, rename to `.ts`.
- **`next.config.ts` is an empty scaffold with no site-appropriate configuration.** For a fully static, Vercel-deployed content site, `typedRoutes: true` (stable in Next 16, catches broken `<Link href>`s at compile time) and `poweredByHeader: false` are both relevant and unused. `output: 'export'` and `cacheComponents` were considered and correctly rejected as not appropriate here.
- **No SEO metadata file conventions** for a site whose entire purpose is public discovery/sharing: no `metadataBase`, no `openGraph`/`twitter` fields (social shares currently render no preview card), no `app/sitemap.ts`/`app/robots.ts` (trivial, typed, first-class App Router conventions). Directly reinforces Phase 1's C2 finding (no sitemap/robots) with concrete Next-16-idiomatic fixes.
- **Design tokens defined but bypassed** — same root defect as Phase 1/2's M7/C5/B5, reconfirmed independently: `--bold-gradient` is defined in `@theme inline` but never referenced; the gradient it should represent is hand-duplicated across 4 files with an inconsistency between them (`via-[#7a2ea8]` vs `via-[#121e6c]`); `site-header.tsx` hardcodes `bg-[#07060f]/80` instead of the already-exposed `bg-background/80` utility.
- **Dependency currency**: `@types/node` pinned to `^20` while CI/deploy actually run Node 22 — types should track the runtime. `next`/`eslint-config-next` are one trivial patch behind (16.3.0 → 16.3.1, should stay in lockstep). No `engines` field in `package.json` to pin the supported Node range.

### Low
- Five unused `create-next-app` scaffold SVGs in `public/` — confirmed unreferenced anywhere, dead deploy weight.

### Confirmed correct (verified against Next 16 docs, not assumed)
`LayoutProps<"/">` typed layout props, `next/font/google` usage, bare `next dev`/`next build` scripts (no `--turbopack` needed, stable by default), `eslint.config.mjs` flat config matching the current documented recommendation exactly, no legacy React patterns (`forwardRef`/`defaultProps`/`PropTypes`/`React.FC`) anywhere, `@theme inline` is the correct Tailwind v4 mechanism (the *usage* gap above is separate from the mechanism being right).

## CI/CD & DevOps Findings

Verified live via `gh api`: `main` has **no branch protection** (`404 Branch not protected`). No `vercel.json`, `.env.example`, or `.env*` files exist anywhere under `hookhub/`.

### High
- **`main` has no branch protection — CI is advisory, not a gate.** `hookhub-ci.yml` runs lint+build on push/PR, but nothing requires it to pass before a merge or direct push to `main` is accepted. A red CI run has zero effect on whether code lands on `main` or deploys. **Rated the single highest-leverage fix in this entire phase.**
- **Vercel production deploy is not confirmed to wait on CI success** — README documents that any push to `main` touching `hookhub/` auto-deploys to production; this is Vercel's git integration acting independently of GitHub Actions, with no verified "wait for CI" gate. Combined with the branch-protection gap, a broken build could reach production before or regardless of CI finishing. (Reviewer could not directly verify the Vercel dashboard setting in this environment — flagged for manual confirmation by the project owner.)

### Medium
- **No `vercel.json`** — deployment config (Root Directory, build command, folder-scoping) lives only in the Vercel dashboard with no git history/PR review trail; a UI click can silently break config with no corresponding code change to review.
- **Discovery bot failures have no alerting**, and — a new finding beyond what Phase 1/2 flagged — **GitHub automatically disables scheduled (cron) workflows after 60 days of repo inactivity**, which is a second, distinct silent-failure mode (the job never runs at all, not just fails) not previously identified. Recommends a graduated fix: GitHub's built-in failed-run email notifications (free) → a `github-script` step that opens an issue on failure → a dead-man's-switch heartbeat service (catches both failure modes, including the cron-disablement case).
- **No documented incident-response runbook** for a bad `catalog.ts` PR reaching production (distinct from the discovery-bot risk, which is well-contained since candidates.ts is never rendered) — no rollback/revert steps documented anywhere.

### Low
- No `concurrency` group on `hookhub-ci.yml` (redundant runs on rapid pushes aren't canceled).
- Inconsistent `actions/checkout` version across workflow files (`@v6` in one, `@v4` in the other three) — separate from the already-flagged SHA-pinning issue, this is an internal-consistency gap.
- Rollback capability exists via Vercel's immutable deployments but is undocumented in the README.
- No CI status badge in README; no production uptime monitoring (reasonable at this scale, but a broken-but-"successful" build could go unnoticed indefinitely).

### Confirmed correct / no gap
- `npm ci` caching in `hookhub-ci.yml` is correctly configured for a monorepo subfolder (`cache-dependency-path: hookhub/package-lock.json`).
- The discovery bot's blast radius is well-contained by design: it only opens PRs (never auto-merges), and `candidates.ts` is confirmed never imported by the rendered site — even a fully garbage discovery PR can only pollute the curation queue, not break production.
- Environment/secrets management has no gap: the app itself uses zero env vars (correctly not over-engineered), and CI secrets (`CLAUDE_CODE_OAUTH_TOKEN`, ephemeral `GITHUB_TOKEN`) are minimally scoped with explicit job-level `permissions:` blocks in most workflows (aside from the already-flagged discovery-workflow `contents: write` over-grant).

## Cross-Phase Corroboration

- Design-token bypass: now confirmed by three independent reviews (Phase 1 code-quality M7, Phase 1 architecture C5, Phase 4 framework) — clearly a real, recurring maintenance hazard, not a one-off nit.
- Missing sitemap/robots/SEO metadata: Phase 1 architecture (C2) flagged the absence; Phase 4 framework confirms it's not just missing but straightforward to add correctly per current Next 16 conventions, with the `metadataBase`/OG gap being a new, more concrete addition (social share previews currently render blank).
- The branch-protection gap is a **new, high-severity finding not surfaced in any prior phase** — worth emphasizing in the final report as a standalone operational risk distinct from the code-level findings.
