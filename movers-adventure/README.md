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
- **Installable**: embedded manifest (base64 data URI) and icons let phones offer "Add to Home Screen"; responsive layout tuned for small phones, landscape mode, and tablets. There's no offline/service-worker caching yet — the app needs network access to load.

## Tech

Plain HTML/CSS/JavaScript in a single file (`index.html`) — no framework, no dependencies, no build tooling. Game progress (stars, level unlocks) lives in memory only and resets on reload. The Mock Exam Simulator is the exception: it saves the candidate's name and up to 20 past exam results (score + date) to the browser's `localStorage`, so a child can see their progress across sessions. Nothing is sent to a server — this data never leaves the device — but it does persist locally until browser storage is cleared.

## Running it

Just open `index.html` in a browser (Chrome or Safari recommended for best Speech API support), or serve the folder with any static file server.
