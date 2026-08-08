import type { Category, CatalogItem } from "@/data/catalog";

const categoryStyles: Record<Category, string> = {
  // hook categories
  security: "bg-[#ff2947]/15 text-[#ff6b82] ring-1 ring-inset ring-[#ff2947]/30",
  formatting: "bg-[#0407f5]/15 text-[#7d80ff] ring-1 ring-inset ring-[#0407f5]/30",
  notifications: "bg-amber-500/15 text-amber-300 ring-1 ring-inset ring-amber-500/30",
  logging: "bg-[#7a2ea8]/15 text-purple-300 ring-1 ring-inset ring-[#7a2ea8]/30",
  testing: "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30",
  automation: "bg-cyan-500/15 text-cyan-300 ring-1 ring-inset ring-cyan-500/30",
  workflow: "bg-pink-500/15 text-pink-300 ring-1 ring-inset ring-pink-500/30",
  // plugin (SDLC) categories
  planning: "bg-indigo-500/15 text-indigo-300 ring-1 ring-inset ring-indigo-500/30",
  coding: "bg-sky-500/15 text-sky-300 ring-1 ring-inset ring-sky-500/30",
  "code-review": "bg-fuchsia-500/15 text-fuchsia-300 ring-1 ring-inset ring-fuchsia-500/30",
  "ci-cd": "bg-orange-500/15 text-orange-300 ring-1 ring-inset ring-orange-500/30",
  deployment: "bg-teal-500/15 text-teal-300 ring-1 ring-inset ring-teal-500/30",
  monitoring: "bg-lime-500/15 text-lime-300 ring-1 ring-inset ring-lime-500/30",
  documentation: "bg-slate-500/15 text-slate-300 ring-1 ring-inset ring-slate-500/30",
};

export function ItemCard({ item }: { item: CatalogItem }) {
  return (
    <article className="group flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[.04] p-5 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-transparent hover:bg-white/[.06] hover:shadow-[0_0_0_1px_rgba(255,41,71,0.4),0_8px_30px_-8px_rgba(4,7,245,0.5)]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${categoryStyles[item.category]}`}
        >
          {item.category}
        </span>
      </div>
      <p className="flex-1 text-sm leading-6 text-muted">{item.description}</p>
      <a
        href={item.repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold text-[#ff6b82] transition-colors hover:text-[#ff2947]"
      >
        View {item.name} on GitHub →
      </a>
    </article>
  );
}
