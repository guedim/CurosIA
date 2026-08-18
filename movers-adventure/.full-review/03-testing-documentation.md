# Phase 3: Testing & Documentation Review

## Test Coverage Findings

**Bottom line:** Zero automated tests exist (no unit, integration, or E2E suite; no `package.json`, test runner, or CI). Given the app's actual scale (single HTML file, no backend), the right-sized fix is a **small, framework-light test layer**, not enterprise infrastructure. The two highest-value additions are a regression test for the setTimeout/navigation-race bug class (independently reproduced in this review) and a 3-line unit test for the star-award formula (which fails against current code today, documenting the shipping Memory Match bug).

### High

- **T1 · Exam `setTimeout` chain outlives `exitExam()`, throws on stale exam state.** Independently reproduced call chain: `renderChoice()` (L1616–1639) schedules `setTimeout(()=>cfg.onAnswer(...), 500)` (L1636); if the user backs out via `exitExam()` (L2002–2007, sets `ExamState=null`) inside that window, the stale timeout still fires, eventually writing `ExamState.results[part.id]=...` against `null` → `TypeError`. Existing guards (`examTick` L1948, `finishSection` L1978) don't cover this specific chain. **Fix + regression test:** track pending exam-render timers (or guard every `onAnswer` callback with `if(!ExamState) return;`) and add a Playwright test that answers a question, backs out within 500ms, then asserts no uncaught `pageerror` fires.
- **T2 · Star-award formula is untested and provably wrong for Memory Match.** `reward()`'s one-line formula (L756: `ratio>=0.9?3:ratio>=0.6?2:1`) combined with Memory Match's `score=Math.max(2, 9-tries)` (L911) means even perfect play (`tries=6`) yields `ratio=0.33` → capped at 1 star, unbeatable. A 3-line `computeStars(score,total)` unit test (extracted verbatim from L756) fails against today's code and would have caught this at write-time. Confirms and independently re-derives Phase 1's Quality H1.
- **T3 · Orphaned `SpeechRecognition` sessions — no `.abort()` anywhere in the file (grep-confirmed).** `startTalk()`/`startCharades()` (L1058–1111, L1189–1264) each construct `new SR()` locally; `goHome()`/`backFromGame()` (L742–743) only cancel `speechSynthesis`, never the recognizer. Not automatable in CI (no real `SpeechRecognition` in headless Chromium) — recommend a documented manual QA checklist item instead of a flaky automated test. Confirms Phase 2's Performance P1.

### Medium

- **T4** — `loadExamHistory()` (L1889) validates JSON syntax only, not record shape; a malformed entry (e.g. missing `shields`) throws inside `renderExamHistory()` (`'🛡️'.repeat(undefined)` → `RangeError`), breaking the Mock Exam screen until storage is cleared. Testable today via a plain Node assertion script once shape validation is added (confirms Phase 2's S3).
- **T5** — None of the 11+ untracked `setTimeout(next,…)` chains across the 12 mini-games are covered by a regression test; answering correctly then backing out before the delay elapses lets the stale callback overwrite whatever screen the user has since navigated to (confirms Phase 1's H2/A2, Phase 2's P3).
- **T6** — No regression test exists for either `innerHTML` injection path (S1: candidate name; S2: `localStorage`-sourced exam-history `label`, reachable if `localStorage` is ever written by a non-trusted source). Two focused Playwright cases — typing HTML into the candidate-name field and asserting it renders as literal text rather than executing — would prevent silent reintroduction.

### Low

T7 `Math.random()` is unseeded (`pick`/`shuffle`, L654–655) with no injectable RNG seam, so any DOM test asserting "the correct answer is X" must read it off the rendered DOM rather than hardcoding an expectation — an authoring-ergonomics cost, not a product bug; a one-line `let rng = Math.random` indirection would fix it. T8 No module boundaries — all functions/state are global (`State`, `ExamState`), so tests must explicitly reset state between cases (page reload or manual zeroing) rather than relying on isolation. T9 Long `innerHTML` template literals are the natural DOM-test seam but are fragile to markup changes; prefer `data-testid` attributes over CSS classes as selectors if tests are added.

### Testability assessment

No refactor is required to start unit-testing today: pure-ish helpers already exist at module scope (`pick`, `shuffle`, `cap`, `allWords`, `starsIn`, `maxStars`, `worldUnlocked`, `wordOverlapPass` — L654–656, 683–685, 1603–1608) and the declarative data tables (`GAMES`, `WORLDS`, `VOCAB`, `GAP_ITEMS`, `CHARADES`, `EXAM`) are trivially shape-assertable. A **light** refactor — extracting `computeStars()` from `reward()` L756, and giving `Math.random` an overridable indirection — would unlock testing the scoring logic, the single highest-leverage change given it directly targets the shipping star-scoring bug.

### Recommended test pyramid (proportionate to scale — no build step required)

- **Unit (majority, cheapest):** `computeStars()`, `wordOverlapPass()`, `starsIn`/`maxStars`/`worldUnlocked`, `pick`/`shuffle` invariants, `allWords()` dedup, `loadExamHistory()`/`saveExamHistoryEntry()` against mocked `localStorage`, data-shape assertions on `GAMES`/`WORLDS`/`VOCAB`. Plain `node --test`, zero dependencies — keeps the "no build tooling" philosophy intact.
- **DOM/integration (moderate):** drive one full round of each mini-game and the exam flow via Playwright against the static file (no server needed); the navigation-race scenarios (T1, T5) belong here.
- **Manual/E2E (small, explicitly out of CI):** anything touching `speechSynthesis`/`SpeechRecognition` (T3) — not reliably automatable headless; a short repro checklist is the right artifact.

Security and performance test gaps are covered under T6 and noted as not applicable at this scale respectively (no backend, no large data sets, confetti loop is cosmetic and bounded — worth a 30-second manual check that its `requestAnimationFrame` loop stops when the reward screen is left, not automated coverage).

---

## Documentation Findings

### Critical

- **D1 · README's "nothing is persisted" claim is factually false.** README.md L25 states "nothing is persisted to `localStorage` or a server," directly contradicted by `index.html` L1886–1894, which saves the candidate's name (`movers_candidate`) and up to 20 exam-history records (`movers_exam_history`) to `localStorage`, unencrypted, with no expiry. The code itself is internally consistent and correctly scoped in its own comments (L606 vs. L1886) — the bug is purely the README's over-generalization from "game `State` isn't persisted" to "nothing is persisted." This matters more than a typical stale-doc issue: it's a false privacy claim in an app aimed at children that collects a name, read by parents deciding whether it's safe to use. **Fix:** replace L25 with language describing exactly what the exam subsystem stores locally and that nothing leaves the device (confirms and elevates Phase 2's S6).

### Medium

- **D2** — Candidate name (free-text, `maxlength=20`, index.html L459) reaches `innerHTML` unescaped in the exam report (L2023–2024, `cap()` only capitalizes, doesn't encode) — confirms Phase 2's S1 from an independent read of the same call chain.
- **D3** — The in-app Spanish parents' guide (L510: "Cada juego da hasta 3 ⭐ según los aciertos" / "each game gives up to 3 stars according to correct answers") actively misrepresents current behavior given the star-scoring bug (Quality H1/T2) — user-facing documentation, not just README, promising a mechanic the code doesn't deliver. Recommend softening the claim as a stopgap until the underlying bug is fixed.
- **D4** — The 12 mini-game closures (L~980–1520) have almost no logic-level comments — section-banner headers only, no explanation of scoring/round-advancement — while the exam subsystem (L1735–1886) and the trickiest cross-browser TTS/gesture quirks (L552, 578, 582) are well commented. The exact code responsible for the star-scoring bug (e.g. `startGap()` L1004–1039) has zero comments on its scoring logic, making the bug invisible to a future reader. Recommend one comment on `addStars`/`setLevelStars` (L608–610) flagging the known limitation, turning a silent bug into a discoverable TODO.
- **D5** — No architecture documentation anywhere explaining the two divergent patterns: 12 bespoke game closures vs. the exam subsystem's cleaner `part.run(onDone)`-style callback pattern (L1736–1757). A short paragraph (comment above `GAMES` at L661, or a README section) pointing future edits at the exam pattern as the one to imitate is cheap and valuable — confirms Phase 1's A1/A5 from a documentation-completeness angle.
- **D6** — No deployment guide despite the project being a textbook GitHub Pages candidate (static, zero dependencies, already on GitHub) and the PWA install path actually requiring HTTP(S) — `location.protocol.indexOf('http')===0` (L2067) means the service-worker registration is a no-op when opened via `file://`. Recommend a short "Deploying it" section.

### Low

- **D7** — README's "Installable PWA" claim (L21) implies offline support; `sw.js` is registered (L2067–2068) but does not exist in the repo (confirmed via `ls`), so registration silently fails and there is no offline caching — confirms Phase 1's A9 and Phase 2's S7/P4. Recommend either shipping a minimal `sw.js` or softening the claim to note the manifest works for home-screen install but there's no offline caching yet.
- **D8** — 15 silent `catch(e){}` blocks (L562, 569, 570, 594, 603, 1090, 1218, 1491–1493, 1888, 1894, 2060) have no comment stating what failure each guards against; a one-word convention (`// unsupported API`, `// storage disabled`) would make the failure-visibility gap (Phase 1's M3/A12) self-documenting.
- **D9** — No changelog. Reasonable to leave unaddressed at this project's current size/maturity — not a finding to act on now, though worth a lightweight "recent changes" bullet list if the exam/games subsystems keep diverging.

### Verified accurate (no action needed)

Game count (12), level-unlock thresholds (`WORLDS[].need`: 8, 7), vocabulary topic count and names (13 topics, `VOCAB` L615ff), Web Speech API usage claims, and the Spanish parents' modal's non-scoring content were all cross-checked line-by-line against the README and found accurate.
