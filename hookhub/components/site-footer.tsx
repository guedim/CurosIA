export function SiteFooter() {
  return (
    <footer className="relative">
      <div className="h-px bg-gradient-to-r from-[#ff2947] via-[#121e6c] to-[#0407f5]" />
      <div className="mx-auto w-full max-w-6xl px-6 py-4 sm:px-10">
        <p className="text-sm text-muted">© {new Date().getFullYear()} HookPlugHub</p>
      </div>
    </footer>
  );
}
