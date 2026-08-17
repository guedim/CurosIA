# Phase 3: Testing & Documentation Review

**Scope:** HookHub codebase (see `00-scope.md`). Confirmed CLAUDE.md's claim of zero test infrastructure (no test runner dependency, no test script, no test files/configs anywhere). Documentation review verified every prior-phase drift claim line-by-line against the real files.

## Test Coverage Findings

**Framework recommendation: Vitest** (unit/component), no e2e framework justified yet — zero-config ESM/TS, `jsdom` for the one component with real logic, avoids standing up a second runner. Given the app is ~95% static catalog data / 5% UI, the risk profile inverts the usual pyramid: data-validation tests should dominate, with a thin component layer and no e2e yet.

### Critical
- **Catalog/candidates data-integrity has zero test coverage, and two live defects are already unprotected**: `aws-samples/sample-claude-code-agent-team` is `status: "rejected"` in `candidates.ts` yet has 5 live rows in `catalog.ts` (one `official: true`); the same repo shows diverging star counts (238799 vs 269273) across different catalog rows. A ready-to-use Vitest suite (`data/catalog.test.ts`) was provided covering: no rejected repo published, no pending candidate already curated, no diverging star counts per repo, category valid for type.

### High
- `find-new-sources.mjs`'s admission-gate logic (star thresholds, staleness checks, `MAX_PLAUSIBLE_STARS`) is inlined in loop bodies inside `main()` rather than extracted into a named, testable function — the exact fail-open bug prior phases flagged (NaN/undefined silently passing every comparison) can only be tested today by mocking `fetch` and running all of `main()` end-to-end, which also does file I/O and network I/O inline with no dependency-injection seam. `main()` also throws at module load time if `GITHUB_TOKEN` is unset, meaning even importing the module for testing requires an env var first.
- No SSR/prerender content assertion exists for `app/page.tsx` — a test asserting all 4 `ItemType` tabs' content appears in static HTML would have caught the `"use client"` bug at commit time. Example `renderToStaticMarkup`-based regression test provided.

### Medium
- `ItemCard`'s `isGitHub` substring check (`item.repoUrl.includes("github.com")`) has no adversarial-input test coverage — directly maps to the security audit's spoofing finding (#8). Recommends extracting to a named `isGitHubUrl` helper and testing against lookalike domains.
- `writeCandidatesFile`'s marker-based text splice into `candidates.ts` has no test for marker drift/malformed match (only throws on total absence).
- No bundle-size budget in CI — `hookhub-ci.yml` runs only lint + build, nothing inspects `.next/` output size, so nothing would have caught the client-bundle bloat. A simple `du`-based CI step was proposed as a stopgap ahead of a proper test.
- No test/protection for the file-write race condition on `data/candidates.ts` under concurrent script runs (same gap flagged in Phase 2's performance review).

### Low
- `formatStars` boundary formatting (1000→"1k", 1500→"1.5k") — untested but cosmetic-only risk.
- Tag-filter interaction state (`toggleTag`, `selectType` resetting tags) — untested but cosmetic/UX-only risk.

**Structural note on maintainability**: `data/catalog.ts` and `data/candidates.ts` have no shared schema/lookup module — a validation test has to hand-roll the cross-reference logic that `find-new-sources.mjs` already does privately (as `knownUrls`) inside `main()`. Extracting a shared `repoUrl`-keyed lookup utility would serve both the validation suite and the discovery script.

## Documentation Findings

### Critical
- **`memory/spec/CLAUDE.md` describes a product that no longer exists**, verified line-by-line: says `data/hooks.ts` with a 4-field `Hook` type, "~10-15 real hooks," an RSC page with explicitly "no `'use client'`, no `useState`/`useEffect`," and explicitly lists search/filtering, GitHub API/star counts, and detail pages as **out of scope**. Reality: `data/catalog.ts`, 8-field `CatalogItem`, 4 entity types, 291 entries, `app/page.tsx` literally opens with `"use client"` and uses `useState` twice for the exact filtering UI the spec calls out of scope, and `stars` is a first-class field populated by a GitHub API bot — the exact integration the spec says is out of scope. No pointer, deprecation banner, or superseding note exists anywhere. Since this is the only "spec" document in the repo, it's a plausible first stop for a new contributor and would actively mislead them on every load-bearing point. Recommendation: delete it or replace with a short "superseded by `data/catalog.ts` + README" pointer.

### High
- **Curation workflow contradicts both the data and the code, confirmed two ways.** (a) The documented "good fit → move + delete from candidates / not a fit → mark rejected, leave it" workflow (both `candidates.ts`'s header and README) has already been violated with no enforcement: `aws-samples/sample-claude-code-agent-team` is simultaneously `"rejected"` in candidates.ts and fully live with 5 catalog entries — same underlying defect as Phase 1's A4 and security finding #6, now confirmed from the documentation-accuracy angle too. (b) The `"rejected"` status is documented (in both `candidates.ts`'s docblock and README) as functionally suppressing rediscovery, but verified in the actual script: `knownUrls` is built from *all* existing candidates regardless of `status` — `"pending"` and `"rejected"` are 100% behaviorally identical in the dedup logic; the field is advisory/human-facing only, and the docs overstate what it does.
- **`official: true` is a security/trust-relevant field documented only as a display concern.** The field's own JSDoc in `catalog.ts:98` reads as pure UI/badge metadata ("Published by the tool's own vendor/org..."), but is also read by the discovery script to build a ~75-org CI trust allowlist with a 10× lower star bar and 4× longer staleness window. README *does* correctly describe this mechanism, but ~200 lines away from the one place a curator is actually looking when deciding whether to check the box — the field's own doc comment. This is the documentation-accuracy angle on the same issue Phase 1 (A5) and Phase 2 (security finding #3) both flagged architecturally/security-wise — now confirmed as a discoverability failure specifically. Recommendation: add the security consequence directly to the field's JSDoc, co-located with the point of data entry.

### Medium
- **Project naming inconsistent across 7+ surfaces** (more than initially estimated): directory `hookhub/`, `package.json` name `"claudecodehub"`, README/UI title `ClaudeCodeHub` (5 locations), workflow `name:` fields say "HookHub CI"/"HookHub Source Discovery", the bot's User-Agent string is `hookhub-source-discovery-bot`, PR labels and commit-message prefixes all say `hookhub`, plus a third historical name `hookplughub` mentioned in README as the pre-rename Vercel project name. README does partially self-document the directory-vs-product split, but never mentions that workflow names/PR labels/commit prefixes/bot User-Agent still say "hookhub" — someone searching Actions runs for "ClaudeCodeHub" (the name README trains them to use) will find nothing.
- **README's inlined workflow YAML has silently drifted from the real files in 2 of 4 cases**, verified by direct diff: `hookhub-source-discovery.yml`'s inlined copy omits an 18-line `body:` block containing the actual curation instructions shown to curators in the PR — undisclosed as an elision (unlike the review workflow's prompt, which *is* disclosed as abbreviated). `claude.yml`'s inlined copy omits step names and all inline comments, also undisclosed. Not functionally significant on their own, but notable that the one piece silently dropped is exactly the curation-instructions text that finding "curation workflow contradicts the data" shows already isn't being followed.
- **No ADR, changelog, or migration doc records the hooks→catalog architectural pivot.** Confirmed no `CHANGELOG.md`, `docs/adr/`, or migration notes exist anywhere. Compounds the Critical finding above — not only is the old spec wrong, nothing else at an above-code level is right either.

### Low
- `data/catalog.ts` has no file-level header docblock (unlike `data/candidates.ts`, which has one) — curation-bar guidance that matters for hand-editing (e.g., README's "keep the RAG tab bar high," Agentes tab's fintech/AWS-serverless audience scope) lives only in README, invisible to a curator opening the data file directly.

## Cross-Phase Corroboration

Every Critical/High finding in this phase either confirms or sharpens a finding from Phases 1–2, reviewed independently by different agents with different framings — strong signal these are real, not artifacts:
- The `aws-samples/...` "rejected but live" contradiction: flagged by architecture (A4), security (#6), test coverage (this phase), and documentation (this phase) — four independent confirmations.
- The `official` flag's dual-use as display + security trust boundary: flagged by architecture (A5), security (#3), and documentation (this phase) — three independent confirmations, now with a concrete discoverability-focused fix (JSDoc update) in addition to the code-level fix (explicit `TRUSTED_ORGS` allowlist) proposed in Phase 2.
- The `"use client"` bug: flagged by code quality (H1), architecture (A1), performance (Critical), and now test coverage (missing SSR regression test) — the most-corroborated finding in the entire review.
