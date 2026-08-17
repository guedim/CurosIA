import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto w-full max-w-6xl px-6 py-4 sm:px-10">
        <Link
          href="/"
          className="bg-gradient-to-r from-bold-red via-bold-navy to-bold-blue bg-clip-text text-lg font-semibold tracking-tight text-transparent"
        >
          ClaudeCodeHub
        </Link>
      </div>
    </header>
  );
}
