import { catalogItems, stackTags, type ItemType } from "@/data/catalog";
import { ItemCard } from "@/components/item-card";
import { CatalogBrowser } from "@/components/catalog-browser";

const tabs: { type: ItemType; label: string }[] = [
  { type: "hook", label: "Hooks" },
  { type: "plugin", label: "Plugins" },
  { type: "rag", label: "RAG" },
  { type: "agent", label: "Agentes" },
  { type: "workflow", label: "Workflows" },
  { type: "command", label: "Commands" },
];

export default function Home() {
  // Lightweight filtering metadata only — the actual item content (name,
  // description, stackTags, etc.) is rendered server-side below and passed
  // as children, so it never enters the client bundle.
  const items = catalogItems.map((item) => ({
    id: `${item.repoUrl}#${item.name}`,
    type: item.type,
    tags: item.stackTags ?? [],
  }));

  return (
    <div className="relative flex flex-1 flex-col items-center overflow-hidden bg-background font-sans">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-r from-bold-red via-bold-navy to-bold-blue opacity-[0.12] blur-[120px]"
      />
      <main className="relative w-full max-w-6xl flex-1 px-6 py-16 sm:px-10">
        <header className="mb-12 flex flex-col gap-3 text-center sm:text-left">
          <h1 className="text-4xl font-medium tracking-tight text-bold-navy sm:text-5xl dark:text-foreground">
            ClaudeCodeHub
          </h1>
          <p className="text-lg text-muted">
            Discover open-source hooks, plugins, RAG, agents, workflows, commands, and more tools for Claude Code.
          </p>
        </header>

        <CatalogBrowser tabs={tabs} stackTags={stackTags} items={items}>
          {catalogItems.map((item) => (
            <ItemCard key={`${item.repoUrl}#${item.name}`} item={item} />
          ))}
        </CatalogBrowser>
      </main>
    </div>
  );
}
