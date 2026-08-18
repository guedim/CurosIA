# Phase 1: Code Quality & Architecture Review

## Code Quality Findings

### High

- **H1 · Star-scoring is unreachable in 10 of 12 games; Memory Match capped at 1⭐** (`reward()` L752–775, callers throughout L780–1485). Every MCQ/build loop only advances `round` on a *correct* answer, so `score === total` is forced by construction — every one of those games always awards the max 3⭐ regardless of mistakes. Memory Match inverts the bug: perfect play (`tries===6`) maps to `9-6=3`, and `3/9=0.33` → capped at 1⭐, unbeatable. This makes the level-unlock economy (`WORLDS[].need`) meaningless. **Fix:** track a `missed` flag per round and only increment `score` on a clean first attempt; for Memory Match, score the literal ratio (`words.length/tries`) instead of an invented scale.
- **H2 · Deferred callbacks are never cancelled — back-navigation hijacks the screen, exiting an exam throws** (11× `setTimeout(next,…)` in games L809–1476; `renderChoice`/`renderWriteIn`/`renderSequentialMatch` timers L1636–1730; `exitExam` L2002–2007). Tapping ⬅️ during a pending timeout lets the stale callback fire after navigation — in games this can silently re-award/hijack the reward screen; in the exam it dereferences a nulled `ExamState` and throws a `TypeError` surfaced to the child via the on-screen debug bar. A third variant can render the next exam part on top of the break screen if a timer expires mid-callback. **Fix:** a monotonic generation token (`gen`/`later()`) bumped on every screen transition, replacing all 14 bare `setTimeout` call sites.
- **H3 · `State.stars` (cumulative) and `State.levelStars` (max) diverge** (L607–610, L757–758). Replaying a game keeps inflating the header ⭐ pill while the actual unlock-gating total (`starsIn()`) only takes the best score — the number shown to the child is not the number that gates progression. **Fix:** derive the displayed total from `levelStars` (drop the separate `stars` accumulator).
- **H4 · Six near-identical MCQ round loops (~200 duplicated lines)** duplicate an abstraction (`renderChoice`/`runChoiceLoop`) that already exists for the exam and was never back-applied to the 12 mini-games. Each of H1's and H2's bugs therefore exists in 5+ separate places. **Fix:** add a `runPracticeChoice()` engine (retry-until-correct + inline feedback) and express the games as data.
- **H5 · Four vocabulary words share an emoji** (🪑 chair/desk, 🌙 moon/night, 🦷 tooth/dentist, 🦵 leg/kick — `VOCAB` L615–645). `allWords()` dedupes by word, not emoji, so MCQ distractor pools can present two tiles that look identical, one marked wrong — actively miseducates the exact thing the app teaches. **Fix:** reassign distinct emoji; add a dev-time assertion to prevent regression.

### Medium (11 findings, condensed)

- **M1** — `startTalk`/`startCharades` duplicate the entire SpeechRecognition wiring verbatim, including a third inline copy of the word-overlap scoring logic that was already extracted as `wordOverlapPass()` (L1603) for the exam. Extract one `attachSpeechCheck()` adapter.
- **M2** — `startBuilder`/`startSentence` duplicate tap-to-build/undo/check tile machinery; unify into one `buildFromTiles()`.
- **M3** — 15 empty `catch(e){}` blocks; three hide real user-facing failures (double-tap `rec.start()` leaves the mic button stuck; `sw.js` registration 404s silently — the file doesn't exist; corrupted exam history is discarded with no warning).
- **M4** — `.done`, `.flip`, and `.bcell.wrong` are set by JS but have no CSS rule (Bingo's wrong-tap gives no visual feedback at all); `.done-tick` is dead CSS.
- **M5** — Split-brain persistence: exam history/candidate name persist to `localStorage`, but game star progress (the entire unlock ladder) is memory-only and lost on refresh — the opposite of what a phone-installed PWA needs.
- **M6** — Naming conflates "game" and "level/world" (`State.levelStars` is actually keyed by game id; `reward(levelId,…)` receives a game id).
- **M7** — DOM used as app state: `showExamReport` reads a candidate name out of a hidden input on a different screen instead of `ExamState`, relying on incidental call ordering.
- **M8** — Presentation scattered across inline `style=` attributes and 9 inline `onclick=` handlers; brand hex duplicated in JS instead of reading CSS custom properties.
- **M9** — Bingo's prompt promises "make a line to win" but `checkLine()`'s result only changes a feedback string — the game always grinds to 9/9 regardless.
- **M10** — No test seam: all game state is trapped in closures, `Math.random()` is called directly with no seam for seeding; H1's arithmetic bug would have been caught by a 3-line unit test.
- **M11** — Accessibility: `user-scalable=no` in the viewport meta (WCAG 1.4.4 violation); all answer tiles are non-focusable `<div onclick>` instead of `<button>` — unreachable by keyboard/screen reader/switch access, notable for an app aimed at children including those using assistive tech.

### Low (10 findings, condensed)

L1 `ttsUnlocked=true` is set as a side-effect claim inside `say()`, not by the actual unlock gesture — fragile if the gesture listener is ever reordered. L2 a voice-loading `setInterval` in `say()` isn't cancelled on navigation. L3 magic numbers (11 different feedback delays, 3 copies of a 0.6 speech-overlap threshold) should be hoisted to a `TUNING` block. L4 candidate name is interpolated into `innerHTML` and persisted to `localStorage` — no live risk (no backend/other users) but costs nothing to use `textContent`. L5 the `.wrong` class is never removed outside Bingo, so a second mistake gets no visual feedback. L6 exam progress bar never reaches 100% (off-by-one in when it's set). L7 `GAMES` wraps every start function in a redundant arrow. L8 `allWords()` rebuilds a constant on every call. L9 the on-screen debug bar shows raw stack info (`@line 1970`) to children instead of a friendly message. L10 `pick(arr,n)` silently under-delivers when `n > arr.length`, no assertion.

## Architecture Findings

### High

- **A1 (maps to code quality H4's root cause) · Two divergent activity architectures.** The Mock Exam Simulator (L1514–2052) uses a clean, declarative, dependency-inverted design (`part.run(onDone)` callback contract) — the 12 mini-games (L780–1485) are 12 bespoke closures that reach *upward* to call global `reward()` directly, duplicating identity/title/progression logic at every site. The exam subsystem solved this problem correctly; the games subsystem was never migrated to match.
- **A2 (same root cause as code quality H2) · No lifecycle contract for "the activity currently on screen."** No start/teardown/cancellation hook exists on navigation, which is the structural reason pending timers survive `backFromGame()`/`exitExam()` and can hijack the screen or throw against a nulled `ExamState`.
- **A3 · Two persistence policies in one app** (same underlying issue as code quality M5), and the README's "nothing is persisted" claim is now false for the exam subsystem — the inconsistency is a genuine architectural fork that should be resolved deliberately, not left as drift.
- **A4 (maps to code quality H3) · `State.stars` and the unlock gate measure different things** — cumulative-lifetime vs. best-of-per-game, keyed inconsistently (`levelStars` keyed by game, not level).

### Medium

- **A5** — 5 MCQ loops + 2 tile-bank games + 2 speech-scoring blocks are structural duplicates of abstractions the exam subsystem already built (same finding as code quality H4/M1/M2, from an architectural-cohesion angle).
- **A6** — Game logic (`.done`, `.flip`) stored in CSS classes with no visual meaning — presentational and logical state share one channel.
- **A7** — `VOCAB` data model uses positional tuples with inconsistent arity (2-tuple vs. the 3-tuple `allWords()` emits); silent de-duplication is order-dependent on object key iteration order; four different games feed incomparable score scales into the same 3-star threshold formula.
- **A8** — SpeechRecognition is never adapted into a reusable interface (unlike the well-encapsulated `say()` for TTS); a new recognizer is constructed per round and never `.abort()`ed on navigation (a leaked mic session).
- **A9** — Dead PWA leg: `sw.js` is registered (L2066–2069) but does not exist in the directory; the offline/install-to-homescreen promise in the README does not hold. Flagged as a genuine architectural fork requiring an explicit decision (ship a real service worker vs. drop the registration and soften the README claim), not a silent fix.

### Low

A10 exam theming re-skins shared components via ID-scoped selector overrides instead of remapping CSS custom properties on the existing `.exam-theme` class. A11 `reward()` is a god-function fusing policy/model-mutation/view in one 24-line block (same shape as `showExamReport()`). A12 15 silent `catch(e){}` blocks bypass the one diagnostic channel the app has (the on-screen error bar) — same finding as code quality M3, architecturally framed as "the failure-visibility contract is broken exactly where it matters." A13 104 top-level globals with 9 inline `onclick` HTML attributes hardcoding 6 global function names — no public/internal API boundary. A14 tuning constants (round counts, delays, thresholds, unlock gates) scattered as literals with no single home.

### What's working well (both reviewers agreed)

The exam simulator's declarative part structure and `part.run(onDone)` callback-injection pattern; no circular dependencies anywhere in the file; deliberate graceful-degradation for missing Speech APIs (👍 self-confirm fallback, TTS voice-load retry); the on-screen error reporter as a correct read of the real deployment environment (old parent tablets, no devtools); comments that explain *why* (the Chrome TTS cancel/speak race, duplicate-timer guards); sectioned, mobile-first CSS with a coherent breakpoint ladder.

## Critical Issues for Phase 2 Context

Flagging for the security/performance reviewers:

1. **L4 (candidate name → `innerHTML`, persisted to `localStorage`)** — no live exploit path (no backend, single local user, no other party reads this storage), but worth the security reviewer's independent read since it's the one place user-typed text reaches `innerHTML` rather than `textContent`.
2. **H2/A2 (uncancelled timers + nulled-state dereference)** — this is a genuine crash bug (TypeError surfaced to the user), which the performance/security reviewers should *not* re-flag as a new issue but may reference as context for robustness.
3. No security-relevant surface exists otherwise: no backend, no network calls, no auth, no dynamic `eval`/`Function`, no dependencies to have CVEs, no cookies/tokens. The security review is expected to be light for this project by nature.
4. Performance: this is a small, static, no-framework 2072-line file with no heavy loops, no large collections, and no server round-trips — the performance reviewer should focus on any client-side inefficiencies (e.g., `allWords()` rebuilt on every call, per-round `SpeechRecognition` reconstruction) rather than expecting scalability concerns.
