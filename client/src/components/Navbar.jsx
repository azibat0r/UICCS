import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="border-b border-(--color-border)">
      <nav className="mx-auto flex max-w-6xl items-center justify-end px-6 py-5">
        <div className="flex items-center gap-8 text-sm text-(--color-text-muted)">
          <Link to="/" className="hover:text-(--color-text) transition">Home</Link>
          <Link to="/feed" className="hover:text-(--color-text) transition">Internship Feed</Link>
          <Link to="/contact" className="hover:text-(--color-text) transition">Contact</Link>
        </div>
      </nav>
    </header>
  );
}