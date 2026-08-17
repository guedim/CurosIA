# Movers Adventure 🦊

A single-file, mobile-first web game that helps kids practice for the **Cambridge English A1 Movers** exam (Listening, Reading & Writing, Speaking) through short, playful mini-games. Built as one self-contained `index.html` — no build step, no backend, no external assets.

## What it does

- **3 unlockable levels** ("worlds"), each bundling a set of mini-games. Kids earn ⭐ stars by playing games; earning enough stars unlocks the next level.
  - 🌱 **Level 1 · Starter** — Listen & Choose, Memory Match, Picture Bingo, Word Builder, Picture Talk (needs 0 ⭐ to start)
  - 🚀 **Level 2 · Explorer** — Fill the Gap, Reading Detective, Word Hangman, Charades (needs 8 ⭐ to unlock)
  - 🏆 **Level 3 · Champion** — Story Listening, Reading Power, Sentence Maker (needs 7 ⭐ to unlock)
- **12 mini-games** covering all four exam skills:
  - Listening: Listen & Choose (🎧), Story Listening (📻)
  - Vocabulary: Memory Match (🧠), Picture Bingo (🎯)
  - Reading & spelling: Word Builder (🔤), Reading Detective (🔍), Word Hangman (🪢), Reading Power (📖)
  - Writing & grammar: Fill the Gap (✍️), Sentence Maker (✏️)
  - Speaking: Picture Talk (🗣️), Charades (🎭)
- **Vocabulary bank** of 13 A1-Movers topics (Animals, Food, Clothes, Home, Nature, Transport, Body, Sports, School, Seasons, Professions, Travel, Time), each word paired with an emoji so no image assets are needed.
- **Voice**: uses the browser's Web Speech API (`speechSynthesis`) to read words/sentences aloud, preferring natural US English voices; uses `SpeechRecognition` (mic input) for the speaking games.
- **Rewards**: confetti animation + star tally screen after each game; best score per game is kept for the session.
- **Parents' guide**: an in-app modal (in Spanish) explaining the exam context, level structure, and a suggested daily practice routine.
- **Installable PWA**: embedded manifest (base64 data URI) and icons so it can be added to a phone's home screen; responsive layout tuned for small phones, landscape mode, and tablets.

## Tech

Plain HTML/CSS/JavaScript in a single file (`index.html`) — no framework, no dependencies, no build tooling. State (stars, progress) lives in memory for the session; nothing is persisted to `localStorage` or a server.

## Running it

Just open `index.html` in a browser (Chrome or Safari recommended for best Speech API support), or serve the folder with any static file server.
