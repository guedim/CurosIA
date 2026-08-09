/**
 * Weekly source-discovery candidates, found by scripts/find-new-sources.mjs
 * via the GitHub Search API. Not imported by the site — this is a curation
 * queue for a human to review, not production data.
 *
 * Workflow: the `hookhub-source-discovery` GitHub Action opens a PR when it
 * finds new candidates. To curate a PR:
 *   - Good find: move it into the matching array in `data/catalog.ts`,
 *     filling in `type`, `category`, and optional `stackTags`/`official`,
 *     then delete it from this file.
 *   - Not a fit: set its `status` to `"rejected"` (don't delete it) so the
 *     script never re-suggests the same repo.
 */

export type CandidateSource = "known-org" | "topic-search";
export type CandidateStatus = "pending" | "rejected";

export interface CandidateItem {
  name: string;
  repoUrl: string;
  description: string;
  stars: number;
  topics: string[];
  /** "known-org" = from an org that already has an `official: true` entry (or Anthropic); "topic-search" = matched a GitHub topic like `claude-code-hook`. */
  foundVia: CandidateSource;
  /** ISO date (YYYY-MM-DD) the script first found this repo. */
  discoveredAt: string;
  status: CandidateStatus;
}

export const candidateItems: CandidateItem[] = [];
