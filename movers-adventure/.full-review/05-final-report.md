# Comprehensive Code Review Report

## Review Target

The `movers-adventure` project: a single-file, mobile-first web game (Cambridge English A1 Movers exam practice for kids) at `/mnt/sda7/mario/claude/Curos_IA/CurosIA/movers-adventure/` — `index.html` (2072 lines: HTML+CSS+JS, 12 mini-games, vocab bank, Web Speech API, embedded PWA manifest) and `README.md`. No backend, no build tooling, no dependencies, no test suite, no CI, run by opening the file or via a static host.

## Executive Summary

This is a well-intentioned, mostly sound single-file app whose two subsystems (the older 12 mini-games and the newer Mock Exam Simulator) evolved at different quality levels: the exam subsystem uses a clean `part.run(onDone)` pattern with correct timer discipline, while the mini-games are 12 duplicated closures that never adopted it, and that gap is the root cause behind most of the serious findings. Four independent review passes converged on the same conclusion from different angles: **uncancelled timers and un-aborted `SpeechRecognition` sessions are the single highest-value fix** — they cause real crashes (`TypeError` on exam exit), hijacked screens, and orphaned mic sessions on back-navigation. Separately, the **star-reward system is broken for 10 of 12 games** (always awards max stars; Memory Match is inverted and unbeatable), and the **README makes a false privacy claim** ("nothing is persisted") that is directly contradicted by code that saves a child's name and exam history to `localStorage`. No blocking security issues exist — this is a backend-free static app, and the two `innerHTML` injection paths found are self-XSS-only with no remote attack vector.

## Findings by Priority

### Critical Issues (P0 — Must Fix Immediately)

- **README's "nothing is persisted" claim is factually false** (Documentation D1). README.md:25 states nothing is saved to `localStorage`; `index.html:1886-1894` saves the candidate's name and up to 20 exam-history records. This is a false privacy claim in an app aimed at children that collects a name — read by parents deciding whether it's safe to use. *Fix effort: trivial (rewrite one paragraph).*
- **Uncancelled `setTimeout` chains + never-`.abort()`ed `SpeechRecognition` cause real crashes and hijacked screens** (Quality H2, Architecture A2/A9, Performance P1/P3, Testing T1/T3, Best-Practices B2). Independently confirmed and reproduced by 4 separate reviewers via distinct methods (code read, architecture analysis, performance grep, and a traced Playwright-style repro). Concretely: answering a question then backing out within ~500ms during an exam throws `TypeError: Cannot set properties of null` on a nulled `ExamState`; the same pattern in mini-games lets a stale timer overwrite whatever screen the user has since navigated to; mic sessions are left open indefinitely with no `.abort()` anywhere in the file (grep-confirmed). *Fix effort: medium — a monotonic generation token or a tracked-timers array covering ~14 call sites, plus tracking recognizer handles for `.abort()`.*

### High Priority (P1 — Fix Before Next Release)

- **Star-reward system is broken for 10 of 12 games** (Quality H1, Testing T2 — independently re-derived and shown to fail a 3-line unit test today). Score/round-advance logic only ever advances on a *correct* answer, so `score===total` is forced by construction; Memory Match inverts the bug and is mathematically unbeatable at more than 1 star. Undermines the entire level-unlock economy. Confirmed by the parents' guide modal (Documentation D3) actively overpromising "stars based on correct answers" to parents.
- **`State.stars` (cumulative) and `State.levelStars` (best-of) diverge** (Quality H3, Architecture A4) — the number shown to the child is not the number that gates progression.
- **Two divergent activity architectures** (Architecture A1, confirmed by Quality H4/M1/M2 and Best-Practices B1/B2): the exam subsystem's clean, dependency-inverted `part.run(onDone)` design vs. 12 bespoke game closures duplicating identity/scoring/SpeechRecognition-wiring logic at every site (~200+ duplicated lines). This is the structural root cause behind H1–H3 above.
- **Four vocabulary words share an emoji** (Quality H5) — MCQ distractor pools can present two visually identical tiles, one marked wrong, actively miseducating on the exact skill the app teaches.
- **No real deployment exists despite advertised "Installable PWA"** (DevOps C1). The service-worker registration explicitly skips non-HTTP(S) origins and the registered `sw.js` doesn't exist in the repo (also Architecture A9, Security S7, Performance P4) — under the README's own "just open the file" instructions, none of the PWA value is reachable.

### Medium Priority (P2 — Plan for Next Sprint)

- Duplicated MCQ/tile-bank/SpeechRecognition logic across mini-games (Quality M1/M2, Architecture A5, Best-Practices B2) — same root cause as H4 above, addressable by extracting `runPracticeChoice()`, `buildFromTiles()`, and `attachSpeechCheck()` helpers.
- 15 silent `catch(e){}` blocks with no diagnostic trail (Quality M3, Architecture A12, Best-Practices B3) — hides real user-facing failures (stuck mic button, discarded corrupted exam history) and undermines the app's own on-screen error reporter.
- Split-brain persistence: exam data survives reload via `localStorage`, game star progress does not (Quality M5, Architecture A3) — the opposite of what a phone-installed PWA needs; ties directly to the D1 documentation fix.
- Two `innerHTML` HTML-injection paths — unescaped candidate name (Security S1) and exam-history label (Security S2) — Medium severity, self-XSS only, no remote vector. No regression test exists for either (Testing T6).
- Missing shape-validation on `localStorage`-sourced exam history (Security S3, Testing T4, Best-Practices B6) — malformed data throws and breaks the Mock Exam screen until storage is cleared. Same one-line fix closes all three.
- `speechSynthesis` queueing race on repeated `say()` calls (Performance P2) — reproducible, noticeable when a child mashes the replay button.
- Accessibility gaps: `user-scalable=no` (WCAG 1.4.4 violation), non-focusable `<div onclick>` answer tiles instead of `<button>` (Quality M11) — notable for an app aimed at children including those using assistive tech.
- Bingo's "make a line to win" never actually checks for a win (Quality M9).
- No CI automation and no regression tests for the P0 timer-crash bug or the P1 star-scoring bug (Testing T1/T2/T5, DevOps C2) — both are cheaply testable today (a 3-line unit test already fails against the current star formula).
- README/in-app documentation gaps beyond D1: no explanation of the two divergent architectures (Documentation D5), no deployment guide (D6), parents' guide overstates scoring accuracy (D3), sparse inline comments on the buggy mini-game scoring logic (D4).
- No module boundary — 104 top-level globals with no `'use strict'`/module scope (Best-Practices B1) — real risk if any third-party script ever shares the origin.
- No rollback/incident-response plan for the eventual deployment (DevOps C3).

### Low Priority (P3 — Track in Backlog)

- Magic numbers scattered as literals (11 feedback delays, 3 copies of a speech-overlap threshold) instead of hoisted to a `TUNING` block (Quality L3, Architecture A14).
- Candidate name interpolated via `innerHTML` into `localStorage`-backed UI with no live risk but no reason not to use `textContent` (Quality L4).
- Missing CSS rules for `.done`/`.flip`/`.bcell.wrong` classes set by JS (Quality M4); dead `.done-tick` CSS.
- No Content-Security-Policy meta tag (Security S4) — cheap defense-in-depth even without a live exploit path.
- Always-on, ungated verbose error reporter shows raw stack info to children (Security S5, Quality L9) — recommend gating behind `?debug=1`.
- Minor perf items: `allWords()` rebuilt on every call, `pickVoice()` rescans on every `say()`, Word Hangman full-keyboard rebuild per keystroke (Performance, all confirmed sub-frame/non-issues at this scale).
- Style inconsistencies: 2 non-arrow function expressions in an otherwise all-arrow codebase (Best-Practices B5), no `?.`/`??` usage despite matching guard patterns (Best-Practices B4).
- 104 global functions with 9 inline `onclick` HTML attributes — no public/internal API boundary (Architecture A13).
- No changelog — explicitly not worth acting on at this project's current scale (Documentation D9).
- Ephemeral-only error reporting; no `unhandledrejection` handler (DevOps C4) — recommend persisting last N errors to the `localStorage` the app already uses.

## Findings by Category

- **Code Quality**: 26 findings (5 high, 11 medium, 10 low)
- **Architecture**: 14 findings (4 high, 5 medium, 5 low)
- **Security**: 7 findings (0 high, 2 medium, 5 low)
- **Performance**: 7 findings (1 high, 3 medium, 3 low)
- **Testing**: 9 findings (3 high, 3 medium, 3 low)
- **Documentation**: 9 findings (1 critical, 5 medium, 3 low)
- **Best Practices**: 6 findings (2 medium, 4 low)
- **CI/CD & DevOps**: 5 findings (1 high, 2 medium, 2 low)

**Total: 83 findings** (1 critical, 14 high, 33 medium, 35 low) — note significant cross-phase overlap: the timer/SpeechRecognition-lifecycle bug alone was independently flagged 7 times across 4 phases, and several other issues (dead service worker, split-brain persistence, innerHTML injection, malformed-history handling) were each confirmed by 2–3 reviewers from different angles. The distinct *underlying* issues number closer to 35–40.

## Recommended Action Plan

1. **Fix the README privacy claim** (D1) — small, high-trust-impact, no code risk. *Effort: trivial.*
2. **Fix the timer/SpeechRecognition lifecycle bug** (H2/A2/P1/P3/T1/T3) — introduce a generation-token or tracked-timers pattern for the ~14 `setTimeout` call sites, and track+`.abort()` recognizer handles on navigation. This single fix resolves the app's only real crash bug and its only unbounded resource leak. *Effort: medium.*
3. **Fix star-scoring** (H1/T2) — track a `missed` flag per round instead of forcing `score===total`; fix Memory Match's inverted formula. Add the 3-line regression test from Phase 3 alongside the fix so it can't silently regress. *Effort: small–medium, touches all 12 games.*
4. **Reconcile `State.stars`/`levelStars`** (H3/A4) — derive displayed total from `levelStars`, drop the separate accumulator. *Effort: small.*
5. **Decide the service-worker/PWA question deliberately** (A9/C1/S7/P4) — either ship a real `sw.js` and deploy to GitHub Pages, or strip the install/offline claims from the README until it exists. *Effort: small (strip claims) to medium (real SW + Pages deploy).*
6. **Extract the shared game engine** (H4/A1/A5/M1/M2/B2) — `runPracticeChoice()`, `buildFromTiles()`, `attachSpeechCheck()` — the highest-leverage refactor since it collapses ~200+ duplicated lines and means future fixes (like #2 and #3) only need to happen once. *Effort: large, but pays for itself immediately.*
7. **Close the `innerHTML` injection + malformed-localStorage gaps together** (S1/S2/S3/T4/T6/B6) — one `escapeHtml()` helper plus one shape-validating `loadExamHistory()` fixes four findings at once. *Effort: small.*
8. **Add a minimal CI workflow** (C2) scoped to `movers-adventure/**` — HTML validation + a headless-browser console-error smoke test — cheap insurance against the hand-edited-2000-line-file failure mode. *Effort: small.*
9. **Accessibility pass**: swap `<div onclick>` answer tiles for `<button>`, remove `user-scalable=no` (M11). *Effort: small–medium, touches markup across all games.*
10. Everything else in P2/P3 (documentation completeness, magic-number hoisting, module-scope wrapping, style consistency) can be picked up opportunistically alongside #6's refactor, since most of it touches the same code.

## Review Metadata

- Review date: 2026-08-17
- Phases completed: Scope, Code Quality & Architecture, Security & Performance, Testing & Documentation, Best Practices & Standards, Consolidated Report
- Flags applied: none (security-focus: no, performance-critical: no, strict-mode: no, framework: none/vanilla)
