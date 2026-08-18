# Review Scope

## Target

The `movers-adventure` project: a single-file, mobile-first web game (Cambridge English A1 Movers exam practice for kids) located at `/mnt/sda7/mario/claude/Curos_IA/CurosIA/movers-adventure/`.

## Files

- `index.html` (2072 lines) — the entire application: HTML, CSS, and JavaScript in one file. Contains 12 mini-games, a vocabulary bank, Web Speech API integration (speechSynthesis + SpeechRecognition), an embedded base64 PWA manifest/icons, and a Spanish-language parents' guide modal.
- `README.md` — project overview and tech notes.

## Project Characteristics (for reviewer context)

- No backend, no server, no database, no API endpoints.
- No build tooling, no package.json, no external dependencies/CDN scripts.
- No persistence — state (stars, progress) lives in memory only for the session; nothing written to localStorage or a server.
- No CI/CD pipeline, no test suite present.
- Intended audience: children (~7-12 y/o) practicing for an English exam; run by opening the file directly in a browser or via a static file server.

## Flags

- Security Focus: no
- Performance Critical: no
- Strict Mode: no
- Framework: none (vanilla HTML/CSS/JS)

## Review Phases

1. Code Quality & Architecture
2. Security & Performance
3. Testing & Documentation
4. Best Practices & Standards
5. Consolidated Report
