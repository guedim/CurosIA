export type ItemType = "hook" | "plugin" | "rag";

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

export type Category = HookCategory | PluginCategory | RagCategory;

export type StackTag =
  | "python"
  | "aws"
  | "aws-lambda"
  | "aws-api-gateway"
  | "aws-dynamodb"
  | "aws-s3"
  | "clean-architecture"
  | "distributed-systems"
  | "resilience"
  | "banking"
  | "payments"
  | "ddd"
  | "design-patterns"
  | "enterprise-integration-patterns"
  | "owasp"
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
  "distributed-systems",
  "resilience",
  "banking",
  "payments",
  "ddd",
  "design-patterns",
  "enterprise-integration-patterns",
  "owasp",
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

const hooks: CatalogItem[] = [
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
    name: "Auto-lint on Save",
    type: "hook",
    category: "formatting",
    description:
      "Runs the linter after every file write and rejects changes that introduce lint errors.",
    repoUrl: "https://github.com/affaan-m/everything-claude-code",
    stars: 238733,
    stackTags: ["best-practices"],
  },
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
    name: "claude-code-toast",
    type: "hook",
    category: "notifications",
    description:
      "Sends a macOS toast notification whenever Claude Code is waiting for a user response.",
    repoUrl: "https://github.com/eyalzh/claude-code-toast",
    stars: 17,
  },
  {
    name: "Voice Output Hooks",
    type: "hook",
    category: "notifications",
    description:
      "Adds text-to-speech voice output to Claude Code responses and notifications.",
    repoUrl: "https://github.com/shanraisshan/claude-code-hooks",
    stars: 498,
  },
  {
    name: "Multi-Agent Observability Dashboard",
    type: "hook",
    category: "logging",
    description:
      "Streams tool usage events from every hook to a real-time web dashboard for monitoring Claude Code agents.",
    repoUrl:
      "https://github.com/disler/claude-code-hooks-multi-agent-observability",
    stars: 1509,
  },
  {
    name: "Cost Tracker Hook",
    type: "hook",
    category: "logging",
    description:
      "Tracks token usage and estimated dollar cost per session, part of a 10-hook collection.",
    repoUrl: "https://github.com/karanb192/claude-code-hooks",
    stars: 466,
  },
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
    name: "Superpowers Session Start",
    type: "hook",
    category: "workflow",
    description:
      "Automatically loads project context and active tasks whenever a new Claude Code session starts.",
    repoUrl: "https://github.com/obra/superpowers",
    stars: 269133,
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

export const catalogItems: CatalogItem[] = [...hooks, ...plugins, ...rag];
