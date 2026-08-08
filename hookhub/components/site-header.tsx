import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-[#07060f]/80 backdrop-blur-md">
      <div className="mx-auto w-full max-w-6xl px-6 py-4 sm:px-10">
        <Link
          href="/"
          className="bg-gradient-to-r from-[#ff2947] via-[#7a2ea8] to-[#0407f5] bg-clip-text text-lg font-extrabold tracking-tight text-transparent"
        >
          ClaudeCodeHub
        </Link>
      </div>
    </header>
  );
}
