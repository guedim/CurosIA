"use client";

import { useState } from "react";
import { catalogItems, type ItemType } from "@/data/catalog";
import { ItemCard } from "@/components/item-card";

const tabs: { type: ItemType; label: string }[] = [
  { type: "hook", label: "Hooks" },
  { type: "plugin", label: "Plugins" },
];

export default function Home() {
  const [activeType, setActiveType] = useState<ItemType>("hook");
  const items = catalogItems.filter((item) => item.type === activeType);

  return (
    <div className="relative flex flex-1 flex-col items-center overflow-hidden bg-background font-sans">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#ff2947] via-[#121e6c] to-[#0407f5] opacity-30 blur-[120px]"
      />
      <main className="relative w-full max-w-6xl flex-1 px-6 py-16 sm:px-10">
        <header className="mb-12 flex flex-col gap-3 text-center sm:text-left">
          <h1 className="bg-gradient-to-r from-[#ff2947] via-[#7a2ea8] to-[#0407f5] bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
            HookHub
          </h1>
          <p className="text-lg text-muted">
            Discover open-source hooks and plugins for Claude Code.
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
              onClick={() => setActiveType(tab.type)}
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
