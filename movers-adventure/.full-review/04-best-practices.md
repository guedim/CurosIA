# Phase 4: Best Practices & Standards

## Framework & Language Findings

### Medium

- **B1 · Entire application lives in global scope — no module boundary.** Two `<script>` blocks (L520–2064) with no IIFE, no `'use strict'`, no `type="module"`. ~104 top-level `function`/`let`/`const` declarations land directly on `window` (`State`, `VOCAB`, `GAMES`, `say`, `reward`, all 12 `startX()` functions, etc.). Any future third-party script sharing the origin (ad snippet, extension content-script) that happens to declare `say`, `pick`, `show`, or `State` would silently clobber app state; there's also no accidental-global protection against typos. **Fix:** wrap both script blocks in `type="module"` (gives strict mode + scoping for free with no bundler) — the only adjustment needed is that the 53 inline `onclick="..."` handlers would need `window.fnName = fnName` re-exports since module scope doesn't leak to inline HTML attributes. A lower-effort alternative: a single `(function(){ 'use strict'; ... })();` IIFE wrapper gets most of the benefit with zero markup changes.
- **B2 · `SpeechRecognition` setup is duplicated near-verbatim between `startTalk()` (L1058–1109) and `startCharades()` (L1189–~1225)** — ~25 lines instantiating the recognizer, wiring four handlers, and scoring the transcript, copy-pasted between the two speaking games. This is also exactly the code where the known "never `.abort()`ed" bug (flagged in Phases 1–3) lives in two places instead of one. **Fix:** extract a shared `attachSpeechCheck(micEl, heardEl, fbEl, targetSentence, onPass)` helper that returns the recognizer handle, so both games share one implementation and the eventual `.abort()`-on-navigation fix becomes a one-line change instead of a two-site patch.

### Low

- **B3** — 15 silent `catch(e){}` blocks (L562, 569, 570, 579, 594, 603, 1090, 1218, 1491, 1493, 1888, 1894, 2060) discard exceptions with no diagnostic trail, undermining the app's own on-screen error reporter (L522) which only sees *uncaught* errors — these sites explicitly prevent that. Recommend routing through a shared `safeCall(fn)` helper that at least `console.warn`s, or using the optional catch binding (`catch{}`, no `e`) at sites where the ignore is genuinely intentional, to make "chose to ignore" visually distinct from "forgot to handle."
- **B4** — Zero uses of `?.`/`??` anywhere in the file despite the exact guard/fallback patterns they exist for (e.g. `if(window.speechSynthesis)speechSynthesis.cancel()` repeated 8× — L742–743, 753, 1909, 1980, 2004, 2010 — could be `window.speechSynthesis?.cancel()`; the 4-deep `||` voice-fallback chain at L547–550 reads more clearly as `??`). Purely a readability win — codebase already targets browsers with full support for both operators (`SpeechRecognition`, unprefixed `AudioContext` fallbacks are already in use).
- **B5** — Two anonymous `function(){}` expressions (L522, L2068) are the only non-arrow-function callbacks in an otherwise all-arrow-function codebase (~95 definitions). Harmless but a one-line normalization opportunity.
- **B6** — `loadExamHistory()` (L1889) only guards against malformed JSON, not wrong-shape JSON (e.g. `"{}"` or `"42"` parses successfully but isn't an array); `renderExamHistory()` then throws on `.length`/`.slice()`. **Fix:** `return Array.isArray(v) ? v : [];` after parsing. (Same underlying gap as Phase 2's S3/Phase 3's T4 — noted here from the idiom-correctness angle since it's a one-line, zero-risk fix.)

### Checked, no findings

`var` usage is essentially absent (one harmless scoped instance). No deprecated APIs — `SpeechRecognition`/`webkitSpeechRecognition` and `AudioContext`/`webkitAudioContext` fallback patterns are both currently-correct feature detection. Modern array/object methods, spread, template literals already used pervasively and idiomatically; no legacy index-loops or string-concatenation loops. `<template>` element judged not a compelling win — the real fix for the `innerHTML`-string-building duplication is the shared game-engine extraction already flagged in Phase 1 (H4/A5). Package management and build config correctly out of scope — zero-dependency, zero-build is a sound choice at this project's scale.

---

## CI/CD & DevOps Findings

**Grounding:** the repo root is a monorepo with existing `.github/workflows/` — but every workflow there targets a different sibling project (`claudecodehub`) or is a generic Claude Code review workflow; none touch `movers-adventure`. `movers-adventure/` itself has no CI config, no `package.json`, no linter/test-runner config. `git log` shows changes land on `main` via squash-merged PRs with no automated gate in between.

### High

- **C1 · No real deployment exists, despite the README advertising an "Installable PWA."** README instructions are "open `index.html` directly… or serve with any static file server" — i.e. deployment today is ad hoc, presumably `file://` in practice. Confirmed in code: the service-worker registration guard (L2067–2068) explicitly skips non-HTTP(S) origins, and browsers don't offer "Add to Home Screen" for `file://` pages either — so under the README's own stated usage, none of the PWA value is reachable, independent of the already-flagged missing `sw.js` file. **Fix:** GitHub Pages is the obvious zero-cost fit (repo already on GitHub, static single file, zero build step) — a ~10-line `actions/upload-pages-artifact` + `actions/deploy-pages` workflow, or Pages configured directly from a branch/`docs/` folder. Once live, decide deliberately whether to ship a real `sw.js` or strip the install/offline claims from the README, since a 404 on a real origin is a user-visible bug rather than a silently-swallowed no-op.

### Medium

- **C2** — No CI automation at all (lint, HTML validation, syntax check, security scan). For a 2000+ line single file hand-edited over time, a single unbalanced brace/quote can white-screen the entire app for every user with no warning beyond the in-page error banner. **Fix, proportionate to scale:** a small GitHub Actions workflow scoped to `paths: ['movers-adventure/**']` running HTML validation (`npx html-validate` or W3C validator) and a headless-browser load-and-check-for-console-errors smoke test (Playwright) — no `package.json` required if invoked via `npx <tool>@latest`. ~15–30 lines of YAML, seconds of runtime.
- **C3** — No rollback/incident-response plan, contingent on C1's deployment landing. **Fix:** tag each deployed state (`git tag`) so "what was live before this broke" is a lookup, not archaeology; lean on GitHub Pages' built-in deployment history (redeploy a prior successful Actions run) as the primary rollback mechanism rather than building custom tooling — proportionate for a single-file, no-build deploy model.

### Low

- **C4** — The existing on-screen `window.onerror` banner (L521–523) is a sound, correctly-scoped choice for the deployment context (old tablets, no devtools) but is ephemeral — lost the moment the tab closes, and only catches `error` events, not `unhandledrejection` (a rejected Promise from `SpeechRecognition`/`speechSynthesis` currently triggers nothing). **Fix, staying zero-network/zero-dependency:** persist the last 10–20 errors to `localStorage` under a new key (same capped-array pattern already used for `movers_exam_history`, L1893), and add an `unhandledrejection` listener alongside the existing `error` listener. Optionally surface a "copy error log" button in the parents' modal so a parent can report a bug without any telemetry service.
- **C5** — Infrastructure as Code and environment management are correctly N/A at this scale (no server, no secrets, no environments) — no action needed.
