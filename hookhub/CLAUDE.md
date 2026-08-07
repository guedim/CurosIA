# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

All commands run from this directory (`hookhub/`):

- `npm run dev` — start the dev server (<http://localhost:3000>)
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`: `eslint-config-next` core-web-vitals + TypeScript presets)

There is no test framework configured.

## Architecture

Next.js 16 App Router project (`create-next-app` scaffold) with React 19, TypeScript (strict), and Tailwind CSS v4.

- `app/` — App Router routes; `app/layout.tsx` is the root layout (loads Geist fonts), `app/page.tsx` the home page
- Styling: Tailwind v4 via the `@tailwindcss/postcss` PostCSS plugin — no `tailwind.config` file; global styles and theme tokens live in `app/globals.css`
- Path alias: `@/*` maps to the project root (see `tsconfig.json`)

The AGENTS.md block above is authoritative: this Next.js version may differ from training data — consult `node_modules/next/dist/docs/` before writing Next.js-specific code.