import type { Category, CatalogItem } from "@/data/catalog";

const categoryStyles: Record<Category, string> = {
  // hook categories
  security: "bg-bold-red/10 text-bold-red ring-1 ring-inset ring-bold-red/25",
  formatting: "bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-200",
  notifications: "bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200",
  logging: "bg-purple-100 text-purple-700 ring-1 ring-inset ring-purple-200",
  testing: "bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  automation: "bg-cyan-100 text-cyan-700 ring-1 ring-inset ring-cyan-200",
  workflow: "bg-pink-100 text-pink-700 ring-1 ring-inset ring-pink-200",
  // plugin (SDLC) categories
  planning: "bg-indigo-100 text-indigo-700 ring-1 ring-inset ring-indigo-200",
  coding: "bg-sky-100 text-sky-700 ring-1 ring-inset ring-sky-200",
  "code-review": "bg-fuchsia-100 text-fuchsia-700 ring-1 ring-inset ring-fuchsia-200",
  "ci-cd": "bg-orange-100 text-orange-700 ring-1 ring-inset ring-orange-200",
  deployment: "bg-teal-100 text-teal-700 ring-1 ring-inset ring-teal-200",
  monitoring: "bg-lime-100 text-lime-800 ring-1 ring-inset ring-lime-200",
  documentation: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200",
  // rag categories
  "code-retrieval": "bg-violet-100 text-violet-700 ring-1 ring-inset ring-violet-200",
  "vector-db": "bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-200",
  framework: "bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-200",
  ingestion: "bg-rose-100 text-rose-700 ring-1 ring-inset ring-rose-200",
  "embeddings-rerank": "bg-green-100 text-green-700 ring-1 ring-inset ring-green-200",
  evaluation: "bg-red-100 text-red-700 ring-1 ring-inset ring-red-200",
  memory: "bg-stone-100 text-stone-700 ring-1 ring-inset ring-stone-200",
  // agent categories
  architecture: "bg-purple-100 text-purple-700 ring-1 ring-inset ring-purple-200",
  "backend-python": "bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-200",
  "security-compliance": "bg-red-100 text-red-800 ring-1 ring-inset ring-red-200",
  "aws-serverless": "bg-orange-100 text-orange-800 ring-1 ring-inset ring-orange-200",
  "testing-qa": "bg-cyan-100 text-cyan-800 ring-1 ring-inset ring-cyan-200",
  "data-persistence": "bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200",
  "devops-cicd": "bg-teal-100 text-teal-800 ring-1 ring-inset ring-teal-200",
};

function formatStars(stars: number): string {
  if (stars >= 1000) return `${(stars / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(stars);
}

export function ItemCard({ item }: { item: CatalogItem }) {
  const isGitHub = item.repoUrl.includes("github.com");

  return (
    <article className="group flex flex-col gap-3 rounded-[20px] border border-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-transparent hover:bg-white hover:shadow-[0_0_0_1px_rgba(255,41,71,0.25),0_12px_30px_-12px_rgba(18,30,108,0.25)]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${categoryStyles[item.category]}`}
        >
          {item.category}
        </span>
      </div>
      {(item.official || typeof item.stars === "number") && (
        <div className="flex items-center gap-2 text-xs text-muted">
          {item.official && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
              ✓ Official
            </span>
          )}
          {typeof item.stars === "number" && (
            <span className="inline-flex items-center gap-1">
              ★ {formatStars(item.stars)}
            </span>
          )}
        </div>
      )}
      <p className="flex-1 text-sm leading-6 text-muted">{item.description}</p>
      {item.stackTags && item.stackTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.stackTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-muted ring-1 ring-inset ring-border"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <a
        href={item.repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold text-bold-red transition-colors hover:text-bold-navy"
      >
        {isGitHub ? `View ${item.name} on GitHub →` : `Visit ${item.name} →`}
      </a>
    </article>
  );
}
