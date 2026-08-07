# HookHub

**HookHub** is a curated directory of open-source **hooks for [Claude Code](https://claude.ai/code)** — a browsable gallery where you can discover community-built hooks for security, formatting, notifications, logging, testing, automation, and workflow use cases, each linking straight to its source repository on GitHub.

It's a static, no-backend Next.js site: every hook is a plain data entry rendered as a card, so there's nothing to configure, no database, and no environment variables required to run it.

## Features

- **Gallery view** — hooks rendered as cards in a responsive grid (1 column on mobile, up to 3 on desktop).
- **Category badges** — each hook is tagged with one of: `security`, `formatting`, `notifications`, `logging`, `testing`, `automation`, `workflow`.
- **Direct links** — every card links out to the hook's GitHub repository.
- **Bold.co-inspired theme** — a dark, high-contrast UI with a red → navy → blue gradient brand mark, a sticky site header, and a gradient-hairline footer.
- **Content-as-data** — the entire catalog lives in one file, [`data/hooks.ts`](data/hooks.ts); no CMS or database involved.

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
│   ├── page.tsx           # Home page — renders the hero + hook gallery
│   └── globals.css        # Tailwind entrypoint + Bold-inspired theme tokens
├── components/
│   ├── hook-card.tsx      # Card component for a single hook
│   ├── site-header.tsx    # Sticky site header with the gradient "HookHub" wordmark
│   └── site-footer.tsx    # Footer with the gradient hairline + copyright line
├── data/
│   └── hooks.ts            # The hook catalog (Hook type + hooks[] array)
└── public/                 # Static assets (icons, svgs)
```

## Download this project from GitHub

This project lives inside the `CurosIA` monorepo, in the `hookhub/` subfolder — it is not a standalone repository.

```bash
# Clone the monorepo
git clone https://github.com/guedim/CurosIA.git

# Move into the HookHub project
cd CurosIA/hookhub
```

All commands below assume you're running them from inside this `hookhub/` directory.

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

## Adding a new hook to the gallery

The catalog is a plain TypeScript array — no build step or database migration needed. To add a hook, add a new object to the `hooks` array in [`data/hooks.ts`](data/hooks.ts) matching the `Hook` interface:

```ts
{
  name: "My Hook Name",
  category: "automation", // one of: security | formatting | notifications | logging | testing | automation | workflow
  description: "A short description of what the hook does.",
  repoUrl: "https://github.com/owner/repo",
}
```

Save the file and the new card will appear in the gallery automatically the next time the page renders.

## Claude Code skills

This repo ships a project-level [Claude Code](https://claude.ai/code) skill at [`.claude/skills/commite-code/SKILL.md`](.claude/skills/commite-code/SKILL.md), invoked with `/commite-code`.

- Gathers `git status`, `git diff HEAD`, the current branch, and recent commit log as context.
- Generates a conventional commit message and creates a single commit from the staged changes.
- Explicit-invocation only (`disable-model-invocation: true`) — Claude won't run it on its own.
- Pre-approves `git status`, `git diff --staged`, and `git commit` via `allowed-tools`, so it won't prompt for permission on those commands.
