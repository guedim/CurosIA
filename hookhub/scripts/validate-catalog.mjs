#!/usr/bin/env node
// Data-integrity gate for data/catalog.ts and data/candidates.json. Run in CI
// (and locally before curating) to catch defects lint/build can't see:
// a candidate marked "rejected" that's nonetheless published, a "pending"
// candidate that's already been curated, and diverging star counts for the
// same repo across catalog rows.
//
// Run with: node --experimental-strip-types scripts/validate-catalog.mjs

import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const CATALOG_PATH = `${ROOT}data/catalog.ts`;
const CANDIDATES_PATH = `${ROOT}data/candidates.ts`;

function normalizeRepoUrl(url) {
  return url.trim().replace(/\.git$/i, "").replace(/\/+$/, "").toLowerCase();
}

const categoryByType = {
  hook: "hookCategories",
  plugin: "pluginCategories",
  rag: "ragCategories",
  agent: "agentCategories",
};

async function main() {
  const {
    catalogItems,
    hookCategories,
    pluginCategories,
    ragCategories,
    agentCategories,
  } = await import(CATALOG_PATH);
  const { candidateItems } = await import(CANDIDATES_PATH);

  const categoriesByType = {
    hook: hookCategories,
    plugin: pluginCategories,
    rag: ragCategories,
    agent: agentCategories,
  };

  const errors = [];

  // 1. No repo marked "rejected" in candidates.json may appear in catalog.ts.
  const rejectedUrls = new Set(
    candidateItems
      .filter((c) => c.status === "rejected")
      .map((c) => normalizeRepoUrl(c.repoUrl)),
  );
  for (const item of catalogItems) {
    if (rejectedUrls.has(normalizeRepoUrl(item.repoUrl))) {
      errors.push(
        `"${item.name}" (${item.repoUrl}) is published in catalog.ts but marked "rejected" in candidates.json`,
      );
    }
  }

  // 2. No "pending" candidate may already be curated into catalog.ts.
  const catalogUrls = new Set(catalogItems.map((item) => normalizeRepoUrl(item.repoUrl)));
  for (const candidate of candidateItems) {
    if (candidate.status === "pending" && catalogUrls.has(normalizeRepoUrl(candidate.repoUrl))) {
      errors.push(
        `"${candidate.name}" (${candidate.repoUrl}) is still "pending" in candidates.json but already exists in catalog.ts — delete it from candidates.json`,
      );
    }
  }

  // 3. Star counts for the same repo must not diverge across catalog rows.
  const starsByUrl = new Map();
  for (const item of catalogItems) {
    if (typeof item.stars !== "number") continue;
    const key = normalizeRepoUrl(item.repoUrl);
    const seen = starsByUrl.get(key) ?? new Set();
    seen.add(item.stars);
    starsByUrl.set(key, seen);
  }
  for (const [url, stars] of starsByUrl) {
    if (stars.size > 1) {
      errors.push(`${url} has diverging star counts across catalog.ts rows: ${[...stars].join(", ")}`);
    }
  }

  // 4. category must be valid for the item's type.
  for (const item of catalogItems) {
    const validCategories = categoriesByType[item.type];
    if (!validCategories?.includes(item.category)) {
      errors.push(
        `"${item.name}": category "${item.category}" is not valid for type "${item.type}" (expected one of ${categoryByType[item.type]})`,
      );
    }
  }

  if (errors.length > 0) {
    console.error(`catalog validation failed with ${errors.length} error(s):\n`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log(
    `catalog validation passed: ${catalogItems.length} catalog items, ${candidateItems.length} candidates checked.`,
  );
}

main();
