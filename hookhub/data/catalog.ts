export type ItemType = "hook" | "plugin" | "rag" | "agent";

export type HookCategory =
  | "security"
  | "formatting"
  | "notifications"
  | "logging"
  | "testing"
  | "automation"
  | "workflow";

export type PluginCategory =
  | "planning"
  | "coding"
  | "code-review"
  | "testing"
  | "ci-cd"
  | "deployment"
  | "monitoring"
  | "documentation";

export type RagCategory =
  | "code-retrieval"
  | "vector-db"
  | "framework"
  | "ingestion"
  | "embeddings-rerank"
  | "evaluation"
  | "memory";

export type AgentCategory =
  | "architecture"
  | "backend-python"
  | "security-compliance"
  | "aws-serverless"
  | "testing-qa"
  | "code-review"
  | "data-persistence"
  | "documentation"
  | "devops-cicd";

export type Category = HookCategory | PluginCategory | RagCategory | AgentCategory;

export type StackTag =
  | "python"
  | "aws"
  | "aws-lambda"
  | "aws-api-gateway"
  | "aws-dynamodb"
  | "aws-s3"
  | "clean-architecture"
  | "hexagonal-architecture"
  | "distributed-systems"
  | "resilience"
  | "observability"
  | "banking"
  | "payments"
  | "ddd"
  | "design-patterns"
  | "enterprise-integration-patterns"
  | "owasp"
  | "pci-dss"
  | "iso27001"
  | "best-practices"
  | "ai-assisted-sdlc";

export const stackTags: StackTag[] = [
  "python",
  "aws",
  "aws-lambda",
  "aws-api-gateway",
  "aws-dynamodb",
  "aws-s3",
  "clean-architecture",
  "hexagonal-architecture",
  "distributed-systems",
  "resilience",
  "observability",
  "banking",
  "payments",
  "ddd",
  "design-patterns",
  "enterprise-integration-patterns",
  "owasp",
  "pci-dss",
  "iso27001",
  "best-practices",
  "ai-assisted-sdlc",
];

export interface CatalogItem {
  name: string;
  type: ItemType;
  category: Category;
  description: string;
  repoUrl: string;
  stackTags?: StackTag[];
  /** Published by the tool's own vendor/org, or by Anthropic's official plugin marketplace. */
  official?: boolean;
  /** GitHub star count of the hosting repository, snapshotted at curation time. */
  stars?: number;
}

export const hookCategories: HookCategory[] = [
  "security",
  "formatting",
  "notifications",
  "logging",
  "testing",
  "automation",
  "workflow",
];

export const pluginCategories: PluginCategory[] = [
  "planning",
  "coding",
  "code-review",
  "testing",
  "ci-cd",
  "deployment",
  "monitoring",
  "documentation",
];

export const ragCategories: RagCategory[] = [
  "code-retrieval",
  "vector-db",
  "framework",
  "ingestion",
  "embeddings-rerank",
  "evaluation",
  "memory",
];

export const agentCategories: AgentCategory[] = [
  "architecture",
  "backend-python",
  "security-compliance",
  "aws-serverless",
  "testing-qa",
  "code-review",
  "data-persistence",
  "documentation",
  "devops-cicd",
];

const hooks: CatalogItem[] = [
  // Security
  {
    name: "Lasso Claude-Hooks",
    type: "hook",
    category: "security",
    description:
      "Scans tool outputs for 50+ prompt injection patterns, including instruction overrides, jailbreaks, and data exfiltration attempts.",
    repoUrl: "https://github.com/lasso-security/claude-hooks",
    official: true,
    stars: 261,
    stackTags: ["owasp"],
  },
  {
    name: "claude-guardrails",
    type: "hook",
    category: "security",
    description:
      "Hardened security config with deny rules for destructive commands, pipe-to-shell blocking, and prompt injection scanning.",
    repoUrl: "https://github.com/dwarvesf/claude-guardrails",
    stars: 30,
    stackTags: ["owasp", "best-practices"],
  },
  {
    name: "Destructive Command Guard",
    type: "hook",
    category: "security",
    description:
      "Blocks catastrophic git and shell commands — force pushes, hard resets, rm -rf, DROP TABLE — before an agent can run them.",
    repoUrl: "https://github.com/Dicklesworthstone/destructive_command_guard",
    stars: 5687,
    stackTags: ["owasp", "resilience", "best-practices"],
  },
  {
    name: "Sensitive Canary",
    type: "hook",
    category: "security",
    description:
      "Guards secrets and PII with gitleaks/TruffleHog-derived detection patterns before a prompt or file read ever reaches the API.",
    repoUrl: "https://github.com/coo-quack/sensitive-canary",
    stars: 20,
    stackTags: ["owasp", "banking", "payments", "best-practices"],
  },
  {
    name: "Claude Code Damage Control",
    type: "hook",
    category: "security",
    description:
      "PreToolUse/PostToolUse safety layer that intercepts and blocks high-risk operations before they execute.",
    repoUrl: "https://github.com/disler/claude-code-damage-control",
    stars: 478,
    stackTags: ["owasp", "best-practices"],
  },
  {
    name: "Real-Time Tool Call Guardrails",
    type: "hook",
    category: "security",
    description:
      "Evaluates every Claude Code tool call against configurable real-time guardrail rules before it's allowed to run.",
    repoUrl: "https://github.com/rulebricks/claude-code-guardrails",
    stars: 75,
    stackTags: ["owasp"],
  },
  {
    name: "AWS Policy-Driven Guardrails",
    type: "hook",
    category: "security",
    description:
      "AWS's own sample hook that fires on every message and tool invocation to enforce org security policy on an AI coding agent.",
    repoUrl:
      "https://github.com/aws-samples/sample-policy-driven-code-assistant-guardrails",
    official: true,
    stars: 1,
    stackTags: ["aws", "owasp", "best-practices"],
  },
  {
    name: "Project Boundary Guard",
    type: "hook",
    category: "security",
    description:
      "Scope-aware protection that allows destructive ops inside the project directory but blocks them the moment a path escapes it — built for multi-service monorepos.",
    repoUrl: "https://github.com/justi/claude-code-project-boundary",
    stars: 86,
    stackTags: ["best-practices", "distributed-systems"],
  },
  {
    name: "Secret Scanner Hook",
    type: "hook",
    category: "security",
    description:
      "PreToolUse secret scanner from a 20-hook toolkit, blocking writes that contain hardcoded credentials before they land on disk.",
    repoUrl:
      "https://github.com/rohitg00/awesome-claude-code-toolkit/blob/main/hooks/scripts/secret-scanner.js",
    stars: 2468,
    stackTags: ["owasp", "best-practices"],
  },
  {
    name: "Bash Command Guard",
    type: "hook",
    category: "security",
    description:
      "Blocks dangerous shell invocations at the PreToolUse boundary as part of a production-grade Claude Code security configuration.",
    repoUrl:
      "https://github.com/Aedelon/claude-code-blueprint/blob/main/hooks/scripts/bash-guard.sh",
    stars: 112,
    stackTags: ["owasp", "best-practices"],
  },
  {
    name: "npm Audit Vulnerability Hook",
    type: "hook",
    category: "security",
    description:
      "Runs a dependency vulnerability audit automatically after package.json changes and surfaces findings before they ship.",
    repoUrl:
      "https://github.com/Aedelon/claude-code-blueprint/blob/main/hooks/scripts/bash-vuln.sh",
    stars: 112,
    stackTags: ["owasp"],
  },
  {
    name: "Prompt Secrets Guard",
    type: "hook",
    category: "security",
    description:
      "UserPromptSubmit hook that inspects every prompt for credentials and secrets before it's ever sent to the model.",
    repoUrl:
      "https://github.com/Aedelon/claude-code-blueprint/blob/main/hooks/scripts/user-prompt-secrets.sh",
    stars: 112,
    stackTags: ["owasp", "banking"],
  },

  // Formatting
  {
    name: "Auto-lint on Save",
    type: "hook",
    category: "formatting",
    description:
      "Runs the linter after every file write and rejects changes that introduce lint errors.",
    repoUrl: "https://github.com/affaan-m/everything-claude-code",
    stars: 238799,
    stackTags: ["best-practices"],
  },
  {
    name: "Multi-Language Format Hook",
    type: "hook",
    category: "formatting",
    description:
      "Auto-formats files on every Claude Code edit across JS/TS, Python, Go, Kotlin, and Markdown, falling back gracefully between Biome/Ruff/Prettier.",
    repoUrl: "https://github.com/ryanlewis/claude-format-hook",
    stars: 4,
    stackTags: ["best-practices"],
  },
  {
    name: "Auto-Format on Write Hook",
    type: "hook",
    category: "formatting",
    description:
      "PostToolUse formatter that runs the project's own formatter after every Write/Edit so style never drifts across a session.",
    repoUrl:
      "https://github.com/Aedelon/claude-code-blueprint/blob/main/hooks/scripts/write-format.sh",
    stars: 112,
    stackTags: ["best-practices"],
  },
  {
    name: "Lint Auto-Fix Hook",
    type: "hook",
    category: "formatting",
    description:
      "Auto-fixes lint violations immediately after an edit instead of just reporting them, from a 20-hook toolkit.",
    repoUrl:
      "https://github.com/rohitg00/awesome-claude-code-toolkit/blob/main/hooks/scripts/lint-fix.js",
    stars: 2468,
    stackTags: ["best-practices"],
  },

  // Notifications
  {
    name: "Claude Code Notification",
    type: "hook",
    category: "notifications",
    description:
      "Lightweight macOS desktop notification hook for Claude Code with customizable system sounds when events occur during a session.",
    repoUrl: "https://github.com/wyattjoh/claude-code-notification",
    stars: 94,
  },
  {
    name: "Voice Output Hooks",
    type: "hook",
    category: "notifications",
    description:
      "Adds text-to-speech voice output to Claude Code responses and notifications.",
    repoUrl: "https://github.com/shanraisshan/claude-code-hooks",
    stars: 501,
  },
  {
    name: "Cross-Platform Smart Notifications",
    type: "hook",
    category: "notifications",
    description:
      "Zero-dependency notification hook for Linux/macOS/Windows with click-to-focus and webhook fan-out to Slack, Telegram, and ntfy — built for chatops at team scale.",
    repoUrl: "https://github.com/777genius/claude-notifications-go",
    stars: 777,
    stackTags: ["best-practices"],
  },
  {
    name: "code-notify",
    type: "hook",
    category: "notifications",
    description:
      "Cross-platform desktop notifications for Claude Code, Codex, and Gemini CLI, installable via Homebrew, npm, or a one-line script.",
    repoUrl: "https://github.com/mylee04/code-notify",
    stars: 280,
  },

  // Logging
  {
    name: "Multi-Agent Observability Dashboard",
    type: "hook",
    category: "logging",
    description:
      "Streams tool usage events from every hook to a real-time web dashboard for monitoring Claude Code agents.",
    repoUrl:
      "https://github.com/disler/claude-code-hooks-multi-agent-observability",
    stars: 1509,
    stackTags: ["observability"],
  },
  {
    name: "Cost Tracker Hook",
    type: "hook",
    category: "logging",
    description:
      "Tracks token usage and estimated dollar cost per session, part of a 10-hook collection.",
    repoUrl: "https://github.com/karanb192/claude-code-hooks",
    stars: 466,
    stackTags: ["observability"],
  },
  {
    name: "agents-observe",
    type: "hook",
    category: "logging",
    description:
      "Real-time observability dashboard that captures every hook event across Claude Code sessions and multi-agent runs as it happens.",
    repoUrl: "https://github.com/simple10/agents-observe",
    stars: 641,
    stackTags: ["observability", "distributed-systems"],
  },
  {
    name: "ccusage",
    type: "hook",
    category: "logging",
    description:
      "The de-facto standard CLI for analyzing Claude Code token usage and cost from local session logs, commonly wired into a Stop/SessionEnd hook for automatic reporting.",
    repoUrl: "https://github.com/ccusage/ccusage",
    stars: 17803,
    stackTags: ["observability", "best-practices"],
  },
  {
    name: "Session Notification Log Hook",
    type: "hook",
    category: "logging",
    description:
      "Structured JSONL log of every notification event across a session, useful as a lightweight audit trail for team usage patterns.",
    repoUrl:
      "https://github.com/rohitg00/awesome-claude-code-toolkit/blob/main/hooks/scripts/notification-log.js",
    stars: 2468,
    stackTags: ["observability"],
  },
  {
    name: "PostToolUse Failure Logger",
    type: "hook",
    category: "logging",
    description:
      "Captures every failed tool call with its error context to a durable log, so failures are diagnosable after the fact instead of scrolling past in the terminal.",
    repoUrl:
      "https://github.com/Aedelon/claude-code-blueprint/blob/main/hooks/scripts/posttooluse-failure.sh",
    stars: 112,
    stackTags: ["observability", "resilience"],
  },

  // Testing
  {
    name: "Protect Tests Hook",
    type: "hook",
    category: "testing",
    description:
      "Blocks edits that delete or weaken test assertions before they can be committed.",
    repoUrl: "https://github.com/karanb192/claude-code-hooks",
    stars: 466,
    stackTags: ["best-practices"],
  },
  {
    name: "TDD Guard",
    type: "hook",
    category: "testing",
    description:
      "Blocks implementation edits without a preceding failing test, over-implementation beyond test scope, and adding multiple tests at once — enforced red-green-refactor.",
    repoUrl: "https://github.com/nizos/tdd-guard",
    stars: 2299,
    stackTags: ["best-practices", "ai-assisted-sdlc"],
  },
  {
    name: "Probity",
    type: "hook",
    category: "testing",
    description:
      "Checks every file write and shell command against a rule set — including TDD enforcement — before it happens, and tells the agent why a violation was blocked.",
    repoUrl: "https://github.com/nizos/probity",
    stars: 159,
    stackTags: ["best-practices"],
  },
  {
    name: "TypeScript Hooks",
    type: "hook",
    category: "testing",
    description:
      "Blocks Claude Code edits that introduce TypeScript type errors, keeping the compiler green across a whole session.",
    repoUrl: "https://github.com/bartolli/claude-code-typescript-hooks",
    stars: 178,
    stackTags: ["best-practices"],
  },
  {
    name: "Anti-Regression Setup",
    type: "hook",
    category: "testing",
    description:
      "Ready-to-use hooks and configs that stop Claude Code from silently breaking existing behavior while it works on something else.",
    repoUrl: "https://github.com/CreatmanCEO/claude-code-antiregression-setup",
    stars: 12,
    stackTags: ["best-practices"],
  },
  {
    name: "Pre-Push Quality Gate Hook",
    type: "hook",
    category: "testing",
    description:
      "Runs the full quality gate — tests, types, lint — before a push is allowed to leave the machine, from a 20-hook toolkit.",
    repoUrl:
      "https://github.com/rohitg00/awesome-claude-code-toolkit/blob/main/hooks/scripts/pre-push-check.js",
    stars: 2468,
    stackTags: ["best-practices"],
  },
  {
    name: "Auto Test Runner Hook",
    type: "hook",
    category: "testing",
    description:
      "Runs the relevant test file automatically after every edit, catching regressions before they compound across a session.",
    repoUrl:
      "https://github.com/rohitg00/awesome-claude-code-toolkit/blob/main/hooks/scripts/auto-test.js",
    stars: 2468,
    stackTags: ["best-practices"],
  },

  // Automation
  {
    name: "Claude Organize",
    type: "hook",
    category: "automation",
    description:
      "AI-powered file organization hook that automatically sorts temporary scripts from permanent docs based on content, not just patterns.",
    repoUrl: "https://github.com/ramakay/claude-organizer",
    stars: 68,
  },
  {
    name: "claude-model-router-hook",
    type: "hook",
    category: "automation",
    description:
      "Automatically switches the active model tier based on task complexity, e.g. a lighter model for simple reads and a stronger one for complex reasoning.",
    repoUrl: "https://github.com/tzachbon/claude-model-router-hook",
    stars: 62,
    stackTags: ["ai-assisted-sdlc"],
  },
  {
    name: "Git Checkpointing Hook",
    type: "hook",
    category: "automation",
    description:
      "Automatically creates a git snapshot before every file modification, giving a one-command safety net to restore prior state without touching the real history.",
    repoUrl: "https://github.com/Ixe1/claude-code-checkpointing-hook",
    stars: 15,
    stackTags: ["resilience", "best-practices"],
  },
  {
    name: "ccheckpoints",
    type: "hook",
    category: "automation",
    description:
      "Tracks every Claude Code CLI session as a navigable checkpoint, so you can see and roll back exactly what an agent did turn by turn.",
    repoUrl: "https://github.com/p32929/ccheckpoints",
    stars: 34,
  },
  {
    name: "Commit Guard Hook",
    type: "hook",
    category: "automation",
    description:
      "Generates checkpoint commits with contextual messages after meaningful edits, from a 20-hook toolkit.",
    repoUrl:
      "https://github.com/rohitg00/awesome-claude-code-toolkit/blob/main/hooks/scripts/commit-guard.js",
    stars: 2468,
    stackTags: ["best-practices"],
  },
  {
    name: "Lambda Bundle Size Check Hook",
    type: "hook",
    category: "automation",
    description:
      "Flags Lambda deployment bundles that cross a size threshold right after a build, catching cold-start regressions before they hit production.",
    repoUrl:
      "https://github.com/rohitg00/awesome-claude-code-toolkit/blob/main/hooks/scripts/bundle-check.js",
    stars: 2468,
    stackTags: ["aws", "aws-lambda"],
  },
  {
    name: "Smart Auto-Approve Hook",
    type: "hook",
    category: "automation",
    description:
      "Auto-approves low-risk, previously-seen tool calls while still routing anything novel or risky through normal confirmation — cuts approval fatigue at team scale.",
    repoUrl:
      "https://github.com/rohitg00/awesome-claude-code-toolkit/blob/main/hooks/scripts/smart-approve.py",
    stars: 2468,
    stackTags: ["ai-assisted-sdlc", "best-practices"],
  },
  {
    name: "Block Dev Server Launch Hook",
    type: "hook",
    category: "automation",
    description:
      "Stops Claude Code from spinning up a long-running dev server in the background, avoiding orphaned processes and port conflicts.",
    repoUrl:
      "https://github.com/rohitg00/awesome-claude-code-toolkit/blob/main/hooks/scripts/block-dev-server.js",
    stars: 2468,
    stackTags: ["best-practices"],
  },

  // Workflow
  {
    name: "Superpowers Session Start",
    type: "hook",
    category: "workflow",
    description:
      "Automatically loads project context and active tasks whenever a new Claude Code session starts.",
    repoUrl: "https://github.com/obra/superpowers",
    stars: 269273,
    stackTags: ["ai-assisted-sdlc"],
  },
  {
    name: "Claude Code Hooks Mastery",
    type: "hook",
    category: "workflow",
    description:
      "Reference implementation covering all Claude Code hook lifecycle events with captured JSON payloads, TTS, linting, and sub-agent examples.",
    repoUrl: "https://github.com/disler/claude-code-hooks-mastery",
    stars: 3880,
    stackTags: ["ai-assisted-sdlc"],
  },
  {
    name: "Infinite Agentic Loop",
    type: "hook",
    category: "workflow",
    description:
      "Two-prompt system that fans a single spec out to N parallel sub-agents, each given a unique creative direction, iterating in waves until context limits are reached.",
    repoUrl: "https://github.com/disler/infinite-agentic-loop",
    stars: 608,
    stackTags: ["ai-assisted-sdlc"],
  },
  {
    name: "Claude Code Showcase",
    type: "hook",
    category: "workflow",
    description:
      "Comprehensive reference project wiring hooks together with skills, agents, commands, and GitHub Actions into one coherent configuration.",
    repoUrl: "https://github.com/ChrisWiles/claude-code-showcase",
    stars: 6013,
    stackTags: ["ai-assisted-sdlc"],
  },
  {
    name: "Official Hook Development Skill",
    type: "hook",
    category: "workflow",
    description:
      "Anthropic's own skill and reference examples for designing and building Claude Code hooks, straight from the claude-code repository.",
    repoUrl:
      "https://github.com/anthropics/claude-code/blob/main/plugins/plugin-dev/skills/hook-development/SKILL.md",
    official: true,
    stars: 140726,
    stackTags: ["ai-assisted-sdlc"],
  },
  {
    name: "claude-hooks (TypeScript framework)",
    type: "hook",
    category: "workflow",
    description:
      "TypeScript-first framework for authoring Claude Code hooks with full type safety and auto-completion over strongly-typed payloads.",
    repoUrl: "https://github.com/johnlindquist/claude-hooks",
    stars: 389,
    stackTags: ["best-practices"],
  },
  {
    name: "Session Context Loader Hook",
    type: "hook",
    category: "workflow",
    description:
      "Loads project context, recent git activity, and open tasks into every new session automatically, from a 20-hook toolkit.",
    repoUrl:
      "https://github.com/rohitg00/awesome-claude-code-toolkit/blob/main/hooks/scripts/context-loader.js",
    stars: 2468,
    stackTags: ["ai-assisted-sdlc"],
  },
  {
    name: "Session Lifecycle Hook",
    type: "hook",
    category: "workflow",
    description:
      "Paired SessionStart/SessionEnd hooks that capture and restore working context across a production-grade Claude Code configuration.",
    repoUrl:
      "https://github.com/Aedelon/claude-code-blueprint/blob/main/hooks/scripts/session-start.sh",
    stars: 112,
    stackTags: ["ai-assisted-sdlc"],
  },
  {
    name: "Context Compaction Hook",
    type: "hook",
    category: "workflow",
    description:
      "Prepares and summarizes context ahead of a PreCompact event so long-running sessions don't lose critical state when history is trimmed.",
    repoUrl:
      "https://github.com/Aedelon/claude-code-blueprint/blob/main/hooks/scripts/pre-compact.sh",
    stars: 112,
    stackTags: ["ai-assisted-sdlc"],
  },
  {
    name: "Stop Event Hook",
    type: "hook",
    category: "workflow",
    description:
      "Runs end-of-turn verification and wrap-up steps whenever Claude Code finishes responding, closing the loop on every session.",
    repoUrl:
      "https://github.com/Aedelon/claude-code-blueprint/blob/main/hooks/scripts/stop.sh",
    stars: 112,
    stackTags: ["ai-assisted-sdlc"],
  },
];

const plugins: CatalogItem[] = [
  {
    name: "Linear",
    type: "plugin",
    category: "planning",
    description:
      "Issue tracking integration connecting Claude Code to Linear for creating/managing issues and tracking projects.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/external_plugins/linear",
    official: true,
    stars: 33269,
  },
  {
    name: "Asana",
    type: "plugin",
    category: "planning",
    description:
      "Connects Claude Code to Asana's V2 MCP server to create/manage tasks, search projects, and track progress.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/external_plugins/asana",
    official: true,
    stars: 33269,
  },
  {
    name: "Atlassian (Jira/Confluence)",
    type: "plugin",
    category: "planning",
    description:
      "Connects to Jira and Confluence to search/create issues, access docs, and manage sprints.",
    repoUrl: "https://github.com/atlassian/atlassian-mcp-server",
    official: true,
    stars: 947,
  },
  {
    name: "Atlassian TWG CLI",
    type: "plugin",
    category: "planning",
    description:
      "Teamwork Graph CLI, Atlassian's agent-first interface to Jira issues, Confluence pages, and Bitbucket PRs.",
    repoUrl: "https://github.com/atlassian-labs/twg-plugins",
    official: true,
    stars: 0,
  },
  {
    name: "Notion",
    type: "plugin",
    category: "planning",
    description:
      "Workspace integration to search pages, create/update docs, and manage databases as a team knowledge base.",
    repoUrl: "https://github.com/makenotion/claude-code-notion-plugin",
    official: true,
    stars: 466,
  },
  {
    name: "C/C++ LSP (clangd)",
    type: "plugin",
    category: "coding",
    description: "Bundles the clangd language server for C/C++ code intelligence.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/clangd-lsp",
    official: true,
    stars: 33269,
  },
  {
    name: "C# LSP",
    type: "plugin",
    category: "coding",
    description: "Bundles a C# language server for code intelligence.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/csharp-lsp",
    official: true,
    stars: 33269,
  },
  {
    name: "Go LSP (gopls)",
    type: "plugin",
    category: "coding",
    description: "Bundles gopls for Go code intelligence and refactoring.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/gopls-lsp",
    official: true,
    stars: 33269,
  },
  {
    name: "Java LSP (JDT.LS)",
    type: "plugin",
    category: "coding",
    description:
      "Bundles the Eclipse JDT.LS language server for Java code intelligence.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/jdtls-lsp",
    official: true,
    stars: 33269,
  },
  {
    name: "Kotlin LSP",
    type: "plugin",
    category: "coding",
    description: "Bundles a Kotlin language server for code intelligence.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/kotlin-lsp",
    official: true,
    stars: 33269,
  },
  {
    name: "Lua LSP",
    type: "plugin",
    category: "coding",
    description: "Bundles a Lua language server for code intelligence.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/lua-lsp",
    official: true,
    stars: 33269,
  },
  {
    name: "PHP LSP (Intelephense)",
    type: "plugin",
    category: "coding",
    description: "Bundles Intelephense for PHP code intelligence.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/php-lsp",
    official: true,
    stars: 33269,
  },
  {
    name: "Python LSP (Pyright)",
    type: "plugin",
    category: "coding",
    description: "Bundles Pyright for Python type checking and code intelligence.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/pyright-lsp",
    official: true,
    stars: 33269,
    stackTags: ["python"],
  },
  {
    name: "Ruby LSP",
    type: "plugin",
    category: "coding",
    description:
      "Bundles a Ruby language server for code intelligence and analysis.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/ruby-lsp",
    official: true,
    stars: 33269,
  },
  {
    name: "Rust LSP (rust-analyzer)",
    type: "plugin",
    category: "coding",
    description: "Bundles rust-analyzer for Rust code intelligence and analysis.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/rust-analyzer-lsp",
    official: true,
    stars: 33269,
  },
  {
    name: "Swift LSP (SourceKit-LSP)",
    type: "plugin",
    category: "coding",
    description: "Bundles SourceKit-LSP for Swift code intelligence.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/swift-lsp",
    official: true,
    stars: 33269,
  },
  {
    name: "TypeScript/JS LSP",
    type: "plugin",
    category: "coding",
    description:
      "Bundles a TypeScript/JavaScript language server for code intelligence.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/typescript-lsp",
    official: true,
    stars: 33269,
  },
  {
    name: "Frontend Design",
    type: "plugin",
    category: "coding",
    description:
      "Creates production-grade frontend interfaces with high design quality, avoiding generic AI aesthetics.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/frontend-design",
    official: true,
    stars: 33269,
  },
  {
    name: "Feature Dev",
    type: "plugin",
    category: "coding",
    description:
      "Comprehensive feature development workflow with specialized agents for exploration, architecture design, and review.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/feature-dev",
    official: true,
    stars: 33269,
    stackTags: ["ai-assisted-sdlc", "clean-architecture"],
  },
  {
    name: "Code Modernization",
    type: "plugin",
    category: "coding",
    description:
      "Structured workflow (preflight/assess/map/extract-rules/transform) for modernizing legacy codebases like COBOL and legacy Java.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/code-modernization",
    official: true,
    stars: 33269,
    stackTags: ["clean-architecture", "best-practices"],
  },
  {
    name: "MCP Server Dev",
    type: "plugin",
    category: "coding",
    description:
      "Skills for designing and building MCP servers, covering deployment models and tool design patterns.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/mcp-server-dev",
    official: true,
    stars: 33269,
    stackTags: ["ai-assisted-sdlc", "enterprise-integration-patterns"],
  },
  {
    name: "Plugin Dev",
    type: "plugin",
    category: "coding",
    description:
      "Toolkit for developing Claude Code plugins with 7 expert skills covering hooks, MCP, commands, and agents.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/plugin-dev",
    official: true,
    stars: 33269,
    stackTags: ["ai-assisted-sdlc"],
  },
  {
    name: "Agent SDK Dev",
    type: "plugin",
    category: "coding",
    description: "Development kit for building with the Claude Agent SDK.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/agent-sdk-dev",
    official: true,
    stars: 33269,
    stackTags: ["ai-assisted-sdlc"],
  },
  {
    name: "Superpowers",
    type: "plugin",
    category: "coding",
    description:
      "Teaches Claude brainstorming, subagent-driven development with built-in code review, systematic debugging, and red/green TDD.",
    repoUrl: "https://github.com/obra/superpowers",
    stars: 269133,
  },
  {
    name: "Lumen",
    type: "plugin",
    category: "coding",
    description:
      "Local semantic code search via MCP, indexing codebases with Go AST parsing and vector embeddings.",
    repoUrl: "https://github.com/ory/lumen",
    stars: 243,
  },
  {
    name: "Serena",
    type: "plugin",
    category: "coding",
    description:
      "Semantic code analysis MCP server for code understanding, refactoring suggestions, and navigation via LSP.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/external_plugins/serena",
    official: true,
    stars: 33269,
  },
  {
    name: "Sourcegraph",
    type: "plugin",
    category: "coding",
    description:
      "Code search and understanding across repositories, tracing references and analyzing refactor impact.",
    repoUrl: "https://github.com/sourcegraph-community/sourcegraph-claudecode-plugin",
    stars: 4,
  },
  {
    name: "Greptile",
    type: "plugin",
    category: "coding",
    description:
      "AI-powered codebase search using natural language to find code and understand dependencies.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/external_plugins/greptile",
    official: true,
    stars: 33269,
  },
  {
    name: "Modern Web Guidance",
    type: "plugin",
    category: "coding",
    description:
      "Keeps the coding agent current on the latest web development best practices.",
    repoUrl: "https://github.com/GoogleChrome/modern-web-guidance",
    official: true,
    stars: 1660,
  },
  {
    name: "GitKraken",
    type: "plugin",
    category: "coding",
    description:
      "Gives Claude access to real Git and project context — commits, branches, PRs, issues — across GitHub, GitLab, etc.",
    repoUrl: "https://github.com/gitkraken/claude-plugin",
    official: true,
    stars: 0,
  },
  {
    name: "Expo",
    type: "plugin",
    category: "coding",
    description:
      "Official Expo skills for building, deploying, upgrading, and debugging React Native apps.",
    repoUrl: "https://github.com/expo/skills/tree/main/plugins/expo",
    official: true,
    stars: 2380,
  },
  {
    name: "AWS Core",
    type: "plugin",
    category: "coding",
    description:
      "Skills to author infrastructure-as-code and build/deploy/operate applications on core AWS services.",
    repoUrl: "https://github.com/aws/agent-toolkit-for-aws/tree/main/plugins/aws-core",
    official: true,
    stars: 2268,
    stackTags: ["aws", "best-practices"],
  },
  {
    name: "AWS Serverless",
    type: "plugin",
    category: "coding",
    description:
      "Design, build, deploy, test, and debug serverless applications with AWS Serverless services.",
    repoUrl:
      "https://github.com/awslabs/agent-plugins/tree/main/plugins/aws-serverless",
    official: true,
    stars: 855,
    stackTags: ["aws", "aws-lambda", "aws-api-gateway"],
  },
  {
    name: "Terraform",
    type: "plugin",
    category: "coding",
    description:
      "Integration with the Terraform ecosystem for infrastructure-as-code automation and interaction.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/external_plugins/terraform",
    official: true,
    stars: 33269,
    stackTags: ["aws", "best-practices"],
  },
  {
    name: "Code Review (Anthropic)",
    type: "plugin",
    category: "code-review",
    description:
      "Automated code review for pull requests using multiple specialized agents with confidence-based scoring.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/code-review",
    official: true,
    stars: 33269,
    stackTags: ["best-practices"],
  },
  {
    name: "Code Simplifier",
    type: "plugin",
    category: "code-review",
    description:
      "Agent that simplifies and refines recently modified code for clarity and maintainability while preserving functionality.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/code-simplifier",
    official: true,
    stars: 33269,
    stackTags: ["best-practices", "design-patterns"],
  },
  {
    name: "PR Review Toolkit",
    type: "plugin",
    category: "code-review",
    description:
      "Agents specializing in PR comments, tests, error handling, type design, code quality, and simplification.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/pr-review-toolkit",
    official: true,
    stars: 33269,
    stackTags: ["best-practices"],
  },
  {
    name: "CodeRabbit",
    type: "plugin",
    category: "code-review",
    description:
      "External code review validation using a specialized AI architecture and 40+ integrated static analyzers.",
    repoUrl: "https://github.com/coderabbitai/skills",
    official: true,
    stars: 149,
    stackTags: ["best-practices", "owasp"],
  },
  {
    name: "SonarQube",
    type: "plugin",
    category: "code-review",
    description:
      "Enforces code quality and security in the agent coding loop with 7,000+ rules, secrets scanning, and quality gates.",
    repoUrl: "https://github.com/SonarSource/sonarqube-agent-plugins",
    official: true,
    stars: 99,
    stackTags: ["owasp", "best-practices"],
  },
  {
    name: "Semgrep",
    type: "plugin",
    category: "code-review",
    description:
      "Catches security vulnerabilities in real time and guides Claude to write secure code from the start.",
    repoUrl: "https://github.com/semgrep/mcp-marketplace/tree/main/plugin",
    official: true,
    stars: 10,
    stackTags: ["owasp"],
  },
  {
    name: "Claude Security",
    type: "plugin",
    category: "code-review",
    description:
      "Deep vulnerability scanning of your own code inside a Claude Code session, with findings challenged before reporting.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-security",
    official: true,
    stars: 33269,
    stackTags: ["owasp"],
  },
  {
    name: "Aikido",
    type: "plugin",
    category: "code-review",
    description:
      "SAST, secrets, and IaC vulnerability detection powered by the Aikido Security MCP server.",
    repoUrl: "https://github.com/AikidoSec/aikido-claude-plugin",
    official: true,
    stars: 13,
    stackTags: ["owasp"],
  },
  {
    name: "GitHub",
    type: "plugin",
    category: "code-review",
    description:
      "Official GitHub MCP server for repository management — issues, PRs, code review, and repo search.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/external_plugins/github",
    official: true,
    stars: 33269,
  },
  {
    name: "Playwright",
    type: "plugin",
    category: "testing",
    description:
      "Browser automation and end-to-end testing MCP server by Microsoft for interacting with web pages, screenshots, and form fills.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/external_plugins/playwright",
    official: true,
    stars: 33269,
  },
  {
    name: "GrowthBook",
    type: "plugin",
    category: "testing",
    description:
      "Agent skills covering the full feature-flag and experimentation testing lifecycle.",
    repoUrl: "https://github.com/growthbook/skills",
    official: true,
    stars: 18,
  },
  {
    name: "CodSpeed",
    type: "plugin",
    category: "testing",
    description:
      "Performance testing toolkit for benchmarking results, flamegraphs, and performance comparisons.",
    repoUrl: "https://github.com/CodSpeedHQ/codspeed",
    official: true,
    stars: 245,
  },
  {
    name: "Chrome DevTools MCP",
    type: "plugin",
    category: "testing",
    description:
      "Controls and inspects a live Chrome browser to record performance traces, analyze network requests, and check console messages.",
    repoUrl: "https://github.com/ChromeDevTools/chrome-devtools-mcp",
    official: true,
    stars: 48748,
  },
  {
    name: "Postman",
    type: "plugin",
    category: "testing",
    description:
      "Full API lifecycle management — sync collections, generate client code, run tests, create mocks, and audit security.",
    repoUrl: "https://github.com/Postman-Devrel/postman-claude-code-plugin",
    official: true,
    stars: 36,
  },
  {
    name: "StackHawk HawkScan",
    type: "plugin",
    category: "testing",
    description:
      "Configures, runs, and interprets DAST scan results, generating stackhawk.yml configs and transforming findings.",
    repoUrl:
      "https://github.com/stackhawk/agent-skills/tree/main/plugins/hawkscan",
    official: true,
    stars: 15,
    stackTags: ["owasp"],
  },
  {
    name: "NightVision",
    type: "plugin",
    category: "testing",
    description:
      "DAST and API discovery platform skills for finding exploitable vulnerabilities in web apps and REST APIs.",
    repoUrl: "https://github.com/nvsecurity/nightvision-skills",
    official: true,
    stars: 2,
    stackTags: ["owasp"],
  },
  {
    name: "42Crunch API Security Testing",
    type: "plugin",
    category: "testing",
    description:
      "Automates API security testing — audits OpenAPI specs and detects OWASP API Security vulnerabilities (e.g. BOLA/BFLA).",
    repoUrl:
      "https://github.com/42Crunch-AI/claude-plugins/tree/main/plugins/api-security-testing",
    official: true,
    stars: 1,
    stackTags: ["owasp", "aws-api-gateway"],
  },
  {
    name: "Buildkite",
    type: "plugin",
    category: "ci-cd",
    description:
      "Official Buildkite skills for pipelines, migration, preflight checks, agent runtime, CLI, and API.",
    repoUrl: "https://github.com/buildkite/skills",
    official: true,
    stars: 15,
  },
  {
    name: "TeamCity CLI",
    type: "plugin",
    category: "ci-cd",
    description:
      "Agent skill for interacting with TeamCity CI/CD — explore builds, view logs, start jobs, and manage queues/agents.",
    repoUrl: "https://github.com/JetBrains/teamcity-cli",
    official: true,
    stars: 120,
  },
  {
    name: "GitLab",
    type: "plugin",
    category: "ci-cd",
    description:
      "GitLab DevOps platform integration — repositories, merge requests, CI/CD pipelines, issues, and wikis.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/external_plugins/gitlab",
    official: true,
    stars: 33269,
  },
  {
    name: "Mergify",
    type: "plugin",
    category: "ci-cd",
    description:
      "Skills for the Mergify CLI — merge queues, stacked PRs, Test Insights (flaky test quarantine), and merge protections.",
    repoUrl: "https://github.com/mergifyio/mergify-cli",
    official: true,
    stars: 29,
  },
  {
    name: "JFrog",
    type: "plugin",
    category: "ci-cd",
    description:
      "Access the JFrog Platform — Artifactory repos/artifacts, security findings, and Catalog package safety across pipelines.",
    repoUrl: "https://github.com/jfrog/claude-plugin",
    official: true,
    stars: 4,
  },
  {
    name: "Endor Labs (ai-plugins)",
    type: "plugin",
    category: "ci-cd",
    description:
      "Sets up endorctl and Endor Labs to scan, prioritize, and fix security risks across the software supply chain.",
    repoUrl: "https://github.com/endorlabs/ai-plugins",
    official: true,
    stars: 9,
    stackTags: ["owasp"],
  },
  {
    name: "Sonatype Guide",
    type: "plugin",
    category: "ci-cd",
    description:
      "Software supply chain intelligence and dependency security — analyzes dependencies for vulnerabilities and version recommendations.",
    repoUrl: "https://github.com/sonatype/sonatype-guide-claude-plugin",
    official: true,
    stars: 3,
    stackTags: ["owasp"],
  },
  {
    name: "Snyk (Secure at Inception)",
    type: "plugin",
    category: "ci-cd",
    description:
      "Integrates Snyk security scanning into the agentic coding loop, catching vulnerabilities as Claude writes code.",
    repoUrl: "https://github.com/snyk/claude-plugin-snyk",
    official: true,
    stars: 0,
    stackTags: ["owasp"],
  },
  {
    name: "Claude Code GitHub Action",
    type: "plugin",
    category: "ci-cd",
    description:
      "Anthropic's first-party GitHub Action that runs Claude Code inside repository workflows (e.g. via @claude mentions on PRs/issues).",
    repoUrl: "https://github.com/anthropics/claude-code-action",
    official: true,
    stars: 8556,
  },
  {
    name: "Azure",
    type: "plugin",
    category: "deployment",
    description:
      "Integrates the Azure MCP server and specialized Azure skills to move beyond generic cloud advice.",
    repoUrl: "https://github.com/microsoft/azure-skills",
    official: true,
    stars: 1362,
  },
  {
    name: "Cloudflare",
    type: "plugin",
    category: "deployment",
    description:
      "Skills for the Cloudflare developer platform — Workers, Durable Objects, Agents SDK, and Wrangler CLI.",
    repoUrl: "https://github.com/cloudflare/skills",
    official: true,
    stars: 2579,
  },
  {
    name: "Vercel",
    type: "plugin",
    category: "deployment",
    description:
      "Manage deployments, check build status, access logs, and configure domains on Vercel's platform.",
    repoUrl: "https://github.com/vercel/vercel-plugin",
    official: true,
    stars: 245,
  },
  {
    name: "Render",
    type: "plugin",
    category: "deployment",
    description:
      "Deploy, debug, and monitor applications on Render, including a render.yaml validation hook.",
    repoUrl: "https://github.com/render-oss/render-plugin-claude-code",
    official: true,
    stars: 0,
  },
  {
    name: "Railway",
    type: "plugin",
    category: "deployment",
    description:
      "Deploy and manage apps, databases, and infrastructure on Railway — setup, deploys, networking, and troubleshooting.",
    repoUrl: "https://github.com/railwayapp/railway-skills/tree/main/plugins/railway",
    official: true,
    stars: 303,
  },
  {
    name: "Hostinger",
    type: "plugin",
    category: "deployment",
    description:
      "Deploy, manage, and monitor Hostinger websites, domains, and VPS services.",
    repoUrl: "https://github.com/hostinger/claude-plugin",
    official: true,
    stars: 2,
  },
  {
    name: "Deploy on AWS",
    type: "plugin",
    category: "deployment",
    description:
      "Deploys applications to AWS with architecture recommendations, cost estimates, and IaC deployment.",
    repoUrl:
      "https://github.com/awslabs/agent-plugins/tree/main/plugins/deploy-on-aws",
    official: true,
    stars: 855,
    stackTags: ["aws", "distributed-systems"],
  },
  {
    name: "Netlify Skills",
    type: "plugin",
    category: "deployment",
    description:
      "Netlify platform skills — functions, edge functions, blobs, image CDN, forms, CLI, and deploy workflows.",
    repoUrl: "https://github.com/netlify/context-and-tools",
    official: true,
    stars: 32,
  },
  {
    name: "Val Town",
    type: "plugin",
    category: "deployment",
    description:
      "Bundles the Val Town MCP server and skills for HTTP vals, cron/intervals, SQLite, and deploys.",
    repoUrl: "https://github.com/val-town/plugins/tree/main/plugin",
    official: true,
    stars: 9,
  },
  {
    name: "Datadog",
    type: "plugin",
    category: "monitoring",
    description:
      "Query logs, metrics, traces, and dashboards through a preconfigured Datadog MCP server.",
    repoUrl: "https://github.com/datadog-labs/claude-code-plugin",
    stars: 8,
    stackTags: ["distributed-systems", "resilience"],
  },
  {
    name: "Grafana MCP",
    type: "plugin",
    category: "monitoring",
    description:
      "MCP server for AI-assisted Grafana dashboard, datasource, alerting, and incident management.",
    repoUrl: "https://github.com/grafana/ai-marketplace/tree/main/plugins/grafana-mcp",
    official: true,
    stars: 16,
    stackTags: ["distributed-systems", "resilience"],
  },
  {
    name: "Honeycomb",
    type: "plugin",
    category: "monitoring",
    description:
      "Skills and workflows for Honeycomb observability — query patterns, production investigations, and SLOs.",
    repoUrl: "https://github.com/honeycombio/agent-skill/tree/main/honeycomb",
    official: true,
    stars: 20,
    stackTags: ["distributed-systems", "resilience"],
  },
  {
    name: "Sentry",
    type: "plugin",
    category: "monitoring",
    description:
      "Access error reports, analyze stack traces, search issues by fingerprint, and debug production errors.",
    repoUrl: "https://github.com/getsentry/plugin-claude",
    official: true,
    stars: 1,
    stackTags: ["distributed-systems", "resilience"],
  },
  {
    name: "New Relic",
    type: "plugin",
    category: "monitoring",
    description:
      "Investigate APM performance, analyze cloud costs, debug Kubernetes, write NRQL queries, and respond to alerts.",
    repoUrl: "https://github.com/newrelic/claude-code-plugin",
    official: true,
    stars: 0,
    stackTags: ["distributed-systems", "resilience"],
  },
  {
    name: "PagerDuty",
    type: "plugin",
    category: "monitoring",
    description:
      "Enhances code quality via risk scoring and incident correlation, scoring pre-commit diffs against historical incident data.",
    repoUrl: "https://github.com/PagerDuty/claude-code-plugins",
    official: true,
    stars: 6,
    stackTags: ["resilience"],
  },
  {
    name: "Rootly",
    type: "plugin",
    category: "monitoring",
    description:
      "Full-lifecycle incident management — deploy safety, incident response, on-call management, and retrospectives.",
    repoUrl: "https://github.com/Rootly-AI-Labs/rootly-claude-plugin",
    official: true,
    stars: 1,
    stackTags: ["resilience"],
  },
  {
    name: "Langfuse Observability",
    type: "plugin",
    category: "monitoring",
    description:
      "Captures and exports traces, spans, and session telemetry from Claude Code to Langfuse for LLM monitoring.",
    repoUrl: "https://github.com/langfuse/claude-observability-plugin",
    official: true,
    stars: 16,
    stackTags: ["ai-assisted-sdlc"],
  },
  {
    name: "MLflow",
    type: "plugin",
    category: "monitoring",
    description:
      "Skills for tracing, evaluating, and improving AI agents through the full instrument-trace-evaluate-iterate loop.",
    repoUrl: "https://github.com/mlflow/skills",
    official: true,
    stars: 69,
    stackTags: ["ai-assisted-sdlc"],
  },
  {
    name: "Dash0",
    type: "plugin",
    category: "monitoring",
    description:
      "OpenTelemetry observability for Claude Code sessions, capturing tool calls, LLM invocations, and errors as traces.",
    repoUrl: "https://github.com/dash0hq/dash0-agent-plugin",
    official: true,
    stars: 4,
    stackTags: ["distributed-systems", "ai-assisted-sdlc"],
  },
  {
    name: "Logfire",
    type: "plugin",
    category: "monitoring",
    description:
      "Adds Logfire observability to Python applications with auto-instrumentation for FastAPI, httpx, and SQLAlchemy.",
    repoUrl: "https://github.com/pydantic/skills/tree/main/plugins/logfire",
    official: true,
    stars: 121,
    stackTags: ["python", "distributed-systems"],
  },
  {
    name: "LogRocket",
    type: "plugin",
    category: "monitoring",
    description:
      "Query session replays, metrics, issues, and user behavior from LogRocket using natural language.",
    repoUrl: "https://github.com/LogRocket/logrocket-claude-plugin/tree/main/plugins/logrocket",
    official: true,
    stars: 2,
  },
  {
    name: "PostHog",
    type: "plugin",
    category: "monitoring",
    description:
      "Access PostHog analytics, feature flags, experiments, error tracking, and insights.",
    repoUrl: "https://github.com/PostHog/ai-plugin",
    official: true,
    stars: 75,
  },
  {
    name: "Fullstory",
    type: "plugin",
    category: "monitoring",
    description:
      "Query behavioral analytics, session replays, and customer experience insights from Fullstory.",
    repoUrl: "https://github.com/fullstorydev/fullstory-skills",
    official: true,
    stars: 9,
  },
  {
    name: "Noibu",
    type: "plugin",
    category: "monitoring",
    description:
      "Connects Claude to ecommerce store session, error, and revenue-impact data for customer experience monitoring.",
    repoUrl: "https://github.com/Noibu/ai-plugin/tree/main/src",
    official: true,
    stars: 5,
  },
  {
    name: "Mintlify",
    type: "plugin",
    category: "documentation",
    description:
      "Builds documentation sites with Mintlify — converts files into MDX pages and enforces correct component usage.",
    repoUrl: "https://github.com/mintlify/mintlify-claude-plugin",
    official: true,
    stars: 7,
  },
  {
    name: "Context7",
    type: "plugin",
    category: "documentation",
    description:
      "Upstash Context7 MCP server for up-to-date library documentation lookup via a hosted remote MCP server.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/external_plugins/context7",
    official: true,
    stars: 33269,
  },
  {
    name: "Microsoft Docs",
    type: "plugin",
    category: "documentation",
    description:
      "Accesses official Microsoft documentation, API references, and code samples for Azure, .NET, and Windows.",
    repoUrl: "https://github.com/MicrosoftDocs/mcp",
    official: true,
    stars: 1821,
  },
  {
    name: "CLAUDE.md Management",
    type: "plugin",
    category: "documentation",
    description:
      "Tools to audit quality, capture session learnings, and keep CLAUDE.md project memory files current.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-md-management",
    official: true,
    stars: 33269,
    stackTags: ["ai-assisted-sdlc", "best-practices"],
  },
  {
    name: "Astral (ruff / uv / ty)",
    type: "plugin",
    category: "coding",
    description:
      "Official Astral plugin bundling ruff linting, uv dependency management, and the ty type checker/LSP for Python.",
    repoUrl: "https://github.com/astral-sh/claude-code-plugins",
    official: true,
    stars: 297,
    stackTags: ["python", "best-practices"],
  },
  {
    name: "Python Backend Plugins",
    type: "plugin",
    category: "coding",
    description:
      "Seven Python backend plugins covering ruff lint enforcement, pytest assistance, typing checks, Alembic migrations, and FastAPI scaffolding.",
    repoUrl: "https://github.com/ruslan-korneev/claude-plugins",
    stars: 4,
    stackTags: ["python", "best-practices"],
  },
  {
    name: "AWS Dev Toolkit for Startups",
    type: "plugin",
    category: "coding",
    description:
      "Official AWS Samples collection of 34 skills with dedicated Lambda, DynamoDB, S3, and API Gateway guidance (cold starts, single-table design, throttling, authorizers).",
    repoUrl: "https://github.com/aws-samples/sample-claude-code-plugins-for-startups",
    official: true,
    stars: 12,
    stackTags: ["aws", "aws-lambda", "aws-api-gateway", "aws-dynamodb", "aws-s3"],
  },
  {
    name: "AWS Skills (Serverless EDA)",
    type: "plugin",
    category: "coding",
    description:
      "Event-driven architecture skills for Lambda, S3, and DynamoDB, plus Step Functions, saga/event-sourcing, CDK/SST, and cost-ops patterns.",
    repoUrl: "https://github.com/zxkane/aws-skills",
    stars: 346,
    stackTags: ["aws", "aws-lambda", "aws-dynamodb", "aws-s3", "distributed-systems"],
  },
  {
    name: "Website Deployment (AWS Serverless)",
    type: "plugin",
    category: "deployment",
    description:
      "Deploys Node/Express/Vite apps to an S3 + CloudFront + Lambda + API Gateway serverless stack via CDK.",
    repoUrl: "https://github.com/schuettc/claude-code-plugins",
    stars: 13,
    stackTags: ["aws", "aws-lambda", "aws-api-gateway"],
  },
  {
    name: "Clean Architecture Skills",
    type: "plugin",
    category: "coding",
    description:
      "Reviews code against Robert C. Martin's Dependency Rule and layer structure, plus a Kent Beck-style refactoring skill.",
    repoUrl: "https://github.com/nathankim0/clean-architecture-skills",
    stars: 80,
    stackTags: ["clean-architecture", "design-patterns"],
  },
  {
    name: "Symfony Hexagonal Architecture",
    type: "plugin",
    category: "coding",
    description:
      "Enforces hexagonal architecture (ports & adapters) in Symfony projects via 10 auto-triggered skills and 2 review agents.",
    repoUrl: "https://github.com/aligundogdu/symfony-hexagonal-skill",
    stars: 32,
    stackTags: ["clean-architecture"],
  },
  {
    name: "Go Clean DDD Skill",
    type: "plugin",
    category: "coding",
    description:
      "Interactive DDD modeling assistant that defines bounded contexts and generates Go code following Clean Architecture and the Uber Style Guide.",
    repoUrl: "https://github.com/zudochkin/go-clean-ddd-skill",
    stars: 1,
    stackTags: ["ddd", "clean-architecture"],
  },
  {
    name: "Canonical Texts Skills (DDD & Clean Architecture)",
    type: "plugin",
    category: "coding",
    description:
      "62-skill collection distilled from canonical software texts, including dedicated Domain-Driven Design (Eric Evans) and Clean Architecture (Robert C. Martin) skills.",
    repoUrl: "https://github.com/wondelai/skills",
    stars: 1866,
    stackTags: ["ddd", "clean-architecture", "design-patterns"],
  },
  {
    name: "GoF Design Patterns",
    type: "plugin",
    category: "coding",
    description:
      "Dedicated skill covering all 23 Gang-of-Four design patterns (creational, structural, behavioral) with language-agnostic pseudocode and trade-offs.",
    repoUrl: "https://github.com/grndlvl/software-patterns",
    stars: 14,
    stackTags: ["design-patterns"],
  },
  {
    name: "Apache Camel MCP Server",
    type: "plugin",
    category: "coding",
    description:
      "Official Apache Camel MCP server giving Claude Code live access to the Camel component catalog plus endpoint/route validation — the reference framework for Enterprise Integration Patterns.",
    repoUrl: "https://github.com/apache/camel",
    official: true,
    stars: 6282,
    stackTags: ["enterprise-integration-patterns", "distributed-systems"],
  },
  {
    name: "Claude Code OWASP",
    type: "plugin",
    category: "code-review",
    description:
      "Dedicated OWASP Top 10:2025 and ASVS 5.0 skill, plus LLM/RAG security (LLM01-10) and Agentic AI security (ASI01-10) coverage across 20+ languages.",
    repoUrl: "https://github.com/agamm/claude-code-owasp",
    stars: 327,
    stackTags: ["owasp"],
  },
  {
    name: "Security Audit Skill",
    type: "plugin",
    category: "code-review",
    description:
      "OWASP-pattern security audit skill scoped to PHP codebases.",
    repoUrl: "https://github.com/netresearch/security-audit-skill",
    stars: 33,
    stackTags: ["owasp"],
  },
  {
    name: "Mercado Pago",
    type: "plugin",
    category: "coding",
    description:
      "Official Mercado Pago integration toolkit — checkout wizard, webhooks, test setup, and review, backed by their MCP server.",
    repoUrl: "https://github.com/mercadopago/mercadopago-claude-marketplace",
    official: true,
    stars: 24,
    stackTags: ["banking", "payments"],
  },
  {
    name: "Circle",
    type: "plugin",
    category: "coding",
    description:
      "Official Circle skills for USDC payments, cross-chain transfers, wallets, and smart contracts via Circle's MCP server.",
    repoUrl: "https://github.com/circlefin/skills",
    official: true,
    stars: 138,
    stackTags: ["banking", "payments"],
  },
  {
    name: "Airwallex",
    type: "plugin",
    category: "coding",
    description:
      "Official Airwallex plugins — one orchestrates financial-ops actions in plain language, the other generates checkout/billing/KYC integration code.",
    repoUrl: "https://github.com/airwallex/airwallex-marketplace",
    official: true,
    stars: 3,
    stackTags: ["banking", "payments"],
  },
  {
    name: "Stripe MCP Skill",
    type: "plugin",
    category: "coding",
    description:
      "Community skill for Stripe payment integration via MCP.",
    repoUrl: "https://github.com/wrsmith108/stripe-mcp-skill",
    stars: 1,
    stackTags: ["payments"],
  },
  {
    name: "Finance Skills",
    type: "plugin",
    category: "coding",
    description:
      "81 skills across 7 domain plugins covering investment management, regulatory compliance, advisory, trading, and financial ops.",
    repoUrl: "https://github.com/JoelLewis/finance_skills",
    stars: 164,
    stackTags: ["banking", "payments"],
  },
];

const agents: CatalogItem[] = [
  // Architecture (DDD, hexagonal/clean architecture, system design)
  {
    name: "Backend Architect",
    type: "agent",
    category: "architecture",
    description:
      "RESTful API design, microservice boundaries, and database schema definition for backend systems.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/backend-api-security/agents/backend-architect.md",
    stars: 38654,
    stackTags: ["ddd", "clean-architecture", "hexagonal-architecture", "design-patterns"],
  },
  {
    name: "Database Architect",
    type: "agent",
    category: "architecture",
    description:
      "Designs database schemas and technology selection from scratch, including migration planning between engines.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/database-design/agents/database-architect.md",
    stars: 38654,
    stackTags: ["ddd", "best-practices"],
  },
  {
    name: "Event Sourcing Architect",
    type: "agent",
    category: "architecture",
    description:
      "Designs event sourcing, CQRS patterns, event stores, and sagas for auditable, replayable domain state.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/backend-development/agents/event-sourcing-architect.md",
    stars: 38654,
    stackTags: ["ddd", "design-patterns", "distributed-systems"],
  },
  {
    name: "Architect Review",
    type: "agent",
    category: "architecture",
    description:
      "Analyzes architectural consistency and validates that changes follow the project's established patterns.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/comprehensive-review/agents/architect-review.md",
    stars: 38654,
    stackTags: ["clean-architecture", "hexagonal-architecture", "design-patterns"],
  },
  {
    name: "Monorepo Architect",
    type: "agent",
    category: "architecture",
    description:
      "Configures and optimizes monorepo tooling (Nx, Turborepo, Bazel) for large multi-service codebases.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/developer-essentials/agents/monorepo-architect.md",
    stars: 38654,
    stackTags: ["best-practices"],
  },
  {
    name: "Hybrid Cloud Architect",
    type: "agent",
    category: "architecture",
    description:
      "Designs multi-cloud and hybrid cloud-to-on-premises strategies for regulated enterprise environments.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/cloud-infrastructure/agents/hybrid-cloud-architect.md",
    stars: 38654,
    stackTags: ["aws", "distributed-systems"],
  },
  {
    name: "API Designer",
    type: "agent",
    category: "architecture",
    description:
      "Designs REST/GraphQL endpoints, OpenAPI specs, authentication patterns, and API versioning strategies.",
    repoUrl:
      "https://github.com/VoltAgent/awesome-claude-code-subagents/blob/main/categories/01-core-development/api-designer.md",
    stars: 24163,
    stackTags: ["enterprise-integration-patterns", "best-practices"],
  },
  {
    name: "Microservices Architect",
    type: "agent",
    category: "architecture",
    description:
      "Decomposes monolithic applications into independent microservices and establishes inter-service communication patterns at scale.",
    repoUrl:
      "https://github.com/VoltAgent/awesome-claude-code-subagents/blob/main/categories/01-core-development/microservices-architect.md",
    stars: 24163,
    stackTags: ["ddd", "distributed-systems", "enterprise-integration-patterns"],
  },
  {
    name: "Feature Dev: Code Architect",
    type: "agent",
    category: "architecture",
    description:
      "Designs feature architectures from existing codebase patterns, producing implementation blueprints with specific files, component designs, and data flows.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/feature-dev",
    official: true,
    stars: 33330,
    stackTags: ["clean-architecture", "ai-assisted-sdlc"],
  },
  {
    name: "Feature Dev: Code Explorer",
    type: "agent",
    category: "architecture",
    description:
      "Traces execution paths and maps architecture layers of existing features to inform new development.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/feature-dev",
    official: true,
    stars: 33330,
    stackTags: ["ai-assisted-sdlc", "clean-architecture"],
  },
  {
    name: "Architect (Everything Claude Code)",
    type: "agent",
    category: "architecture",
    description:
      "Software architecture specialist for system design, scalability, and technical decision-making — used proactively when planning features or making architectural decisions.",
    repoUrl: "https://github.com/affaan-m/everything-claude-code",
    stars: 239029,
    stackTags: ["clean-architecture", "best-practices"],
  },
  {
    name: "Full Stack Agent",
    type: "agent",
    category: "architecture",
    description:
      "Team-lead agent that researches requirements, designs specs, creates implementation plans, and delegates work across a specialist agent pool.",
    repoUrl: "https://github.com/aws-samples/sample-claude-code-agent-team",
    official: true,
    stars: 48,
    stackTags: ["aws", "best-practices"],
  },
  {
    name: "Legacy Modernizer",
    type: "agent",
    category: "architecture",
    description:
      "Refactors and modernizes legacy codebases toward current architecture and language idioms without breaking existing behavior.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/code-refactoring/agents/legacy-modernizer.md",
    stars: 38654,
    stackTags: ["clean-architecture", "best-practices"],
  },

  // Backend Python
  {
    name: "Python Pro",
    type: "agent",
    category: "backend-python",
    description:
      "Python development with advanced language features, async patterns, and performance optimization.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/python-development/agents/python-pro.md",
    stars: 38654,
    stackTags: ["python", "best-practices"],
  },
  {
    name: "FastAPI Pro",
    type: "agent",
    category: "backend-python",
    description:
      "FastAPI development with async request handling and Pydantic-based validation, suited to serverless API backends.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/python-development/agents/fastapi-pro.md",
    stars: 38654,
    stackTags: ["python", "aws-api-gateway"],
  },
  {
    name: "Django Pro",
    type: "agent",
    category: "backend-python",
    description:
      "Django development covering the ORM, async views, and admin-heavy backend applications.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/python-development/agents/django-pro.md",
    stars: 38654,
    stackTags: ["python"],
  },
  {
    name: "SQL Pro",
    type: "agent",
    category: "backend-python",
    description: "Writes and optimizes complex SQL queries, indexes, and database migrations.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/database-design/agents/sql-pro.md",
    stars: 38654,
    stackTags: ["python", "best-practices"],
  },
  {
    name: "Python Reviewer",
    type: "agent",
    category: "backend-python",
    description:
      "Reviews Python code for PEP 8 compliance, Pythonic idioms, type hints, security, and performance.",
    repoUrl: "https://github.com/affaan-m/everything-claude-code",
    stars: 239029,
    stackTags: ["python", "owasp", "best-practices"],
  },
  {
    name: "Agent SDK Verifier (Python)",
    type: "agent",
    category: "backend-python",
    description:
      "Verifies that a Python Claude Agent SDK application is properly configured, follows SDK best practices, and is ready for deployment.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/agent-sdk-dev",
    official: true,
    stars: 33330,
    stackTags: ["python", "ai-assisted-sdlc"],
  },
  {
    name: "Coding Agent",
    type: "agent",
    category: "backend-python",
    description:
      "Implements features and writes tests from specifications handed off by the team lead, using the Sonnet model.",
    repoUrl: "https://github.com/aws-samples/sample-claude-code-agent-team",
    official: true,
    stars: 48,
    stackTags: ["python", "aws"],
  },

  // Security & Compliance (OWASP, PCI DSS, ISO 27001)
  {
    name: "Security Auditor",
    type: "agent",
    category: "security-compliance",
    description: "Vulnerability assessment and OWASP compliance review across an application's attack surface.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/security-compliance/agents/security-auditor.md",
    stars: 38654,
    stackTags: ["owasp", "best-practices"],
  },
  {
    name: "Backend Security Coder",
    type: "agent",
    category: "security-compliance",
    description:
      "Implements secure backend coding patterns and API security controls — authN/authZ, input validation, rate limiting.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/backend-api-security/agents/backend-security-coder.md",
    stars: 38654,
    stackTags: ["owasp", "aws-api-gateway"],
  },
  {
    name: "Threat Modeling Expert",
    type: "agent",
    category: "security-compliance",
    description:
      "Runs STRIDE threat modeling, builds attack trees, and derives security requirements from system design.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/security-scanning/agents/threat-modeling-expert.md",
    stars: 38654,
    stackTags: ["owasp", "pci-dss"],
  },
  {
    name: "Payment Integration",
    type: "agent",
    category: "security-compliance",
    description:
      "Integrates payment processors with attention to PCI-scoped data handling and transaction flows.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/payment-processing/agents/payment-integration.md",
    stars: 38654,
    stackTags: ["banking", "payments", "pci-dss"],
  },
  {
    name: "Security Reviewer",
    type: "agent",
    category: "security-compliance",
    description:
      "Flags secrets, SSRF, injection, unsafe crypto, and OWASP Top 10 vulnerabilities in code that handles user input, auth, or sensitive data.",
    repoUrl: "https://github.com/affaan-m/everything-claude-code",
    stars: 239029,
    stackTags: ["owasp", "best-practices"],
  },
  {
    name: "Compliance Auditor",
    type: "agent",
    category: "security-compliance",
    description:
      "Implements compliance controls and prepares audit evidence across GDPR, HIPAA, PCI DSS, SOC 2, and ISO frameworks.",
    repoUrl:
      "https://github.com/VoltAgent/awesome-claude-code-subagents/blob/main/categories/04-quality-security/compliance-auditor.md",
    stars: 24163,
    stackTags: ["pci-dss", "iso27001"],
  },
  {
    name: "GDPR/CCPA Compliance",
    type: "agent",
    category: "security-compliance",
    description:
      "Reviews data practices and assesses privacy requirements against GDPR and CCPA/CPRA obligations.",
    repoUrl:
      "https://github.com/VoltAgent/awesome-claude-code-subagents/blob/main/categories/04-quality-security/gdpr-ccpa-compliance.md",
    stars: 24163,
    stackTags: ["iso27001"],
  },
  {
    name: "Penetration Tester",
    type: "agent",
    category: "security-compliance",
    description:
      "Conducts authorized penetration tests — active exploitation and validation — across web apps, networks, and APIs.",
    repoUrl:
      "https://github.com/VoltAgent/awesome-claude-code-subagents/blob/main/categories/04-quality-security/penetration-tester.md",
    stars: 24163,
    stackTags: ["owasp"],
  },
  {
    name: "Security Engineer",
    type: "agent",
    category: "security-compliance",
    description:
      "Builds automated security controls into CI/CD pipelines and establishes compliance and vulnerability-management programs.",
    repoUrl:
      "https://github.com/VoltAgent/awesome-claude-code-subagents/blob/main/categories/03-infrastructure/security-engineer.md",
    stars: 24163,
    stackTags: ["owasp", "pci-dss", "best-practices"],
  },
  {
    name: "Product Manager (Secure SDLC)",
    type: "agent",
    category: "security-compliance",
    description:
      "Maps security requirements against the OWASP ASVS framework at the planning stage of the SDLC.",
    repoUrl: "https://github.com/Kaademos/secure-sdlc-agents",
    stars: 12,
    stackTags: ["owasp"],
  },
  {
    name: "AppSec Engineer",
    type: "agent",
    category: "security-compliance",
    description: "Conducts threat modeling, SAST/DAST analysis, and vulnerability triage across the SDLC.",
    repoUrl: "https://github.com/Kaademos/secure-sdlc-agents",
    stars: 12,
    stackTags: ["owasp"],
  },
  {
    name: "GRC Analyst",
    type: "agent",
    category: "security-compliance",
    description:
      "Manages compliance mapping to PCI DSS/ISO 27001-style frameworks, risk registers, and audit evidence collection.",
    repoUrl: "https://github.com/Kaademos/secure-sdlc-agents",
    stars: 12,
    stackTags: ["pci-dss", "iso27001"],
  },
  {
    name: "Security Champion",
    type: "agent",
    category: "security-compliance",
    description:
      "Provides lightweight first-line security Q&A and guidance embedded directly in the development team.",
    repoUrl: "https://github.com/Kaademos/secure-sdlc-agents",
    stars: 12,
    stackTags: ["owasp"],
  },
  {
    name: "AI Security Engineer",
    type: "agent",
    category: "security-compliance",
    description: "Assesses prompt injection risk and LLM-specific vulnerabilities for AI-assisted features.",
    repoUrl: "https://github.com/Kaademos/secure-sdlc-agents",
    stars: 12,
    stackTags: ["owasp", "ai-assisted-sdlc"],
  },
  {
    name: "Compliance Automation Engineer",
    type: "agent",
    category: "security-compliance",
    description:
      "Automates SOX, PCI-DSS, GDPR, and HIPAA compliance with continuous monitoring and audit-trail validation.",
    repoUrl:
      "https://github.com/gensecaihq/Claude-Code-Subagents-Collection/blob/main/subagents/security-compliance/compliance-automation-engineer.md",
    stars: 28,
    stackTags: ["pci-dss", "iso27001"],
  },
  {
    name: "Crypto Implementation Expert",
    type: "agent",
    category: "security-compliance",
    description:
      "Reviews cryptographic algorithm selection, implementation, and key management for correctness and PCI-scoped data protection.",
    repoUrl:
      "https://github.com/gensecaihq/Claude-Code-Subagents-Collection/blob/main/subagents/security-compliance/crypto-implementation-expert.md",
    stars: 28,
    stackTags: ["pci-dss", "owasp"],
  },
  {
    name: "Identity Management Specialist",
    type: "agent",
    category: "security-compliance",
    description:
      "Designs IAM and SSO solutions — identity and access management architecture for enterprise environments.",
    repoUrl:
      "https://github.com/gensecaihq/Claude-Code-Subagents-Collection/blob/main/subagents/security-compliance/identity-management-specialist.md",
    stars: 28,
    stackTags: ["aws", "iso27001"],
  },
  {
    name: "Privacy Engineer",
    type: "agent",
    category: "security-compliance",
    description:
      "Implements privacy-by-design principles and GDPR-compliant data handling in software systems.",
    repoUrl:
      "https://github.com/gensecaihq/Claude-Code-Subagents-Collection/blob/main/subagents/security-compliance/privacy-engineer.md",
    stars: 28,
    stackTags: ["iso27001"],
  },
  {
    name: "SAST Specialist",
    type: "agent",
    category: "security-compliance",
    description:
      "Integrates static application security testing into development workflows and triages automated findings.",
    repoUrl:
      "https://github.com/gensecaihq/Claude-Code-Subagents-Collection/blob/main/subagents/security-compliance/sast-specialist.md",
    stars: 28,
    stackTags: ["owasp", "best-practices"],
  },
  {
    name: "Security Architecture Consultant",
    type: "agent",
    category: "security-compliance",
    description:
      "Designs zero-trust security architecture and enterprise security frameworks with regulatory-compliance alignment.",
    repoUrl:
      "https://github.com/gensecaihq/Claude-Code-Subagents-Collection/blob/main/subagents/security-compliance/security-architecture-consultant.md",
    stars: 28,
    stackTags: ["iso27001", "pci-dss"],
  },
  {
    name: "Supply Chain Security Expert",
    type: "agent",
    category: "security-compliance",
    description:
      "Implements software-supply-chain security controls and third-party/vendor dependency risk management.",
    repoUrl:
      "https://github.com/gensecaihq/Claude-Code-Subagents-Collection/blob/main/subagents/security-compliance/supply-chain-security-expert.md",
    stars: 28,
    stackTags: ["owasp", "best-practices"],
  },
  {
    name: "Zero Trust Architect",
    type: "agent",
    category: "security-compliance",
    description: "Designs 'never trust, always verify' zero-trust architectures for distributed systems.",
    repoUrl:
      "https://github.com/gensecaihq/Claude-Code-Subagents-Collection/blob/main/subagents/security-compliance/zero-trust-architect.md",
    stars: 28,
    stackTags: ["iso27001", "aws"],
  },
  {
    name: "Vulnerability Assessment Specialist",
    type: "agent",
    category: "security-compliance",
    description:
      "Runs CVSS-scored vulnerability assessment and threat modeling with business-impact and compliance correlation.",
    repoUrl:
      "https://github.com/gensecaihq/Claude-Code-Subagents-Collection/blob/main/subagents/security-compliance/vulnerability-assessment-specialist.md",
    stars: 28,
    stackTags: ["owasp", "pci-dss"],
  },

  // AWS Serverless
  {
    name: "Cloud Architect",
    type: "agent",
    category: "aws-serverless",
    description:
      "Designs AWS/Azure/GCP infrastructure with a focus on cost optimization, security, and serverless-first patterns.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/cloud-infrastructure/agents/cloud-architect.md",
    stars: 38654,
    stackTags: ["aws", "aws-lambda", "aws-api-gateway"],
  },
  {
    name: "Terraform Specialist",
    type: "agent",
    category: "aws-serverless",
    description: "Writes and maintains Infrastructure-as-Code modules and remote state for AWS serverless stacks.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/cloud-infrastructure/agents/terraform-specialist.md",
    stars: 38654,
    stackTags: ["aws", "best-practices"],
  },
  {
    name: "Network Engineer",
    type: "agent",
    category: "aws-serverless",
    description:
      "Debugs networking, load balancing, and traffic analysis across API Gateway, CloudFront, and VPC boundaries.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/cloud-infrastructure/agents/network-engineer.md",
    stars: 38654,
    stackTags: ["aws", "aws-api-gateway"],
  },
  {
    name: "Platform Engineer",
    type: "agent",
    category: "aws-serverless",
    description:
      "Builds internal developer platforms and self-service infrastructure with golden paths for serverless delivery.",
    repoUrl:
      "https://github.com/VoltAgent/awesome-claude-code-subagents/blob/main/categories/03-infrastructure/platform-engineer.md",
    stars: 24163,
    stackTags: ["aws", "best-practices"],
  },
  {
    name: "Cloud Platform Engineer",
    type: "agent",
    category: "aws-serverless",
    description:
      "Reviews infrastructure-as-code for security issues and handles secrets management across cloud deployments.",
    repoUrl: "https://github.com/Kaademos/secure-sdlc-agents",
    stars: 12,
    stackTags: ["aws", "owasp"],
  },
  {
    name: "DevOps Agent",
    type: "agent",
    category: "aws-serverless",
    description: "Handles infrastructure, CI/CD, containers, and documentation for the agent team's AWS deployments.",
    repoUrl: "https://github.com/aws-samples/sample-claude-code-agent-team",
    official: true,
    stars: 48,
    stackTags: ["aws", "aws-lambda"],
  },
  {
    name: "Solutions Architect Agent",
    type: "agent",
    category: "aws-serverless",
    description: "AWS specialist running Well-Architected Framework reviews plus cost and security assessments.",
    repoUrl: "https://github.com/aws-samples/sample-claude-code-agent-team",
    official: true,
    stars: 48,
    stackTags: ["aws", "aws-lambda", "aws-api-gateway", "aws-dynamodb", "aws-s3"],
  },

  // Testing & QA
  {
    name: "TDD Orchestrator",
    type: "agent",
    category: "testing-qa",
    description: "Guides Test-Driven Development methodology across a session, enforcing red-green-refactor discipline.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/tdd-workflows/agents/tdd-orchestrator.md",
    stars: 38654,
    stackTags: ["best-practices"],
  },
  {
    name: "Test Automator",
    type: "agent",
    category: "testing-qa",
    description: "Builds comprehensive unit, integration, and end-to-end test suites.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/incident-response/agents/test-automator.md",
    stars: 38654,
    stackTags: ["best-practices"],
  },
  {
    name: "Debugger",
    type: "agent",
    category: "testing-qa",
    description: "Resolves errors and analyzes test failures to find root cause.",
    repoUrl: "https://github.com/wshobson/agents/blob/main/plugins/incident-response/agents/debugger.md",
    stars: 38654,
    stackTags: ["best-practices"],
  },
  {
    name: "Error Detective",
    type: "agent",
    category: "testing-qa",
    description: "Analyzes logs and recognizes error patterns across a distributed system.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/incident-response/agents/error-detective.md",
    stars: 38654,
    stackTags: ["observability", "distributed-systems"],
  },
  {
    name: "TDD Guard",
    type: "agent",
    category: "testing-qa",
    description: "Enforces test-driven development — write-tests-first methodology with 80%+ coverage targets.",
    repoUrl: "https://github.com/affaan-m/everything-claude-code",
    stars: 239029,
    stackTags: ["best-practices"],
  },
  {
    name: "E2E Runner",
    type: "agent",
    category: "testing-qa",
    description:
      "Generates and runs end-to-end tests with Playwright, capturing screenshots, videos, and traces as artifacts.",
    repoUrl: "https://github.com/affaan-m/everything-claude-code",
    stars: 239029,
    stackTags: ["best-practices"],
  },
  {
    name: "QA Expert",
    type: "agent",
    category: "testing-qa",
    description: "Builds comprehensive QA strategy, test planning, and quality-metrics analysis across the development cycle.",
    repoUrl:
      "https://github.com/VoltAgent/awesome-claude-code-subagents/blob/main/categories/04-quality-security/qa-expert.md",
    stars: 24163,
    stackTags: ["best-practices"],
  },
  {
    name: "Chaos Engineer",
    type: "agent",
    category: "testing-qa",
    description:
      "Designs controlled failure experiments and game-day exercises to validate system resilience before real incidents.",
    repoUrl:
      "https://github.com/VoltAgent/awesome-claude-code-subagents/blob/main/categories/04-quality-security/chaos-engineer.md",
    stars: 24163,
    stackTags: ["resilience", "aws"],
  },
  {
    name: "Team Debugger",
    type: "agent",
    category: "testing-qa",
    description:
      "Investigates one assigned hypothesis in a parallel debugging effort, gathering evidence with file:line citations and confidence levels.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/agent-teams/agents/team-debugger.md",
    stars: 38654,
    stackTags: ["ai-assisted-sdlc"],
  },

  // Code Review
  {
    name: "Code Reviewer (wshobson/agents)",
    type: "agent",
    category: "code-review",
    description: "Code review with a security focus and an eye on production reliability.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/comprehensive-review/agents/code-reviewer.md",
    stars: 38654,
    stackTags: ["owasp", "best-practices"],
  },
  {
    name: "Team Reviewer",
    type: "agent",
    category: "code-review",
    description:
      "Reviews one assigned dimension — security, performance, architecture, testing, or accessibility — with a structured finding format, as part of a parallel multi-reviewer team.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/agent-teams/agents/team-reviewer.md",
    stars: 38654,
    stackTags: ["owasp", "best-practices"],
  },
  {
    name: "Dev Lead (Secure Code Review)",
    type: "agent",
    category: "code-review",
    description: "Performs secure code review and software composition analysis as part of a full secure-SDLC agent team.",
    repoUrl: "https://github.com/Kaademos/secure-sdlc-agents",
    stars: 12,
    stackTags: ["owasp", "best-practices"],
  },
  {
    name: "PR Review Toolkit: Code Reviewer",
    type: "agent",
    category: "code-review",
    description: "Reviews code for adherence to project guidelines, style, and best practices before a commit or PR.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/pr-review-toolkit",
    official: true,
    stars: 33330,
    stackTags: ["best-practices"],
  },
  {
    name: "PR Review Toolkit: Code Simplifier",
    type: "agent",
    category: "code-review",
    description:
      "Simplifies and refines recently modified code for clarity, consistency, and maintainability while preserving functionality.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/pr-review-toolkit",
    official: true,
    stars: 33330,
    stackTags: ["best-practices", "design-patterns"],
  },
  {
    name: "PR Review Toolkit: Comment Analyzer",
    type: "agent",
    category: "code-review",
    description: "Analyzes code comments for accuracy, completeness, and long-term maintainability before a PR is finalized.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/pr-review-toolkit",
    official: true,
    stars: 33330,
    stackTags: ["best-practices"],
  },
  {
    name: "PR Review Toolkit: PR Test Analyzer",
    type: "agent",
    category: "code-review",
    description:
      "Reviews a pull request's test coverage for quality and completeness against the new functionality it introduces.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/pr-review-toolkit",
    official: true,
    stars: 33330,
    stackTags: ["best-practices"],
  },
  {
    name: "PR Review Toolkit: Silent Failure Hunter",
    type: "agent",
    category: "code-review",
    description:
      "Identifies silent failures, inadequate error handling, and inappropriate fallback behavior in error-handling code.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/pr-review-toolkit",
    official: true,
    stars: 33330,
    stackTags: ["resilience", "best-practices"],
  },
  {
    name: "PR Review Toolkit: Type Design Analyzer",
    type: "agent",
    category: "code-review",
    description: "Analyzes new or changed types for encapsulation, invariant expression, usefulness, and enforcement.",
    repoUrl:
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/pr-review-toolkit",
    official: true,
    stars: 33330,
    stackTags: ["design-patterns", "best-practices"],
  },
  {
    name: "Code Reviewer (Everything Claude Code)",
    type: "agent",
    category: "code-review",
    description: "Expert code review for quality, security, and maintainability, used proactively on every code change.",
    repoUrl: "https://github.com/affaan-m/everything-claude-code",
    stars: 239029,
    stackTags: ["owasp", "best-practices"],
  },
  {
    name: "Refactor Cleaner",
    type: "agent",
    category: "code-review",
    description:
      "Identifies and safely removes unused code, duplicates, and dead abstractions, backed by dependency-analysis tooling.",
    repoUrl: "https://github.com/affaan-m/everything-claude-code",
    stars: 239029,
    stackTags: ["best-practices"],
  },
  {
    name: "Review Agent",
    type: "agent",
    category: "code-review",
    description: "Reviews implementations for correctness, security, and quality, using Opus as the team's quality gate.",
    repoUrl: "https://github.com/aws-samples/sample-claude-code-agent-team",
    official: true,
    stars: 48,
    stackTags: ["owasp", "aws"],
  },

  // Data & Persistence
  {
    name: "Database Admin",
    type: "agent",
    category: "data-persistence",
    description: "Handles database operations — backup, replication, and monitoring — for production data stores.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/database-migrations/agents/database-admin.md",
    stars: 38654,
    stackTags: ["best-practices"],
  },
  {
    name: "Database Optimizer",
    type: "agent",
    category: "data-persistence",
    description: "Optimizes queries, index design, and migration strategies for relational and NoSQL data stores.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/database-cloud-optimization/agents/database-optimizer.md",
    stars: 38654,
    stackTags: ["aws-dynamodb", "best-practices"],
  },
  {
    name: "Data Engineer",
    type: "agent",
    category: "data-persistence",
    description: "Builds ETL pipelines, data warehouses, and streaming architectures.",
    repoUrl: "https://github.com/wshobson/agents/blob/main/plugins/data-engineering/agents/data-engineer.md",
    stars: 38654,
    stackTags: ["aws", "distributed-systems"],
  },
  {
    name: "Database Reviewer",
    type: "agent",
    category: "data-persistence",
    description:
      "PostgreSQL specialist for query optimization, schema design, security, and performance review, incorporating Supabase-style best practices.",
    repoUrl: "https://github.com/affaan-m/everything-claude-code",
    stars: 239029,
    stackTags: ["best-practices"],
  },
  {
    name: "Postgres Pro",
    type: "agent",
    category: "data-persistence",
    description:
      "Optimizes PostgreSQL performance, designs high-availability replication, and troubleshoots database issues at enterprise scale.",
    repoUrl:
      "https://github.com/VoltAgent/awesome-claude-code-subagents/blob/main/categories/05-data-ai/postgres-pro.md",
    stars: 24163,
    stackTags: ["best-practices"],
  },
  {
    name: "Data Analyst",
    type: "agent",
    category: "data-persistence",
    description:
      "Extracts insights from business data, builds dashboards and reports, and performs statistical analysis to support decisions.",
    repoUrl:
      "https://github.com/VoltAgent/awesome-claude-code-subagents/blob/main/categories/05-data-ai/data-analyst.md",
    stars: 24163,
    stackTags: ["best-practices"],
  },

  // Documentation
  {
    name: "C4 Context",
    type: "agent",
    category: "documentation",
    description: "Generates C4 Context-level system documentation covering personas, journeys, and system boundaries.",
    repoUrl: "https://github.com/wshobson/agents/blob/main/plugins/c4-architecture/agents/c4-context.md",
    stars: 38654,
    stackTags: ["design-patterns"],
  },
  {
    name: "C4 Container",
    type: "agent",
    category: "documentation",
    description: "Generates C4 Container-level architecture documentation, including API surface documentation.",
    repoUrl: "https://github.com/wshobson/agents/blob/main/plugins/c4-architecture/agents/c4-container.md",
    stars: 38654,
    stackTags: ["design-patterns"],
  },
  {
    name: "C4 Component",
    type: "agent",
    category: "documentation",
    description: "Synthesizes and documents C4 Component-level architecture from the codebase.",
    repoUrl: "https://github.com/wshobson/agents/blob/main/plugins/c4-architecture/agents/c4-component.md",
    stars: 38654,
    stackTags: ["design-patterns"],
  },
  {
    name: "C4 Code",
    type: "agent",
    category: "documentation",
    description: "Generates C4 Code-level documentation with signatures and dependency detail.",
    repoUrl: "https://github.com/wshobson/agents/blob/main/plugins/c4-architecture/agents/c4-code.md",
    stars: 38654,
    stackTags: ["design-patterns"],
  },
  {
    name: "Docs Architect",
    type: "agent",
    category: "documentation",
    description: "Generates comprehensive technical documentation for a codebase or system.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/code-documentation/agents/docs-architect.md",
    stars: 38654,
    stackTags: ["best-practices"],
  },
  {
    name: "Tutorial Engineer",
    type: "agent",
    category: "documentation",
    description: "Writes step-by-step tutorials and educational onboarding content for a codebase.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/code-documentation/agents/tutorial-engineer.md",
    stars: 38654,
    stackTags: ["best-practices"],
  },
  {
    name: "API Documenter",
    type: "agent",
    category: "documentation",
    description: "Generates OpenAPI/Swagger specifications and developer-facing API documentation.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/documentation-generation/agents/api-documenter.md",
    stars: 38654,
    stackTags: ["aws-api-gateway", "best-practices"],
  },
  {
    name: "Reference Builder",
    type: "agent",
    category: "documentation",
    description: "Builds technical references and API documentation from the codebase.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/documentation-generation/agents/reference-builder.md",
    stars: 38654,
    stackTags: ["best-practices"],
  },
  {
    name: "Doc Updater",
    type: "agent",
    category: "documentation",
    description: "Updates codemaps and documentation, keeping READMEs and architecture guides in sync with the codebase.",
    repoUrl: "https://github.com/affaan-m/everything-claude-code",
    stars: 239029,
    stackTags: ["best-practices"],
  },

  // DevOps & CI/CD
  {
    name: "Deployment Engineer",
    type: "agent",
    category: "devops-cicd",
    description: "Builds CI/CD pipelines, containerization, and cloud deployment workflows.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/cicd-automation/agents/deployment-engineer.md",
    stars: 38654,
    stackTags: ["aws", "best-practices"],
  },
  {
    name: "DevOps Troubleshooter",
    type: "agent",
    category: "devops-cicd",
    description: "Debugs production issues via log analysis and deployment troubleshooting.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/incident-response/agents/devops-troubleshooter.md",
    stars: 38654,
    stackTags: ["observability", "resilience"],
  },
  {
    name: "Incident Responder",
    type: "agent",
    category: "devops-cicd",
    description: "Manages and resolves production incidents end to end.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/incident-response/agents/incident-responder.md",
    stars: 38654,
    stackTags: ["resilience", "observability"],
  },
  {
    name: "Observability Engineer",
    type: "agent",
    category: "devops-cicd",
    description: "Sets up production monitoring, distributed tracing, and SLI/SLO definitions.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/observability-monitoring/agents/observability-engineer.md",
    stars: 38654,
    stackTags: ["observability", "distributed-systems"],
  },
  {
    name: "Performance Engineer",
    type: "agent",
    category: "devops-cicd",
    description: "Profiles applications and optimizes performance bottlenecks.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/observability-monitoring/agents/performance-engineer.md",
    stars: 38654,
    stackTags: ["observability", "resilience"],
  },
  {
    name: "Context Manager",
    type: "agent",
    category: "devops-cicd",
    description: "Manages shared context across a multi-agent session so agents stay coordinated on a single source of truth.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/agent-orchestration/agents/context-manager.md",
    stars: 38654,
    stackTags: ["ai-assisted-sdlc"],
  },
  {
    name: "Team Lead",
    type: "agent",
    category: "devops-cicd",
    description:
      "Orchestrates a multi-agent team — decomposes work into parallel tasks with file-ownership boundaries, manages the team's lifecycle, and synthesizes results.",
    repoUrl: "https://github.com/wshobson/agents/blob/main/plugins/agent-teams/agents/team-lead.md",
    stars: 38654,
    stackTags: ["ai-assisted-sdlc"],
  },
  {
    name: "Team Implementer",
    type: "agent",
    category: "devops-cicd",
    description:
      "Implements components within strict file-ownership boundaries as part of a parallel multi-agent build, coordinating at integration points via messaging.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/agent-teams/agents/team-implementer.md",
    stars: 38654,
    stackTags: ["ai-assisted-sdlc"],
  },
  {
    name: "Conductor Validator",
    type: "agent",
    category: "devops-cicd",
    description: "Validates project artifacts for completeness, consistency, and correctness before implementation begins.",
    repoUrl: "https://github.com/wshobson/agents/blob/main/plugins/conductor/agents/conductor-validator.md",
    stars: 38654,
    stackTags: ["ai-assisted-sdlc", "best-practices"],
  },
  {
    name: "Planner",
    type: "agent",
    category: "devops-cicd",
    description: "Restates requirements, assesses risks, and creates a step-by-step implementation plan before any code is touched.",
    repoUrl: "https://github.com/affaan-m/everything-claude-code",
    stars: 239029,
    stackTags: ["ai-assisted-sdlc", "best-practices"],
  },
  {
    name: "DevOps Incident Responder",
    type: "agent",
    category: "devops-cicd",
    description:
      "Responds to production incidents, performs rapid diagnostics, and implements permanent fixes with a focus on reducing MTTR.",
    repoUrl:
      "https://github.com/VoltAgent/awesome-claude-code-subagents/blob/main/categories/03-infrastructure/devops-incident-responder.md",
    stars: 24163,
    stackTags: ["resilience", "observability"],
  },
  {
    name: "Release Manager",
    type: "agent",
    category: "devops-cicd",
    description: "Executes pre-release security gates and sign-off as part of a secure-SDLC release process.",
    repoUrl: "https://github.com/Kaademos/secure-sdlc-agents",
    stars: 12,
    stackTags: ["owasp", "best-practices"],
  },
  {
    name: "DX Optimizer",
    type: "agent",
    category: "devops-cicd",
    description: "Optimizes developer experience and tooling to reduce friction across the SDLC.",
    repoUrl:
      "https://github.com/wshobson/agents/blob/main/plugins/team-collaboration/agents/dx-optimizer.md",
    stars: 38654,
    stackTags: ["best-practices", "ai-assisted-sdlc"],
  },
  {
    name: "Agent Organizer",
    type: "agent",
    category: "devops-cicd",
    description:
      "Analyzes project requirements and recommends an optimal team of specialized agents for a task, without implementing solutions itself.",
    repoUrl: "https://github.com/lst97/claude-code-sub-agents/blob/main/agents/agent-organizer.md",
    stars: 1658,
    stackTags: ["ai-assisted-sdlc"],
  },
];

const rag: CatalogItem[] = [
  {
    name: "claude-context",
    type: "rag",
    category: "code-retrieval",
    description:
      "Semantic search MCP server over an entire codebase, powered by Milvus/Zilliz vector storage plus embeddings — add with claude mcp add for index_codebase and search_code tools.",
    repoUrl: "https://github.com/zilliztech/claude-context",
    official: true,
    stars: 12328,
  },
  {
    name: "Serena",
    type: "rag",
    category: "code-retrieval",
    description:
      "Symbolic code retrieval and editing MCP server built on the Language Server Protocol (find_symbol, find_referencing_symbols) — no embeddings or vector DB required, 30+ languages.",
    repoUrl: "https://github.com/oraios/serena",
    official: true,
    stars: 27744,
  },
  {
    name: "Context7",
    type: "rag",
    category: "code-retrieval",
    description:
      "Always up-to-date library and framework documentation, served straight into the prompt via MCP or CLI — resolves a library id, then pulls current docs instead of stale training data.",
    repoUrl: "https://github.com/upstash/context7",
    official: true,
    stars: 60431,
  },
  {
    name: "Repomix",
    type: "rag",
    category: "code-retrieval",
    description:
      "Packs an entire repository into a single AI-friendly file with tree-sitter based compression (~70% fewer tokens), with an MCP server exposing grep-style search over the packed output.",
    repoUrl: "https://github.com/yamadashy/repomix",
    stars: 27707,
  },
  {
    name: "Anthropic Cookbook",
    type: "rag",
    category: "code-retrieval",
    description:
      "Anthropic's official recipes for Contextual Retrieval — contextual embeddings + BM25 + reranking — with runnable code and the evaluation set behind Anthropic's published accuracy numbers.",
    repoUrl: "https://github.com/anthropics/anthropic-cookbook",
    official: true,
    stars: 51147,
  },
  {
    name: "Milvus",
    type: "rag",
    category: "vector-db",
    description:
      "Vector database built to scale to billions of vectors — the backend behind claude-context, with a dedicated MCP server for direct semantic search integration.",
    repoUrl: "https://github.com/milvus-io/milvus",
    official: true,
    stars: 45567,
  },
  {
    name: "Qdrant",
    type: "rag",
    category: "vector-db",
    description:
      "Rust-based vector database with an official MCP server (qdrant-store / qdrant-find) — strong balance of performance and filtering, with sparse and ColBERT-style retrieval support.",
    repoUrl: "https://github.com/qdrant/qdrant",
    official: true,
    stars: 33856,
  },
  {
    name: "Chroma",
    type: "rag",
    category: "vector-db",
    description:
      "The simplest vector database to prototype with — vector, full-text, and metadata filtering, plus an official MCP server supporting Voyage, OpenAI, Cohere, and Jina embeddings.",
    repoUrl: "https://github.com/chroma-core/chroma",
    official: true,
    stars: 28984,
  },
  {
    name: "LangChain",
    type: "rag",
    category: "framework",
    description:
      "The most widely used RAG/LLM orchestration framework — a custom or FastMCP-wrapped LangChain pipeline is a common way to expose a RAG backend to Claude Code as an MCP server.",
    repoUrl: "https://github.com/langchain-ai/langchain",
    official: true,
    stars: 143720,
  },
  {
    name: "LlamaIndex",
    type: "rag",
    category: "framework",
    description:
      "Data ingestion and indexing framework purpose-built for RAG — commonly paired with LangChain for orchestration, and the base many community MCP servers index on top of.",
    repoUrl: "https://github.com/run-llama/llama_index",
    official: true,
    stars: 51460,
  },
  {
    name: "Dify",
    type: "rag",
    category: "framework",
    description:
      "Low-code LLM application platform with built-in RAG pipelines and knowledge bases, exposing APIs that an MCP server can wrap for Claude Code access.",
    repoUrl: "https://github.com/langgenius/dify",
    official: true,
    stars: 151794,
  },
  {
    name: "MarkItDown",
    type: "rag",
    category: "ingestion",
    description:
      "Microsoft's converter from 15+ document formats (PDF, Office, images) to clean Markdown for LLM consumption, with an MCP server for direct use from Claude Code — 82% table-extraction F1, no GPU needed.",
    repoUrl: "https://github.com/microsoft/markitdown",
    official: true,
    stars: 172385,
  },
  {
    name: "Firecrawl",
    type: "rag",
    category: "ingestion",
    description:
      "Turns any website into clean Markdown for agents, with an official MCP server that adds scraping and search directly to Claude Code's toolset.",
    repoUrl: "https://github.com/mendableai/firecrawl",
    official: true,
    stars: 163300,
  },
  {
    name: "Voyage AI",
    type: "rag",
    category: "embeddings-rerank",
    description:
      "Anthropic's preferred text embedding provider — quoted verbatim in Anthropic's own Contextual Retrieval cookbook. voyage-3-large is the current flagship model, with domain-specific variants like voyage-code.",
    repoUrl: "https://voyageai.com",
    official: true,
  },
  {
    name: "Cohere Rerank",
    type: "rag",
    category: "embeddings-rerank",
    description:
      "The reranking API used in Anthropic's own Contextual Retrieval cookbook — the single step that takes retrieval-failure reduction from 49% to 67% over a naive top-20 baseline.",
    repoUrl: "https://cohere.com/rerank",
    official: true,
  },
  {
    name: "FlagEmbedding (BGE)",
    type: "rag",
    category: "embeddings-rerank",
    description:
      "Open-source, self-hostable embedding models from BAAI — a competitive alternative to hosted embedding APIs when data can't leave your infrastructure.",
    repoUrl: "https://github.com/FlagOpen/FlagEmbedding",
    official: true,
    stars: 12032,
  },
  {
    name: "Ragas",
    type: "rag",
    category: "evaluation",
    description:
      "Reference-free RAG evaluation metrics — faithfulness, answer relevancy, context relevancy — with adapters for LangChain, LlamaIndex, and Haystack.",
    repoUrl: "https://github.com/explodinggradients/ragas",
    official: true,
    stars: 15188,
  },
  {
    name: "DeepEval",
    type: "rag",
    category: "evaluation",
    description:
      "Pytest-style RAG/LLM testing framework with 50+ metrics, built to run in CI and fail the build when faithfulness or relevancy drops.",
    repoUrl: "https://github.com/confident-ai/deepeval",
    official: true,
    stars: 17478,
  },
  {
    name: "Promptfoo",
    type: "rag",
    category: "evaluation",
    description:
      "CLI for testing prompts and RAG pipelines, including red-teaming against 50+ vulnerability classes, with YAML config checked into the repo and CI-friendly exit codes.",
    repoUrl: "https://github.com/promptfoo/promptfoo",
    official: true,
    stars: 24070,
  },
  {
    name: "Mem0",
    type: "rag",
    category: "memory",
    description:
      "Memory layer for agents combining vector, graph, and key-value storage with automatic fact extraction, available as an MCP server for persisting context across Claude Code sessions.",
    repoUrl: "https://github.com/mem0ai/mem0",
    official: true,
    stars: 62826,
  },
  {
    name: "Graphiti",
    type: "rag",
    category: "memory",
    description:
      "Temporal knowledge graph library for agent memory — tracks how facts change over time and exposes that graph to Claude Code via MCP.",
    repoUrl: "https://github.com/getzep/graphiti",
    official: true,
    stars: 29687,
  },
  {
    name: "MCP Reference Servers",
    type: "rag",
    category: "memory",
    description:
      "Anthropic's official reference MCP servers — including a knowledge-graph-based memory server, plus filesystem, fetch, and git — the baseline building blocks for RAG-adjacent context.",
    repoUrl: "https://github.com/modelcontextprotocol/servers",
    official: true,
    stars: 89350,
  },
];

export const catalogItems: CatalogItem[] = [...hooks, ...plugins, ...rag, ...agents];
