"use client";

import { useState } from "react";
import { catalogItems, stackTags, type ItemType, type StackTag } from "@/data/catalog";
import { ItemCard } from "@/components/item-card";

const tabs: { type: ItemType; label: string }[] = [
  { type: "hook", label: "Hooks" },
  { type: "plugin", label: "Plugins" },
  { type: "rag", label: "RAG" },
];

export default function Home() {
  const [activeType, setActiveType] = useState<ItemType>("hook");
  const [activeTags, setActiveTags] = useState<StackTag[]>([]);

  const itemsOfActiveType = catalogItems.filter((item) => item.type === activeType);

  const availableTags = stackTags.filter((tag) =>
    itemsOfActiveType.some((item) => item.stackTags?.includes(tag)),
  );

  const items = itemsOfActiveType.filter((item) => {
    if (activeTags.length === 0) return true;
    return item.stackTags?.some((tag) => activeTags.includes(tag)) ?? false;
  });

  function selectType(type: ItemType) {
    setActiveType(type);
    setActiveTags([]);
  }

  function toggleTag(tag: StackTag) {
    setActiveTags((current) =>
      current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag],
    );
  }

  return (
    <div className="relative flex flex-1 flex-col items-center overflow-hidden bg-background font-sans">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#ff2947] via-[#121e6c] to-[#0407f5] opacity-30 blur-[120px]"
      />
      <main className="relative w-full max-w-6xl flex-1 px-6 py-16 sm:px-10">
        <header className="mb-12 flex flex-col gap-3 text-center sm:text-left">
          <h1 className="bg-gradient-to-r from-[#ff2947] via-[#7a2ea8] to-[#0407f5] bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
            ClaudeCodeHub
          </h1>
          <p className="text-lg text-muted">
            Discover open-source hooks, plugins, and RAG tools for Claude Code.
          </p>
        </header>

        <div
          role="tablist"
          aria-label="Catalog type"
          className="mb-8 flex w-fit gap-1 rounded-full border border-white/10 bg-white/[.04] p-1"
        >
          {tabs.map((tab) => (
            <button
              key={tab.type}
              type="button"
              role="tab"
              aria-selected={activeType === tab.type}
              onClick={() => selectType(tab.type)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                activeType === tab.type
                  ? "bg-gradient-to-r from-[#ff2947] via-[#7a2ea8] to-[#0407f5] text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {availableTags.length > 0 && (
          <div
            role="group"
            aria-label="Filter by stack"
            className="mb-8 flex flex-wrap gap-2"
          >
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                aria-pressed={activeTags.includes(tag)}
                onClick={() => toggleTag(tag)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  activeTags.includes(tag)
                    ? "bg-[#ff2947]/20 text-[#ff6b82] ring-1 ring-inset ring-[#ff2947]/50"
                    : "bg-white/[.04] text-muted ring-1 ring-inset ring-white/10 hover:text-foreground"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {items.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ItemCard key={item.repoUrl + item.name} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-muted">No entries yet — check back soon.</p>
        )}
      </main>
    </div>
  );
}
