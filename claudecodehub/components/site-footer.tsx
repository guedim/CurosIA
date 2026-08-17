export function SiteFooter() {
  return (
    <footer className="relative">
      <div className="h-px bg-gradient-to-r from-bold-red via-bold-navy to-bold-blue" />
      <div className="mx-auto w-full max-w-6xl px-6 py-4 sm:px-10">
        <p className="text-sm text-muted">© {new Date().getFullYear()} ClaudeCodeHub</p>
      </div>
    </footer>
  );
}
