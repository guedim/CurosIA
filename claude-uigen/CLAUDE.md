# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. Users describe components via chat, and an AI (Claude) generates React code that renders in a sandboxed iframe preview. Works with or without an Anthropic API key (falls back to a mock provider with static responses).

## Commands

- `npm run setup` — Install deps, generate Prisma client, run migrations
- `npm run dev` — Start dev server with Turbopack (port 3000)
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm run test` — Vitest (jsdom environment)
- `npx prisma generate` — Regenerate Prisma client after schema changes
- `npx prisma migrate dev` — Run database migrations
- `npm run db:reset` — Reset database (destructive)

All dev/build/start scripts require `NODE_OPTIONS='--require ./node-compat.cjs'`.

## Architecture

### Two-mode AI provider (`src/lib/provider.ts`)
- With `ANTHROPIC_API_KEY`: uses `@ai-sdk/anthropic` with Claude Haiku 4.5
- Without: uses `MockLanguageModel` that returns static component code (counter/form/card)

### Chat → Code generation flow
1. **Client**: `ChatProvider` (`src/lib/contexts/chat-context.tsx`) wraps `@ai-sdk/react` `useChat`, sends messages + serialized file system to `/api/chat`
2. **Server**: `POST /api/chat` (`src/app/api/chat/route.ts`) reconstructs a `VirtualFileSystem`, streams responses via Vercel AI SDK's `streamText` with two tools: `str_replace_editor` and `file_manager`
3. **Client**: `FileSystemProvider` (`src/lib/contexts/file-system-context.tsx`) handles tool call results, updating the in-memory VFS
4. **Preview**: `PreviewFrame` transforms all VFS files through Babel (`src/lib/transform/jsx-transformer.ts`), builds an import map with blob URLs, and renders in a sandboxed iframe using esm.sh for React/third-party deps

### Virtual File System (`src/lib/file-system.ts`)
In-memory tree structure (no disk I/O). Serialized as JSON to persist in the database. The AI generates files into this VFS using two tools:
- `str_replace_editor`: view/create/replace/insert operations (modeled after Claude's text editor tool)
- `file_manager`: rename/delete operations

### AI generation prompt (`src/lib/prompts/generation.tsx`)
Every project must have a root `/App.jsx` as the entry point. Uses `@/` import aliases. Styled with Tailwind CSS. No HTML files.

### Preview rendering (`src/lib/transform/jsx-transformer.ts`)
- Transforms JSX/TSX via `@babel/standalone` in the browser
- Creates blob URLs for each file, builds an import map
- Third-party packages resolved via `https://esm.sh/`
- CSS files injected as `<style>` tags
- Missing imports get placeholder modules

### Auth & persistence
- JWT-based auth using `jose` (cookie: `auth-token`, 7-day expiry)
- `src/lib/auth.ts`: server-only session management
- `src/actions/index.ts`: server actions for sign up/in/out
- Anonymous users can use the app without auth (work stored in sessionStorage via `anon-work-tracker.ts`)
- Authenticated users get projects persisted to SQLite via Prisma

### Database (Prisma + SQLite)
- Schema: `prisma/schema.prisma`
- Generated client output: `src/generated/prisma/` (gitignored)
- Two models: `User` and `Project` (messages/data stored as JSON strings)

### Routing
- `/` — Anonymous mode or redirect to latest project for authenticated users
- `/[projectId]` — Project page (requires auth)
- Middleware (`src/middleware.ts`) protects `/api/projects` and `/api/filesystem` routes

## UI Components

Uses shadcn/ui (new-york style) with Radix primitives. Components in `src/components/ui/`. Path alias `@/*` maps to `./src/*`.

## Testing

Vitest with jsdom, React Testing Library. Tests are colocated in `__tests__/` directories next to source files.
