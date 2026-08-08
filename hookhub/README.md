# HookPlugHub

**HookPlugHub** is a curated directory of open-source **hooks and plugins for [Claude Code](https://claude.ai/code)** — a browsable gallery where you can discover community-built hooks (security, formatting, notifications, logging, testing, automation, workflow) and SDLC-focused plugins (planning, coding, code review, testing, CI/CD, deployment, monitoring, documentation), each linking straight to its source repository on GitHub.

It's a static, no-backend Next.js site: every entry is a plain data record rendered as a card, so there's nothing to configure, no database, and no environment variables required to run it.

## Features

- **Gallery view** — hooks and plugins rendered as cards in a responsive grid (1 column on mobile, up to 3 on desktop).
- **Hooks / Plugins toggle** — a tab switcher on the home page filters the gallery between the two catalogs.
- **Category badges** — hooks are tagged with one of `security`, `formatting`, `notifications`, `logging`, `testing`, `automation`, `workflow`; plugins are tagged by SDLC phase: `planning`, `coding`, `code-review`, `testing`, `ci-cd`, `deployment`, `monitoring`, `documentation`.
- **Stack tag filter** — an optional, multi-select filter (chips below the Hooks/Plugins toggle) for narrowing the gallery to entries relevant to a specific tech stack: `python`, `aws`, `aws-lambda`, `aws-api-gateway`, `aws-dynamodb`, `aws-s3`, `clean-architecture`, `distributed-systems`, `resilience`, `banking`, `payments`, `ddd`, `design-patterns`, `enterprise-integration-patterns`, `owasp`, `best-practices`, `ai-assisted-sdlc`. Entries without a matching tag just don't appear when a filter is active — `stackTags` is optional per entry.
- **Official + star badges** — cards optionally show a "✓ Official" badge (published by the tool's own vendor, or part of Anthropic's official plugin marketplace) and a GitHub star count, snapshotted at curation time via the GitHub API.
- **Direct links** — every card links out to the entry's GitHub repository.
- **Bold.co-inspired theme** — a dark, high-contrast UI with a red → navy → blue gradient brand mark, a sticky site header, and a gradient-hairline footer.
- **Content-as-data** — the entire catalog lives in one file, [`data/catalog.ts`](data/catalog.ts); no CMS or database involved.

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router)
- [React](https://react.dev) 19
- [TypeScript](https://www.typescriptlang.org) (strict mode)
- [Tailwind CSS](https://tailwindcss.com) v4 (via `@tailwindcss/postcss`, no `tailwind.config` file)
- [ESLint](https://eslint.org) 9 (flat config, `eslint-config-next`)
- [Montserrat](https://fonts.google.com/specimen/Montserrat) (via `next/font/google`) — the site's typeface, paired with a dark Bold.co-style color palette defined in `app/globals.css`

## Project structure

```text
hookhub/
├── app/
│   ├── layout.tsx        # Root layout, Montserrat font, metadata
│   ├── page.tsx           # Home page — renders the hero, Hooks/Plugins toggle, and gallery
│   └── globals.css        # Tailwind entrypoint + Bold-inspired theme tokens
├── components/
│   ├── item-card.tsx      # Card component for a single hook or plugin
│   ├── site-header.tsx    # Sticky site header with the gradient "HookPlugHub" wordmark
│   └── site-footer.tsx    # Footer with the gradient hairline + copyright line
├── data/
│   └── catalog.ts          # The unified catalog (CatalogItem type + catalogItems[] array)
└── public/                 # Static assets (icons, svgs)
```

## Download this project from GitHub

This project lives inside the `CurosIA` monorepo, in the `hookhub/` subfolder — it is not a standalone repository.

```bash
# Clone the monorepo
git clone https://github.com/guedim/CurosIA.git

# Move into the HookPlugHub project
cd CurosIA/hookhub
```

All commands below assume you're running them from inside this `hookhub/` directory. The folder is still named `hookhub/` in the monorepo — only the project's name/branding changed to HookPlugHub.

## Mandatory tools & installation

You need **Node.js**, **npm**, and **Git** installed before running this project. This project was built and verified with **Node.js v22** and **npm 10**; Node.js 20 LTS or newer is recommended.

### 1. Git

- **Debian/Ubuntu:** `sudo apt update && sudo apt install git`
- **macOS:** `brew install git` (or install Xcode Command Line Tools: `xcode-select --install`)
- **Windows:** `winget install --id Git.Git -e --source winget`

Verify:

```bash
git --version
```

### 2. Node.js & npm

npm ships bundled with Node.js, so installing Node.js is enough. The recommended way is via [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager), which lets you manage multiple Node versions:

```bash
# Install nvm (Linux/macOS)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Restart your shell, then install and use Node.js LTS
nvm install --lts
nvm use --lts
```

Alternatively, install Node.js directly:

- **Debian/Ubuntu:** `sudo apt install nodejs npm`
- **macOS:** `brew install node`
- **Windows:** `winget install OpenJS.NodeJS.LTS`

Verify both tools are installed:

```bash
node -v   # should print v20.x or newer
npm -v    # should print 10.x or newer
```

## Running the project

From inside the `hookhub/` directory:

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The page hot-reloads as you edit files.

### 3. Lint the code

```bash
npm run lint
```

Runs ESLint using the flat config in `eslint.config.mjs` (`eslint-config-next` core-web-vitals + TypeScript presets).

### 4. Build for production

```bash
npm run build
```

Produces an optimized production build.

### 5. Run the production build

```bash
npm run start
```

Serves the build created by `npm run build` at [http://localhost:3000](http://localhost:3000). You must run `npm run build` first.

> There is no test framework configured in this project.

## Adding a new hook or plugin to the gallery

The catalog is a plain TypeScript array — no build step or database migration needed. To add an entry, add a new object to the `hooks` or `plugins` array in [`data/catalog.ts`](data/catalog.ts) matching the `CatalogItem` interface:

```ts
// Hook
{
  name: "My Hook Name",
  type: "hook",
  category: "automation", // security | formatting | notifications | logging | testing | automation | workflow
  description: "A short description of what the hook does.",
  repoUrl: "https://github.com/owner/repo",
  stackTags: ["owasp"], // optional — see the stack tag list above
  official: true, // optional — true if published by the tool's own vendor, or Anthropic's official marketplace
  stars: 1234, // optional — GitHub star count of the hosting repo, snapshotted via `gh api repos/<owner>/<repo>`
}

// Plugin
{
  name: "My Plugin Name",
  type: "plugin",
  category: "ci-cd", // planning | coding | code-review | testing | ci-cd | deployment | monitoring | documentation
  description: "A short description of what the plugin does.",
  repoUrl: "https://github.com/owner/repo",
  stackTags: ["aws", "aws-lambda"], // optional
  official: false,
  stars: 42,
}
```

Save the file and the new card will appear in the gallery (under the matching Hooks/Plugins tab) automatically the next time the page renders.

## Claude Code skills

This repo ships a project-level [Claude Code](https://claude.ai/code) skill at [`.claude/skills/commit-push-code/SKILL.md`](.claude/skills/commit-push-code/SKILL.md), invoked with `/commit-push-code`.

- Gathers `git status`, `git diff HEAD`, the current branch, remote tracking status, and recent commit log as context.
- Stages all changes, generates a conventional commit message, commits, and pushes to the current branch's remote.
- Explicit-invocation only (`disable-model-invocation: true`) — Claude won't run it on its own.
- Pre-approves `git status`, `git diff --staged`, `git add`, `git commit`, and `git push` via `allowed-tools`, so it won't prompt for permission on those commands.
