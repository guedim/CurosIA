import { hooks } from "@/data/hooks";
import { HookCard } from "@/components/hook-card";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-6xl flex-1 px-6 py-16 sm:px-10">
        <header className="mb-12 flex flex-col gap-2 text-center sm:text-left">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            HookHub
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
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
