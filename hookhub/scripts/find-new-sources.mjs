#!/usr/bin/env node
// Weekly source-discovery bot: searches the GitHub Search API for new
// Claude Code hooks/plugins/RAG tools/agents and appends candidates to
// data/candidates.json for human curation. Requires GITHUB_TOKEN in env.
//
// Run with: node --experimental-strip-types scripts/find-new-sources.mjs

import { readFile, writeFile, rename } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { TRUSTED_ORGS } from "./trusted-orgs.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const CATALOG_PATH = `${ROOT}data/catalog.ts`;
const CANDIDATES_JSON_PATH = `${ROOT}data/candidates.json`;

const REQUEST_TIMEOUT_MS = 15_000;
// If more than this fraction of searches fail, the run is untrustworthy —
// don't report a misleadingly clean "0 new candidates" week.
const MAX_FAILURE_RATE = 0.2;
// Deliberately narrow to claude-code-specific topics — generic ones like
// "mcp-server" pull in the entire MCP ecosystem regardless of relevance.
const TOPICS = [
  "claude-code",
  "claude-code-hook",
  "claude-code-hooks",
  "claude-code-plugin",
  "claude-code-plugins",
  "claude-code-agent",
  "claude-code-agents",
  "claude-code-subagents",
  "claude-subagent",
  "claude-subagents",
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

// Returns NaN for missing/unparseable dates, never a comparison-defeating
// value — callers must treat NaN as "reject", not silently pass every
// staleness check the way `NaN > threshold` (always false) would.
function daysAgo(isoDate) {
  const parsed = Date.parse(isoDate ?? "");
  if (Number.isNaN(parsed)) return NaN;
  return (Date.now() - parsed) / (24 * 60 * 60 * 1000);
}

let searchFailures = 0;
let searchAttempts = 0;

async function githubSearchRepos(query) {
  searchAttempts++;
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=30`;
  let res;
  try {
    res = await fetch(url, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "hookhub-source-discovery-bot",
      },
    });
  } catch (err) {
    searchFailures++;
    console.warn(`GitHub search request failed for query "${query}": ${err.message}`);
    return [];
  }
  if (!res.ok) {
    searchFailures++;
    console.warn(`GitHub search failed (${res.status}) for query "${query}": ${await res.text()}`);
    return [];
  }
  const data = await res.json();
  if (!Array.isArray(data.items)) {
    searchFailures++;
    console.warn(`Unexpected search response shape for query "${query}"`);
    return [];
  }
  return data.items;
}

// Fail closed: a repo with a missing/malformed stargazers_count or pushed_at
// must not silently bypass every admission gate the way `undefined < 50` and
// `NaN > 90` (both always false) would otherwise let it.
function parseRepo(repo) {
  const stars = Number(repo?.stargazers_count);
  const ageDays = daysAgo(repo?.pushed_at);
  if (!Number.isFinite(stars) || Number.isNaN(ageDays) || typeof repo?.html_url !== "string") {
    console.warn(`Skipping malformed search result: ${JSON.stringify(repo?.full_name ?? repo)}`);
    return null;
  }
  return { ...repo, stars, ageDays };
}

function toCandidateItem(repo, foundVia, discoveredAt) {
  return {
    name: repo.full_name,
    repoUrl: repo.html_url,
    description: (repo.description ?? "").trim(),
    stars: repo.stars,
    topics: repo.topics ?? [],
    foundVia,
    discoveredAt,
    status: "pending",
  };
}

async function readCandidatesFile() {
  const src = await readFile(CANDIDATES_JSON_PATH, "utf8");
  return JSON.parse(src);
}

async function writeCandidatesFile(allCandidates) {
  const body = `${JSON.stringify(allCandidates, null, 2)}\n`;
  // Write to a temp file and rename (atomic on the same filesystem) so an
  // overlapping run or a crash mid-write can't leave candidates.json
  // truncated or torn between two runs' output.
  const tmpPath = `${CANDIDATES_JSON_PATH}.tmp-${process.pid}`;
  await writeFile(tmpPath, body);
  await rename(tmpPath, CANDIDATES_JSON_PATH);
}

// Shared pipeline for both search strategies below: run the query, then
// apply the same star-floor / implausible-star-ceiling / staleness /
// dedup gates. `validateOwner`, when given, runs before the star checks
// and can reject a result outright (used to pin known-org results to the
// expected org id).
async function collectFrom({ query, foundVia, minStars, staleAfterDays, validateOwner }, ctx) {
  const repos = await githubSearchRepos(query);
  await sleep(SEARCH_API_DELAY_MS);
  for (const raw of repos) {
    const repo = parseRepo(raw);
    if (!repo) continue;
    if (validateOwner && !validateOwner(repo)) continue;
    if (repo.stars < minStars) continue;
    if (repo.stars > MAX_PLAUSIBLE_STARS) {
      console.warn(`Skipping implausible star count: ${repo.full_name} (${repo.stars}★)`);
      continue;
    }
    if (repo.ageDays > staleAfterDays) continue;
    const norm = normalizeRepoUrl(repo.html_url);
    if (ctx.knownUrls.has(norm) || ctx.found.has(norm)) continue;
    ctx.found.set(norm, toCandidateItem(repo, foundVia, ctx.today));
  }
}

async function main() {
  const { catalogItems } = await import(CATALOG_PATH);
  const existingCandidates = await readCandidatesFile();

  const ctx = {
    knownUrls: new Set(
      [...catalogItems, ...existingCandidates].map((item) => normalizeRepoUrl(item.repoUrl)),
    ),
    today: new Date().toISOString().slice(0, 10),
    found: new Map(), // normalized repoUrl -> candidate
  };

  for (const { login, id } of TRUSTED_ORGS) {
    await collectFrom(
      {
        query: `org:${login} ${RELEVANCE_PHRASE} in:name,description fork:false archived:false`,
        foundVia: "known-org",
        minStars: MIN_ORG_STARS,
        staleAfterDays: ORG_STALE_AFTER_DAYS,
        // Pin trust to the org's immutable numeric id, not just its login —
        // a renamed/deleted org's old login can be squatted by someone else.
        validateOwner: (repo) => {
          if (repo.owner?.id !== id) {
            console.warn(`Skipping ${repo.full_name}: owner id ${repo.owner?.id} doesn't match trusted org "${login}" (expected ${id})`);
            return false;
          }
          return true;
        },
      },
      ctx,
    );
  }

  for (const topic of TOPICS) {
    await collectFrom(
      {
        query: `topic:${topic} ${RELEVANCE_PHRASE} in:name,description fork:false archived:false`,
        foundVia: "topic-search",
        minStars: MIN_TOPIC_STARS,
        staleAfterDays: TOPIC_STALE_AFTER_DAYS,
      },
      ctx,
    );
  }

  if (searchAttempts > 0 && searchFailures / searchAttempts > MAX_FAILURE_RATE) {
    throw new Error(
      `${searchFailures}/${searchAttempts} GitHub searches failed — results are incomplete, refusing to report a clean run`,
    );
  }

  const newCandidates = [...ctx.found.values()].sort((a, b) => b.stars - a.stars);
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
