import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config.js';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [personalWebsite, setPersonalWebsite] = useState('');
  const [companies, setCompanies] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          email,
          password,
          linkedinUrl: linkedinUrl.trim() || undefined,
          githubUrl: githubUrl.trim() || undefined,
          personalWebsite: personalWebsite.trim() || undefined,
          companies: companies.trim()
            ? companies.split(',').map((c) => c.trim()).filter(Boolean)
            : [],
        }),
      });

      if (res.status === 422) {
        setError('That email is already registered.');
        return;
      }

      navigate('/verify-email', { state: { email } });
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="rounded-md border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm"
          required
        />

        <div className="border-t border-(--color-border) pt-4 mt-1">
          <p className="text-xs text-(--color-text-muted) mb-3">Optional</p>

          <input
            type="text"
            placeholder="LinkedIn URL"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            className="mb-3 w-full rounded-md border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="GitHub URL"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="mb-3 w-full rounded-md border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Personal Website"
            value={personalWebsite}
            onChange={(e) => setPersonalWebsite(e.target.value)}
            className="mb-3 w-full rounded-md border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Companies (comma separated)"
            value={companies}
            onChange={(e) => setCompanies(e.target.value)}
            className="w-full rounded-md border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm"
          />
        </div>

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