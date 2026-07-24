import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });

      if (res.status === 422) {
        setError('That email is already registered.');
        return;
      }

      navigate('/login');
    } catch {
      setError('Something went wrong. Try again.');
    }
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-md border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm"
          required
        />
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
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-sm text-(--color-text-muted)">
        Already have an account?{' '}
        <Link to="/login" className="text-(--color-accent) hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}