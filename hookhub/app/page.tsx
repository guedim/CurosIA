import { hooks } from "@/data/hooks";
import { HookCard } from "@/components/hook-card";

export default function Home() {
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
            Discover open-source hooks for Claude Code.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hooks.map((hook) => (
            <HookCard key={hook.repoUrl + hook.name} hook={hook} />
          ))}
        </div>
      </main>
    </div>
  );
}
