export default function Navbar() {
  return (
    <header className="border-b border-(--color-border)">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="font-bold text-lg">
          <span className="text-(--color-accent) italic">L</span>anded
        </span>
        <div className="hidden sm:flex items-center gap-8 text-sm text-(--color-text-muted)">
          <a href="#feed" className="hover:text-(--color-text) transition">Internship Feed</a>
          <a href="#about" className="hover:text-(--color-text) transition">About</a>
        </div>
        <a href="#feed" className="rounded-full bg-(--color-accent) px-4 py-2 text-sm font-medium text-(--color-bg) hover:opacity-90 transition">
          Browse roles
        </a>
      </nav>
    </header>
  );
}