import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/useUser.js';
import { API_URL } from '../config.js';

export default function Navbar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
    setMenuOpen(false);
    navigate('/');
  }

  const navLinks = (
    <>
      <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-(--color-text) transition">Home</Link>
      <Link to="/feed" onClick={() => setMenuOpen(false)} className="hover:text-(--color-text) transition">Internship Feed</Link>
      <Link to="/groups" onClick={() => setMenuOpen(false)} className="hover:text-(--color-text) transition">Study Groups</Link>
      <Link to="/contact" onClick={() => setMenuOpen(false)} className="hover:text-(--color-text) transition">Contact</Link>
    </>
  );

  const authLinks = user ? (
    <>
      <Link
        to="/profile"
        onClick={() => setMenuOpen(false)}
        className="rounded-md border border-(--color-border) px-3 py-1.5 text-center hover:border-(--color-accent) transition"
      >
        {user.name}
      </Link>
      <button
        onClick={handleLogout}
        className="rounded-md border border-(--color-border) px-3 py-1.5 hover:border-(--color-accent) transition"
      >
        Log Out
      </button>
    </>
  ) : (
    <>
      <Link to="/login" onClick={() => setMenuOpen(false)} className="hover:text-(--color-text) transition">Login</Link>
      <Link
        to="/signup"
        onClick={() => setMenuOpen(false)}
        className="rounded-md bg-(--color-accent) px-3 py-1.5 text-center text-(--color-bg) hover:opacity-90 transition"
      >
        Sign Up
      </Link>
    </>
  );

  return (
    <header className="border-b border-(--color-border)">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
        {/* Desktop: everything in one row */}
        <div className="hidden sm:flex items-center gap-8 text-sm text-(--color-text-muted)">
          {navLinks}
        </div>
        <div className="hidden sm:flex items-center gap-3 text-sm">
          {authLinks}
        </div>

        {/* Mobile: hamburger toggle */}
        <span className="sm:hidden font-bold text-lg">UICCS</span>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="sm:hidden text-(--color-text) text-2xl leading-none"
          aria-label="Toggle menu"
        >
          {menuOpen ? '×' : '☰'}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="sm:hidden flex flex-col gap-3 border-t border-(--color-border) px-4 py-4 text-sm text-(--color-text-muted)">
          {navLinks}
          <div className="flex flex-col gap-2 border-t border-(--color-border) pt-3 mt-1">
            {authLinks}
          </div>
        </div>
      )}
    </header>
  );
}