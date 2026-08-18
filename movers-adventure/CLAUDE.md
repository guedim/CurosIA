# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-file, mobile-first web game (`index.html`) that helps kids practice for the Cambridge English A1 Movers exam (Listening, Reading & Writing, Speaking) through 12 mini-games plus a Cambridge-styled Mock Exam Simulator. No framework, no dependencies, no build step. This directory is a subfolder of a larger monorepo (`CurosIA`) — CI only triggers on changes under `movers-adventure/**`.

## Commands

Run from this directory (`movers-adventure/`):

```bash
# Validate HTML (matches CI)
npx --yes html-validate@8 index.html

# Smoke test — serves index.html locally, loads it in headless Chromium,
# fails if the page throws or logs a console error
npm install --no-save playwright@1   # first time only, not committed
npx playwright install --with-deps chromium
node smoke-test.mjs
```

There is no `package.json`, linter, or test framework beyond the above. CI (`.github/workflows/movers-adventure-ci.yml`, working-directory `movers-adventure`) runs exactly these two steps on push/PR touching this folder.

To manually try the game: open `index.html` directly in a browser (Chrome or Safari for best Web Speech API support), or serve the folder with any static file server.

## Architecture

Everything lives in one file, `index.html`, split into `<style>` (lines ~15–374) and two `<script>` blocks (lines ~525–2043). There's no module system — all state and functions are global.

### Screens

The DOM has a handful of `<section class="screen">` elements (`home`, `world`, `game`, `reward`, plus the exam simulator sections). `show(id)` toggles the `.active` class to switch screens; it also bumps a generation counter (`GEN`) and calls `stopActiveRecognizer()` so stale speech-recognition/timeout callbacks from the previous screen don't fire after navigating away (see `later(fn, ms)`, which checks the captured `GEN` before running).

### Content data

- `VOCAB` — the word bank, grouped by topic (animals, food, clothes, home, nature, transport, body, sports, school, seasons, professions, travel, time), each word paired with an emoji. `allWords()` flattens it.
- `GAMES` — registry of the 12 mini-games: id → `{name, desc, icon, cls, start}`. `start` points to that game's `start*()` function (e.g. `startListen`, `startMemory`, `startBingo`, `startBuilder`, `startTalk`, `startGap`, `startReading`, `startHangman`, `startCharades`, `startListenPlus`, `startReadingPlus`, `startSentence`).
- `WORLDS` — the 3 levels, each with an ordered list of game ids and a `need` (stars required in the previous world to unlock). `worldUnlocked(i)`/`starsIn(w)` derive unlock state from `State.levelStars`.

To add a new mini-game: write a `start<Name>()` function that renders into `BODY()` (`#gameBody`), calls `reward(gameId, score, total, replayFn)` when finished, register it in `GAMES`, and add its id to the relevant `WORLDS[].games` array.

### Game loop conventions

Most mini-games follow the same shape: a `start<Name>()` sets up round state (closures, not global vars) and an inner `next()`/`call()` advances rounds, ending in `reward(...)`. Shared helpers:
- `wireChoiceOptions(container, options, correctValue, opts)` and `runPracticeChoiceLoop(...)` — generic multiple-choice round wiring, reused by several games.
- `say(text, rate)` — speaks via `speechSynthesis`, preferring natural US English voices (`pickVoice()`); `unlockTTS()` primes it on first user gesture (mobile autoplay restrictions).
- `blip(ok)` — short WebAudio feedback tone via a lazily-created `AudioContext` (`actx`).
- `pick`, `shuffle`, `cap`, `escapeHtml` — small utilities used throughout.

Scoring: `reward()` converts score/total into 1–3 stars (≥90%→3, ≥60%→2, else 1 — always at least 1), updates `State.levelStars`, checks whether a new world just unlocked, and triggers confetti + spoken feedback.

### State & persistence

- `State.levelStars` (in-memory only) tracks best stars per game for the session; resets on reload.
- The Mock Exam Simulator (lines ~1486+, "Cambridge English teal identity" styling, distinct from the rest of the palette) is the one part that persists: candidate name and up to the last 20 exam results go to `localStorage` under `movers_candidate` and `movers_exam_history` (see the "Exam history" block starting ~line 1857). This is the only place data survives a reload, and it never leaves the device.

### PWA bits

`<link rel="manifest">` and the apple-touch-icon are embedded as base64 `data:` URIs directly in `<head>` — there's no separate `manifest.json` file and no service worker (no offline caching).

## Working in this file

- Keep it a single self-contained HTML file — no build step is expected by CI or by "just open it in a browser."
- `html-validate` runs with several rules disabled (see `.htmlvalidate.json`): `no-inline-style`, `no-implicit-button-type`, `element-permitted-content`, `prefer-tbody`, `wcag/h63`. Don't fight these; new code doesn't need to satisfy them either.
- The smoke test fails the build on *any* console error or uncaught page error (favicon 404s excepted) — a good sanity check to run locally before pushing changes that touch initialization/navigation code paths.
- When adding a new mini-game or editing an existing one, use `later()`/`GEN` (not raw `setTimeout`) for anything that fires after a delay, so it doesn't run after the user has navigated to a different screen.
