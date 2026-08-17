# ClaudeCodeHub

🔗 **Live site: [claudecodehub.vercel.app](https://claudecodehub.vercel.app/)**

**ClaudeCodeHub** is a curated directory of open-source **hooks, plugins, RAG tools, and subagents for [Claude Code](https://claude.ai/code)** — a browsable gallery where you can discover community-built hooks (security, formatting, notifications, logging, testing, automation, workflow), SDLC-focused plugins (planning, coding, code review, testing, CI/CD, deployment, monitoring, documentation), the most popular RAG/retrieval tooling for grounding Claude Code in your code and docs (code-retrieval MCP servers, vector databases, RAG frameworks, ingestion, embeddings/reranking, evaluation, memory), and a top-100 curated list of subagents (architecture, backend Python, security/compliance, AWS serverless, testing/QA, code review, data persistence, documentation, DevOps/CI-CD) — the Agentes tab is specifically curated for fintech/banking teams building PCI DSS-, OWASP-, and ISO 27001-conscious software on a DDD/clean/hexagonal-architecture, 100% Python, 100% AWS-serverless stack — each linking straight to its source (GitHub repo, or vendor site for the couple of API-only entries).

It's a static, no-backend Next.js site: every entry is a plain data record rendered as a card, so there's nothing to configure, no database, and no environment variables required to run it.

## Features

- **Gallery view** — hooks, plugins, RAG tools, and agents rendered as cards in a responsive grid (1 column on mobile, up to 3 on desktop).
- **Hooks / Plugins / RAG / Agentes toggle** — a tab switcher on the home page filters the gallery between the four catalogs.
- **Category badges** — hooks are tagged with one of `security`, `formatting`, `notifications`, `logging`, `testing`, `automation`, `workflow`; plugins are tagged by SDLC phase: `planning`, `coding`, `code-review`, `testing`, `ci-cd`, `deployment`, `monitoring`, `documentation`; RAG entries are tagged by function: `code-retrieval`, `vector-db`, `framework`, `ingestion`, `embeddings-rerank`, `evaluation`, `memory`; agents (the Agentes tab) are tagged by SDLC role: `architecture`, `backend-python`, `security-compliance`, `aws-serverless`, `testing-qa`, `code-review`, `data-persistence`, `documentation`, `devops-cicd`.
- **Stack tag filter** — an optional, multi-select filter (chips below the Hooks/Plugins/RAG/Agentes toggle) for narrowing the gallery to entries relevant to a specific tech stack: `python`, `aws`, `aws-lambda`, `aws-api-gateway`, `aws-dynamodb`, `aws-s3`, `clean-architecture`, `hexagonal-architecture`, `distributed-systems`, `resilience`, `observability`, `banking`, `payments`, `ddd`, `design-patterns`, `enterprise-integration-patterns`, `owasp`, `pci-dss`, `iso27001`, `best-practices`, `ai-assisted-sdlc`. Entries without a matching tag just don't appear when a filter is active — `stackTags` is optional per entry.
- **Agentes tab** — a top-100 curated list of real Claude Code subagents pulled from official Anthropic plugins and popular community collections (`wshobson/agents`, `VoltAgent/awesome-claude-code-subagents`, `Kaademos/secure-sdlc-agents`, `gensecaihq/Claude-Code-Subagents-Collection`, `aws-samples/sample-claude-code-agent-team`, and others), curated and tagged for a fintech/banking software organization: PCI DSS/OWASP/ISO 27001 compliance, DDD, clean/hexagonal architecture, a 100% Python codebase, and 100% AWS-serverless infrastructure (CloudFront, API Gateway, WAF, Lambda, DynamoDB, S3, IAM).
- **Official + star badges** — cards optionally show a "✓ Official" badge (published by the tool's own vendor, or part of Anthropic's official plugin marketplace) and a GitHub star count, snapshotted at curation time via the GitHub API. The two API-only RAG entries (Voyage AI, Cohere Rerank) have no repo to star, so they show neither.
- **Direct links** — every card links out to the entry's source — "View on GitHub" for GitHub-hosted entries, "Visit" for the couple of vendor-site-only RAG entries.
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
│   ├── page.tsx           # Home page — renders the hero, Hooks/Plugins/RAG/Agentes toggle, and gallery
│   └── globals.css        # Tailwind entrypoint + Bold-inspired theme tokens
├── components/
│   ├── item-card.tsx      # Card component for a single hook, plugin, RAG, or agent entry
│   ├── site-header.tsx    # Sticky site header with the gradient "ClaudeCodeHub" wordmark
│   └── site-footer.tsx    # Footer with the gradient hairline + copyright line
├── data/
│   ├── catalog.ts          # The unified catalog (CatalogItem type + catalogItems[] array: hooks, plugins, rag, agents)
│   └── candidates.ts       # Curation queue for the weekly source-discovery bot — not rendered by the site
├── scripts/
│   └── find-new-sources.mjs # GitHub Search API script run weekly by the HookHub Source Discovery workflow
└── public/                 # Static assets (icons, svgs)
```

## Deployment

The production site is live on Vercel at **[claudecodehub.vercel.app](https://claudecodehub.vercel.app/)**. Use this short domain when sharing the link — Vercel's team-scoped alias (`claudecodehub-guedim-5157s-projects.vercel.app`) has Vercel Authentication (SSO) enabled and will prompt other users to log in.

> The Vercel project (team `guedim-5157s-projects`) was originally created as `hookplughub`. Renaming a project's *Settings → General → Project Name* does **not** move its `*.vercel.app` domain automatically — the new domain had to be added explicitly under *Settings → Domains*, after which the old `hookplughub.vercel.app` domain was removed from the project.

Deploys are git-based: the Vercel project is connected directly to this monorepo's GitHub repository, so **every push to `main` that touches `hookhub/` automatically triggers a new production deployment** — no manual `vercel deploy` needed.

This was set up as follows, since `hookhub/` is a subfolder of the `CurosIA` monorepo rather than its own repo:

1. **Connect the Git repository** — in the Vercel project's *Settings → Git*, connected GitHub repo `guedim/CurosIA`.
2. **Scope the build to the subfolder** — in *Settings → Build and Deployment*, set **Root Directory** to `hookhub`, with "Skip deployments when there are no changes to the root directory or its dependencies" enabled, so pushes touching unrelated folders in the monorepo don't trigger unnecessary rebuilds.
3. **Fix `data/catalog.ts` visibility** — the monorepo's root `.gitignore` has a blanket `data/` rule (meant for AI dataset folders elsewhere in the monorepo) that was silently excluding `hookhub/data/catalog.ts`, the file holding the entire hooks/plugins catalog. Added a scoped negation in [`hookhub/.gitignore`](.gitignore) (`!data/` / `!data/**`) so the catalog is tracked and available to the build.

With that in place, a normal `git push` to `main` (e.g. via `/commit-push-code`) is all that's needed to ship a change.

## Continuous Integration (GitHub Actions)

CI runs lint + build on every change, via a workflow scoped exclusively to this project.

**Where it lives:** GitHub Actions only reads workflow files from `.github/workflows/` at the **root of the Git repository** — since `hookhub/` is a subfolder of the `CurosIA` monorepo (not its own repo), the workflow file lives at `CurosIA/.github/workflows/hookhub-ci.yml`, one level above this `hookhub/` folder, not inside it.

**How it's scoped to this project only:** the workflow triggers on `push`/`pull_request` to `main`, filtered with `paths: ["hookhub/**"]`, so commits touching other projects in the monorepo (`platzi-supabase`, `IceBreaker-main`, etc.) never trigger it. Inside the job, `working-directory: hookhub` and `cache-dependency-path: hookhub/package-lock.json` scope every step (`npm ci`, `npm run lint`, `npm run build`) to this folder specifically.

```yaml
# CurosIA/.github/workflows/hookhub-ci.yml
name: HookHub CI

on:
  push:
    branches: [main]
    paths: ["hookhub/**"]
  pull_request:
    branches: [main]
    paths: ["hookhub/**"]
  workflow_dispatch: {}

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: hookhub
    steps:
      - uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v4.4.0

      - uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4.4.0
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: hookhub/package-lock.json

      - run: npm ci
      - run: npm run lint
      - run: npm run validate-catalog
      - run: npm run build
```

### How to (re)create it

1. From the **monorepo root** (not `hookhub/`), create the workflow file at `.github/workflows/hookhub-ci.yml` with the contents above.
2. Commit and push it — GitHub picks up any file under `.github/workflows/` on the default branch automatically; no dashboard configuration or registration step is required.

```bash
cd CurosIA
git add .github/workflows/hookhub-ci.yml
git commit -m "ci(hookhub): add GitHub Actions workflow for lint and build"
git push
```

### Creating and verifying it with Claude Code

This workflow was originally created by asking [Claude Code](https://claude.ai/code) directly from within the `hookhub/` project, e.g.:

1. `"indícame como puedo instalar github workflow en este repositorio"` — Claude reads `hookhub/CLAUDE.md` and `hookhub/AGENTS.md` for project context, but since Actions only reads `.github/workflows/` from the **Git repo root**, it runs `git rev-parse --show-toplevel` first to confirm the real root is `CurosIA/` (one level up from `hookhub/`) and writes the file there — not inside `hookhub/`.
2. `"commit y push el workflow"` — Claude stages, commits, and pushes just that new file with `git add .github/workflows/hookhub-ci.yml`.
3. `"revisa que el workflow corra bien en GitHub Actions"` — Claude uses the [GitHub CLI](https://cli.github.com) (`gh workflow run`, `gh run watch --exit-status`) to trigger a run and confirm `npm ci` / `npm run lint` / `npm run build` all pass.
4. `"deja el workflow exclusivamente para este proyecto"` — Claude scopes the trigger with `paths: ["hookhub/**"]` and `working-directory: hookhub` so it never fires for the monorepo's other projects.

Claude Code needs a GitHub CLI session already authenticated in the environment (see below) to push commits and to trigger/inspect runs — it doesn't need any GitHub App install or repo secret beyond that.

### How to authenticate

- **Automatic runs** (`push` / `pull_request`) need no authentication setup — GitHub Actions runs them under its own ephemeral `GITHUB_TOKEN`, and this workflow needs no secrets since it only lints and builds (no deploy step, no external services).
- **Manual runs / inspecting runs from the CLI** require the [GitHub CLI](https://cli.github.com) authenticated with the `workflow` scope:

  ```bash
  gh auth login          # follow the prompts; choose the `workflow` scope when asked
  gh auth status         # verify — should list `workflow` under Token scopes
  ```

### How to run it

- **Automatically:** push (or open a PR with) a change under `hookhub/` to `main` — no action needed beyond a normal `git push`.
- **Manually, from the GitHub UI:** repo → *Actions* tab → *HookHub CI* → *Run workflow*.
- **Manually, from the CLI:**

  ```bash
  gh workflow run hookhub-ci.yml --ref main

  # watch the latest run to completion
  gh run list --workflow=hookhub-ci.yml --limit 1
  gh run watch <run-id> --exit-status
  ```

### Where to view runs

🔗 **[github.com/guedim/CurosIA/actions/workflows/hookhub-ci.yml](https://github.com/guedim/CurosIA/actions/workflows/hookhub-ci.yml)** — every past and in-progress run of this workflow, with logs per step. It lives under the monorepo's *Actions* tab (not a separate URL per subproject), since `hookhub/` shares the `CurosIA` GitHub repository.

## Automated PR code review (Claude Code Review)

Every pull request that touches `hookhub/**` gets an automated code review from [Claude Code](https://claude.ai/code), focused purely on code elegance and quality — not functional correctness. Findings are posted as **inline comments directly on the PR's diff**, plus one top-level summary comment.

**What it reviews:**

- **Formatting & style** — consistency with the project's ESLint flat config (`eslint-config-next`) and existing conventions
- **DRY** — duplicated logic/markup, missed extraction opportunities, and over-abstraction
- **Cyclomatic complexity** — deeply nested conditionals, long/overloaded functions, suggests simplifications
- **Code quality** — naming, type safety (TypeScript strict mode), dead code, idiomatic Next.js 16 / React 19 patterns
- **Security** — unsafe use of user input, leaked secrets, unsafe `dangerouslySetInnerHTML`/links, missing validation

**Where it lives:** like the CI workflow, this only works from the **Git repository root** — the file is at `CurosIA/.github/workflows/claude-code-review.yaml`, not inside `hookhub/`.

```yaml
# CurosIA/.github/workflows/claude-code-review.yaml
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize]
    paths: ["hookhub/**"]

jobs:
  claude-review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
      id-token: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v4.4.0
        with:
          fetch-depth: 1

      - name: Claude Code Review
        uses: anthropics/claude-code-action@d07835ac7037978eb1aa67c6be18ed0883cea652 # v1
        with:
          claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
          prompt: |
            # ...custom review instructions covering the 5 focus areas above...
          claude_args: |
            --allowedTools "mcp__github_inline_comment__create_inline_comment,Bash(gh pr comment:*),Bash(gh pr diff:*),Bash(gh pr view:*)"
```

**How it's scoped to this project only:** same mechanism as the CI workflow — `paths: ["hookhub/**"]` on the `pull_request` trigger, plus an explicit instruction in the `prompt` telling Claude to ignore anything outside `hookhub/` even though it can see the whole monorepo checkout.

### How to authenticate

Unlike the plain CI workflow, this one calls the Claude API, so it needs the [Claude GitHub App](https://github.com/apps/claude) installed on the repo, which provisions the `CLAUDE_CODE_OAUTH_TOKEN` repository secret it authenticates with:

```bash
# From inside a local Claude Code CLI session (needs repo admin access):
claude
# then, at the prompt:
/install-github-app
```

This walks you through GitHub App installation and creates the secret automatically — no manual token copy-pasting. Verify the secret exists with:

```bash
gh secret list --repo guedim/CurosIA
# should list CLAUDE_CODE_OAUTH_TOKEN
```

Verify the GitHub App itself is installed at `https://github.com/guedim/CurosIA/settings/installations` (repo admin required).

### How to run it

- **Automatically:** open (or push a new commit to) a PR with changes under `hookhub/` — no action needed.
- It does **not** support `workflow_dispatch` (manual trigger) since its `prompt` depends on PR context (`github.event.pull_request.number`) that only exists for real pull request events.

### Where to view runs

🔗 **[github.com/guedim/CurosIA/actions/workflows/claude-code-review.yaml](https://github.com/guedim/CurosIA/actions/workflows/claude-code-review.yaml)** — every past and in-progress review run. The review comments themselves show up directly on the PR's *Files changed* tab and in the PR's comment thread.

## Weekly source discovery (HookHub Source Discovery)

A scheduled GitHub Action searches the GitHub Search API every week for new hooks, plugins, RAG tools, and agents worth adding to the catalog — official Anthropic/vendor repos, and community repos tagged with Claude Code-specific topics — and opens a PR with what it finds. It never touches `data/catalog.ts` or the live site directly; it only appends to a separate curation queue, `data/candidates.ts`, which the gallery doesn't render.

**How it searches, in two passes:**

- **Known orgs** — orgs that already have an `official: true` entry in the catalog (auto-extracted from `repoUrl`), plus `anthropics` — searched for repos whose name/description contains the exact phrase `"claude code"`. No star minimum beyond a token floor (5★), since an official repo is worth surfacing even brand new.
- **Topic search** — GitHub topics like `claude-code`, `claude-code-hook`, `claude-code-plugin`, `claude-code-agent`, `claude-subagent`, `claude-skill`, etc. (including agent/subagent-specific topics so new subagent collections surface for the Agentes tab), combined with the same `"claude code"` phrase requirement, sorted by stars. Requires ≥50 stars and a push within the last 90 days, to filter out abandoned or barely-touched repos.

Both passes exclude forks, archived repos, and anything already present in `catalog.ts` or `candidates.ts` (including previously `rejected` ones — rejections are remembered, not just deleted). Results above 150,000 stars are logged and skipped rather than trusted outright — GitHub topics can be added to any repo for visibility, and star counts can be farmed, so an implausible outlier is a spam/gaming signal, not proof of relevance.

**Curating a PR:** for each entry in `data/candidates.ts`,

- **Good fit** — move it into the matching array in `data/catalog.ts` (`hooks`, `plugins`, `rag`, or `agents`), filling in `type`, `category`, and optional `stackTags`/`official`, then delete it from `candidates.ts`. For repos that bundle multiple subagents (e.g. a `.claude/agents/` or `plugins/*/agents/` directory), consider adding each individually relevant subagent as its own `agents` entry rather than one entry for the whole repo — see [Adding a new hook, plugin, RAG tool, or agent](#adding-a-new-hook-plugin-rag-tool-or-agent-to-the-gallery) above.
- **Not a fit** — set its `status` to `"rejected"` (don't delete it) so the bot doesn't suggest the same repo again next week.

> The first run is expected to surface a large batch — it's scanning everything that exists today, with no prior history to diff against. Weekly runs after that only surface repos that are genuinely new or newly matching, so the volume drops off fast.

**Where it lives:** `CurosIA/.github/workflows/hookhub-source-discovery.yml` (repo root, same reason as the other three workflows). The search script itself is [`hookhub/scripts/find-new-sources.mjs`](scripts/find-new-sources.mjs) — a dependency-free Node 22 script (built-in `fetch`, no npm install step) run directly via `node --experimental-strip-types`, which lets it `import` the `.ts` catalog/candidates files without a build step.

```yaml
# CurosIA/.github/workflows/hookhub-source-discovery.yml
name: HookHub Source Discovery

on:
  schedule:
    - cron: "0 13 * * 1" # every Monday at 13:00 UTC
  workflow_dispatch: {}

permissions:
  contents: write
  pull-requests: write

jobs:
  discover:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: hookhub
    steps:
      - uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v4.4.0

      - uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4.4.0
        with:
          node-version: 22

      - name: Search GitHub for new candidate sources
        id: discover
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: node --experimental-strip-types scripts/find-new-sources.mjs

      - name: Open PR with new candidates
        if: steps.discover.outputs.count != '0'
        uses: peter-evans/create-pull-request@22a9089034f40e5a961c8808d113e2c98fb63676 # v7.0.11
        with:
          commit-message: "chore(hookhub): weekly source discovery — ${{ steps.discover.outputs.count }} new candidate(s)"
          title: "chore(hookhub): weekly source discovery — ${{ steps.discover.outputs.count }} new candidate(s)"
          body: |
            Automated weekly scan by the [HookHub Source Discovery](./.github/workflows/hookhub-source-discovery.yml) workflow.

            Found **${{ steps.discover.outputs.count }}** new candidate repo(s), appended to `hookhub/data/candidates.ts`. For each one:

            - **Good fit** — move it into the matching array in `hookhub/data/catalog.ts`, filling in `type`, `category`, and optional `stackTags`/`official`, then delete it from `candidates.ts`.
            - **Not a fit** — set its `status` to `"rejected"` (don't delete it) so it isn't suggested again next week.
          branch: bot/hookhub-source-discovery
          add-paths: hookhub/data/candidates.ts
          labels: hookhub, catalog-candidates
          delete-branch: true
```

### How to authenticate

Uses the default per-run `GITHUB_TOKEN` — no new secret, no external API, no cost beyond free GitHub Actions minutes (unlimited on public repos). The token needs `pull-requests: write` to open the PR, granted explicitly in the workflow's `permissions:` block; this overrides the repo's default (read-only) workflow permissions, which is standard GitHub Actions behavior.

> If PR creation fails with a permissions error, enable **Settings → Actions → General → Workflow permissions → "Allow GitHub Actions to create and approve pull requests"** on the repo — some accounts have this off by default.

### How to run it

- **Automatically:** every Monday at 13:00 UTC.
- **Manually, from the CLI:** `gh workflow run hookhub-source-discovery.yml --ref main`
- **Manually, from the GitHub UI:** repo → *Actions* tab → *HookHub Source Discovery* → *Run workflow*.

### Where to view runs

🔗 **[github.com/guedim/CurosIA/actions/workflows/hookhub-source-discovery.yml](https://github.com/guedim/CurosIA/actions/workflows/hookhub-source-discovery.yml)**

## Interactive `@claude` assistant (issues & PRs)

Beyond the automatic PR review above, mentioning `@claude` in a comment lets you have Claude investigate and implement a fix on demand — it reads the codebase and `CLAUDE.md`, makes the change, commits and pushes it, and leaves a link to open the PR, right in the comment thread.

**What triggers it** — any of these, as long as the comment/body/title contains `@claude`:

- A comment on an issue
- A comment on a pull request review
- A pull request review submitted with `@claude` in its body
- An issue opened or assigned with `@claude` in its title or body

**Where it lives:** `CurosIA/.github/workflows/claude.yml` (repo root, same reason as the other two workflows — Actions only reads `.github/workflows/` from the Git repo root).

```yaml
# CurosIA/.github/workflows/claude.yml
name: Claude Code

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned]
  pull_request_review:
    types: [submitted]

jobs:
  claude:
    # Gate on the triggering actor's association with the repo, not just the
    # presence of "@claude" — this is a public repo, and anyone can open an
    # issue or comment. Scoped per event type since each surfaces the actor's
    # association on a different field. anthropics/claude-code-action@v1 also
    # checks write access itself, but that check is delegated to a mutable
    # third-party action tag; gate here too, before compute/tokens are spent.
    if: |
      (
        (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude') && contains(fromJSON('["OWNER","MEMBER","COLLABORATOR"]'), github.event.comment.author_association)) ||
        (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude') && contains(fromJSON('["OWNER","MEMBER","COLLABORATOR"]'), github.event.comment.author_association)) ||
        (github.event_name == 'pull_request_review' && contains(github.event.review.body, '@claude') && contains(fromJSON('["OWNER","MEMBER","COLLABORATOR"]'), github.event.review.author_association)) ||
        (github.event_name == 'issues' && (contains(github.event.issue.body, '@claude') || contains(github.event.issue.title, '@claude')) && contains(fromJSON('["OWNER","MEMBER","COLLABORATOR"]'), github.event.issue.author_association))
      )
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
      issues: read
      id-token: write
      actions: read # Required for Claude to read CI results on PRs
    steps:
      - name: Checkout repository
        uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v4.4.0
        with:
          fetch-depth: 1

      - name: Run Claude Code
        id: claude
        uses: anthropics/claude-code-action@d07835ac7037978eb1aa67c6be18ed0883cea652 # v1
        with:
          claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}

          # Allows Claude to read CI results on PRs
          additional_permissions: |
            actions: read

          # No custom prompt: Claude follows whatever instructions are given
          # in the @claude comment/issue that triggered it.
          # prompt: 'Update the pull request description to include a summary of changes.'

          # See https://github.com/anthropics/claude-code-action/blob/main/docs/usage.md
          # or https://code.claude.com/docs/en/cli-reference for available options
          # claude_args: '--allowed-tools Bash(gh pr *)'
```

**Scope:** unlike the CI and review workflows, this one is **repo-wide**, not scoped to `hookhub/**` — `paths` filters only apply to `push`/`pull_request` events triggered by file diffs, and comment/issue events (`issue_comment`, `issues`, `pull_request_review`) have no associated diff for GitHub to filter on. So `@claude` responds anywhere in the `CurosIA` monorepo; you steer scope yourself in what you ask it (e.g. mention `hookhub/` explicitly if that's what you mean).

**Author gate:** the `if:` condition also requires the triggering actor's `author_association` to be `OWNER`, `MEMBER`, or `COLLABORATOR` — this is a public repo, so without that gate anyone could open an issue containing `@claude` and spend the job's compute/tokens before `claude-code-action`'s own internal permission check runs.

**Authentication:** same `CLAUDE_CODE_OAUTH_TOKEN` secret and Claude GitHub App as the review workflow above — see [How to authenticate](#how-to-authenticate-1) there; nothing extra to set up.

**How to run it:** post a comment containing `@claude` and whatever you want done (e.g. `@claude can you fix this?`, `@claude implement X`) on an issue or PR in the repo — no manual dispatch, it only reacts to real GitHub events.

🔗 **[github.com/guedim/CurosIA/actions/workflows/claude.yml](https://github.com/guedim/CurosIA/actions/workflows/claude.yml)** — every past and in-progress run.

## Download this project from GitHub

This project lives inside the `CurosIA` monorepo, in the `hookhub/` subfolder — it is not a standalone repository.

```bash
# Clone the monorepo
git clone https://github.com/guedim/CurosIA.git

# Move into the ClaudeCodeHub project
cd CurosIA/hookhub
```

All commands below assume you're running them from inside this `hookhub/` directory. The folder is still named `hookhub/` in the monorepo — only the project's name/branding changed to ClaudeCodeHub.

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

## Adding a new hook, plugin, RAG tool, or agent to the gallery

The catalog is a plain TypeScript array — no build step or database migration needed. To add an entry, add a new object to the `hooks`, `plugins`, `rag`, or `agents` array in [`data/catalog.ts`](data/catalog.ts) matching the `CatalogItem` interface:

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

// RAG
{
  name: "My RAG Tool",
  type: "rag",
  category: "vector-db", // code-retrieval | vector-db | framework | ingestion | embeddings-rerank | evaluation | memory
  description: "A short description of what the tool does and how it plugs into Claude Code.",
  repoUrl: "https://github.com/owner/repo", // or a vendor site for API-only tools with no GitHub repo (card link label adapts automatically)
  official: true,
  stars: 5678, // omit for API-only entries with no repo to star
}

// Agent
{
  name: "My Agent",
  type: "agent",
  category: "security-compliance", // architecture | backend-python | security-compliance | aws-serverless | testing-qa | code-review | data-persistence | documentation | devops-cicd
  description: "A short description of what the subagent does and when it's invoked.",
  repoUrl: "https://github.com/owner/repo/blob/main/path/to/agent.md",
  stackTags: ["owasp", "pci-dss"], // optional — see the stack tag list above
  official: false,
  stars: 42,
}
```

Save the file and the new card will appear in the gallery (under the matching Hooks/Plugins/RAG/Agentes tab) automatically the next time the page renders. For the RAG tab specifically, keep the bar high — it's meant to surface the most popular, actively maintained tools in each category, not every RAG-adjacent repo on GitHub. The Agentes tab is curated for a fintech/banking, DDD/hexagonal-architecture, 100% Python, 100% AWS-serverless audience — favor real subagents (from official Anthropic plugins or popular community subagent collections) whose role maps cleanly onto architecture, security/compliance (PCI DSS, OWASP, ISO 27001), AWS serverless infra, or the rest of a Python SDLC, and tag them with the relevant `stackTags` even when the source repo itself is generic rather than fintech-specific.

## Claude Code skills

This repo ships a project-level [Claude Code](https://claude.ai/code) skill at [`.claude/skills/commit-push-code/SKILL.md`](.claude/skills/commit-push-code/SKILL.md), invoked with `/commit-push-code`.

- Gathers `git status`, `git diff HEAD`, the current branch, remote tracking status, and recent commit log as context.
- Stages all changes, generates a conventional commit message, commits, and pushes to the current branch's remote.
- Explicit-invocation only (`disable-model-invocation: true`) — Claude won't run it on its own.
- Pre-approves `git status`, `git diff --staged`, `git add`, `git commit`, and `git push` via `allowed-tools`, so it won't prompt for permission on those commands.
