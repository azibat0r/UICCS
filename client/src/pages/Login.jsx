import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/useUser.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data === 'not found' || data === 'pass not ok') {
        setError('Invalid email or password.');
        return;
      }

      setUser(data);
      navigate('/');
    } catch {
      setError('Something went wrong. Try again.');
    }
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm"
          required
        />
        {error && <p className="text-(--color-accent) text-sm">{error}</p>}
        <button
          type="submit"
          className="rounded-md bg-(--color-accent) px-4 py-2 text-sm font-medium text-(--color-bg) hover:opacity-90 transition"
        >
          Log In
        </button>
      </form>
      <p className="mt-4 text-sm text-(--color-text-muted)">
        Don't have an account?{' '}
        <Link to="/signup" className="text-(--color-accent) hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}