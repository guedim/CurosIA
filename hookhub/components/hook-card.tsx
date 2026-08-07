import type { Hook, HookCategory } from "@/data/hooks";

const categoryStyles: Record<HookCategory, string> = {
  security:
    "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  formatting:
    "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  notifications:
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  logging:
    "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
  testing:
    "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  automation:
    "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300",
  workflow:
    "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300",
};

export function HookCard({ hook }: { hook: Hook }) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-black/[.08] bg-white p-5 shadow-sm transition-colors hover:border-black/[.16] dark:border-white/[.12] dark:bg-zinc-900 dark:hover:border-white/[.2]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          {hook.name}
        </h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${categoryStyles[hook.category]}`}
        >
          {hook.category}
        </span>
      </div>
      <p className="flex-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {hook.description}
      </p>
      <a
        href={hook.repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-zinc-950 hover:underline dark:text-zinc-50"
      >
        View {hook.name} on GitHub →
      </a>
    </article>
  );
}
