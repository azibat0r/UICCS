import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/useUser.js';

export default function Navbar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  async function handleLogout() {
    await fetch('http://localhost:4000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
    navigate('/');
  }

  return (
    <header className="border-b border-(--color-border)">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-8 text-sm text-(--color-text-muted)">
          <Link to="/" className="hover:text-(--color-text) transition">Home</Link>
          <Link to="/feed" className="hover:text-(--color-text) transition">Internship Feed</Link>
          <Link to="/groups" className="hover:text-(--color-text) transition">Study Groups</Link>
          <Link to="/contact" className="hover:text-(--color-text) transition">Contact</Link>
        </div>

        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <span className="text-(--color-text-muted)">{user.name}</span>
              <button
                onClick={handleLogout}
                className="rounded-md border border-(--color-border) px-3 py-1.5 hover:border-(--color-accent) transition"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-(--color-text) transition">Login</Link>
              <Link to="/signup" className="rounded-md bg-(--color-accent) px-3 py-1.5 text-(--color-bg) hover:opacity-90 transition">Sign Up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}