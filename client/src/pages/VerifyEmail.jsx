import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config.js';

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromSignup = location.state?.email || '';

  const [email, setEmail] = useState(emailFromSignup);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  async function handleVerify(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/verify-email-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      setSubmitting(false);

      if (!res.ok) {
        setError(data.error || 'Verification failed.');
        return;
      }

      navigate('/login');
    } catch {
      setSubmitting(false);
      setError('Something went wrong. Try again.');
    }
  }

  async function handleResend() {
    setResendMessage('');
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/resend-verification-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Could not resend code.');
        return;
      }

      setResendMessage(data.alreadyVerified ? 'This account is already verified.' : 'A new code has been sent.');
    } catch {
      setError('Something went wrong. Try again.');
    }
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="text-2xl font-bold mb-2">Verify your email</h1>
      <p className="text-(--color-text-muted) text-sm mb-6">
        Enter the 6-digit code we sent to your email.
      </p>

      <form onSubmit={handleVerify} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm"
          required
        />
        <input
          type="text"
          placeholder="6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          className="rounded-md border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm tracking-widest text-center"
          required
        />

        {error && <p className="text-(--color-accent) text-sm">{error}</p>}
        {resendMessage && <p className="text-(--color-text-muted) text-sm">{resendMessage}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-(--color-accent) px-4 py-2 text-sm font-medium text-(--color-bg) hover:opacity-90 transition disabled:opacity-50"
        >
          {submitting ? 'Verifying...' : 'Verify'}
        </button>
      </form>

      <button
        onClick={handleResend}
        className="mt-4 text-sm text-(--color-accent) hover:underline"
      >
        Resend code
      </button>

      <p className="mt-6 text-sm text-(--color-text-muted)">
        Already verified?{' '}
        <Link to="/login" className="text-(--color-accent) hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}