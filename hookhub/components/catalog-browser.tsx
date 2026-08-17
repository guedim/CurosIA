"use client";

import { Children, useState, type ReactNode } from "react";
import type { ItemType, StackTag } from "@/data/catalog";

interface ItemMeta {
  id: string;
  type: ItemType;
  tags: StackTag[];
}

interface Tab {
  type: ItemType;
  label: string;
}

export function CatalogBrowser({
  tabs,
  stackTags,
  items,
  children,
}: {
  tabs: Tab[];
  stackTags: StackTag[];
  items: ItemMeta[];
  children: ReactNode;
}) {
  const [activeType, setActiveType] = useState<ItemType>(tabs[0]?.type ?? "hook");
  const [activeTags, setActiveTags] = useState<StackTag[]>([]);

  const itemsOfActiveType = items.filter((item) => item.type === activeType);

  const availableTags = stackTags.filter((tag) =>
    itemsOfActiveType.some((item) => item.tags.includes(tag)),
  );

  const visibleIds = new Set(
    itemsOfActiveType
      .filter(
        (item) =>
          activeTags.length === 0 || item.tags.some((tag) => activeTags.includes(tag)),
      )
      .map((item) => item.id),
  );

  function selectType(type: ItemType) {
    setActiveType(type);
    setActiveTags([]);
  }

  function toggleTag(tag: StackTag) {
    setActiveTags((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
    );
  }

  // `children` are pre-rendered Server Component markup for every catalog
  // item, in the same order as `items`. Every card stays mounted in the DOM
  // at all times — filtering only toggles a `hidden` class — so the full
  // catalog remains present in the static/prerendered HTML (crawlable, and
  // visible with JS disabled) while the item data itself never enters the
  // client bundle.
  const wrappedNodes = Children.toArray(children).map((child, index) => {
    const id = items[index]?.id ?? String(index);
    const isVisible = visibleIds.has(id);
    return (
      <div key={id} className={isVisible ? undefined : "hidden"}>
        {child}
      </div>
    );
  });

  return (
    <>
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {wrappedNodes}
      </div>
      {visibleIds.size === 0 && (
        <p className="text-muted">No entries yet — check back soon.</p>
      )}
    </>
  );
}
