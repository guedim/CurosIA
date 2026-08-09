#!/usr/bin/env node
// Weekly source-discovery bot: searches the GitHub Search API for new
// Claude Code hooks/plugins/RAG tools and appends candidates to
// data/candidates.ts for human curation. Requires GITHUB_TOKEN in env.
//
// Run with: node --experimental-strip-types scripts/find-new-sources.mjs

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const CATALOG_PATH = `${ROOT}data/catalog.ts`;
const CANDIDATES_PATH = `${ROOT}data/candidates.ts`;
const CANDIDATES_ARRAY_MARKER =
  "export const candidateItems: CandidateItem[] = [";

const FIXED_KNOWN_ORGS = ["anthropics"];
// Deliberately narrow to claude-code-specific topics — generic ones like
// "mcp-server" pull in the entire MCP ecosystem regardless of relevance.
const TOPICS = [
  "claude-code",
  "claude-code-hook",
  "claude-code-hooks",
  "claude-code-plugin",
  "claude-code-plugins",
  "claude-code-agent",
  "claude-skill",
  "claude-skills",
];
// Both search strategies additionally require this exact phrase in the repo's
// name/description — a topic tag or org membership alone is too easy to game
// (unrelated popular repos add trending topics for visibility) and GitHub
// star counts can be farmed, so text relevance is the primary trust signal.
const RELEVANCE_PHRASE = '"claude code"';

const MIN_TOPIC_STARS = 50;
// Known-org repos skip the topic star bar (a brand-new official repo is
// still worth surfacing), but still need a token amount of traction to
// filter out barely-touched internal sample/doc repos (aws-samples in
// particular publishes many at 0-2 stars).
const MIN_ORG_STARS = 5;
// Sanity cap against farmed/fake-star repos: no legitimate Claude Code hook,
// plugin, or RAG tool plausibly outranks ecosystem giants like Next.js/VS
// Code in stars. Candidates above this are logged, not silently trusted.
const MAX_PLAUSIBLE_STARS = 150_000;
const TOPIC_STALE_AFTER_DAYS = 90;
const ORG_STALE_AFTER_DAYS = 365;
const SEARCH_API_DELAY_MS = 2100; // stay under the 30 req/min secondary rate limit

const token = process.env.GITHUB_TOKEN;
if (!token) {
  throw new Error("GITHUB_TOKEN env var is required to call the GitHub Search API");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeRepoUrl(url) {
  return url.trim().replace(/\.git$/i, "").replace(/\/+$/, "").toLowerCase();
}

function daysAgo(isoDate) {
  return (Date.now() - new Date(isoDate).getTime()) / (24 * 60 * 60 * 1000);
}

async function githubSearchRepos(query) {
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=30`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "hookhub-source-discovery-bot",
    },
  });
  if (!res.ok) {
    console.warn(`GitHub search failed (${res.status}) for query "${query}": ${await res.text()}`);
    return [];
  }
  const data = await res.json();
  return data.items ?? [];
}

function toCandidateItem(repo, foundVia, discoveredAt) {
  return {
    name: repo.full_name,
    repoUrl: repo.html_url,
    description: (repo.description ?? "").trim(),
    stars: repo.stargazers_count,
    topics: repo.topics ?? [],
    foundVia,
    discoveredAt,
    status: "pending",
  };
}

function extractOrg(repoUrl) {
  const match = repoUrl.match(/github\.com\/([^/]+)\//i);
  return match?.[1];
}

function tsString(value) {
  return JSON.stringify(value);
}

function serializeCandidate(item) {
  const topicsLiteral = `[${item.topics.map(tsString).join(", ")}]`;
  return [
    "  {",
    `    name: ${tsString(item.name)},`,
    `    repoUrl: ${tsString(item.repoUrl)},`,
    `    description: ${tsString(item.description)},`,
    `    stars: ${item.stars},`,
    `    topics: ${topicsLiteral},`,
    `    foundVia: ${tsString(item.foundVia)},`,
    `    discoveredAt: ${tsString(item.discoveredAt)},`,
    `    status: ${tsString(item.status)},`,
    "  },",
  ].join("\n");
}

async function writeCandidatesFile(allCandidates) {
  const src = await readFile(CANDIDATES_PATH, "utf8");
  const markerIndex = src.indexOf(CANDIDATES_ARRAY_MARKER);
  if (markerIndex === -1) {
    throw new Error(`Could not find "${CANDIDATES_ARRAY_MARKER}" in ${CANDIDATES_PATH}`);
  }
  const header = src.slice(0, markerIndex);
  const body = allCandidates.length
    ? `${CANDIDATES_ARRAY_MARKER}\n${allCandidates.map(serializeCandidate).join("\n")}\n];\n`
    : `${CANDIDATES_ARRAY_MARKER}];\n`;
  await writeFile(CANDIDATES_PATH, header + body);
}

async function main() {
  const { catalogItems } = await import(CATALOG_PATH);
  const { candidateItems: existingCandidates } = await import(CANDIDATES_PATH);

  const knownUrls = new Set(
    [...catalogItems, ...existingCandidates].map((item) => normalizeRepoUrl(item.repoUrl)),
  );

  const knownOrgs = new Set(FIXED_KNOWN_ORGS.map((org) => org.toLowerCase()));
  for (const item of catalogItems) {
    if (item.official) {
      const org = extractOrg(item.repoUrl);
      if (org) knownOrgs.add(org.toLowerCase());
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const found = new Map(); // normalized repoUrl -> candidate

  for (const org of knownOrgs) {
    const repos = await githubSearchRepos(`org:${org} ${RELEVANCE_PHRASE} in:name,description fork:false archived:false`);
    await sleep(SEARCH_API_DELAY_MS);
    for (const repo of repos) {
      if (repo.stargazers_count < MIN_ORG_STARS) continue;
      if (daysAgo(repo.pushed_at) > ORG_STALE_AFTER_DAYS) continue;
      if (repo.stargazers_count > MAX_PLAUSIBLE_STARS) {
        console.warn(`Skipping implausible star count: ${repo.full_name} (${repo.stargazers_count}★)`);
        continue;
      }
      const norm = normalizeRepoUrl(repo.html_url);
      if (knownUrls.has(norm) || found.has(norm)) continue;
      found.set(norm, toCandidateItem(repo, "known-org", today));
    }
  }

  for (const topic of TOPICS) {
    const repos = await githubSearchRepos(`topic:${topic} ${RELEVANCE_PHRASE} in:name,description fork:false archived:false`);
    await sleep(SEARCH_API_DELAY_MS);
    for (const repo of repos) {
      if (repo.stargazers_count < MIN_TOPIC_STARS) continue;
      if (repo.stargazers_count > MAX_PLAUSIBLE_STARS) {
        console.warn(`Skipping implausible star count: ${repo.full_name} (${repo.stargazers_count}★)`);
        continue;
      }
      if (daysAgo(repo.pushed_at) > TOPIC_STALE_AFTER_DAYS) continue;
      const norm = normalizeRepoUrl(repo.html_url);
      if (knownUrls.has(norm) || found.has(norm)) continue;
      found.set(norm, toCandidateItem(repo, "topic-search", today));
    }
  }

  const newCandidates = [...found.values()].sort((a, b) => b.stars - a.stars);
  const allCandidates = [...existingCandidates, ...newCandidates];

  await writeCandidatesFile(allCandidates);

  console.log(`Found ${newCandidates.length} new candidate(s):`);
  for (const c of newCandidates) {
    console.log(`  - ${c.name} (${c.stars}★, via ${c.foundVia}): ${c.repoUrl}`);
  }

  if (process.env.GITHUB_OUTPUT) {
    await writeFile(process.env.GITHUB_OUTPUT, `count=${newCandidates.length}\n`, { flag: "a" });
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
