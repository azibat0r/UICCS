import { useState } from 'react';

export default function LinkAccountModal({ platform, onSaved, onCancel }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setError('');
    if (!value.trim()) {
      setError(
        platform === 'leetcode'
          ? 'Enter your LeetCode username.'
          : 'Enter your GitHub repo (e.g. username/neetcode-submissions).'
      );
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('http://localhost:4000/api/auth/link-practice-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ platform, value: value.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Try again.');
        setSaving(false);
        return;
      }

      onSaved(data);
    } catch {
      setError('Something went wrong. Try again.');
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6">
      <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-2">
          Link your {platform === 'leetcode' ? 'LeetCode' : 'NeetCode'} account
        </h2>
        <p className="text-sm text-(--color-text-muted) mb-4">
          {platform === 'leetcode'
            ? "We'll verify this is a real LeetCode username before saving."
            : "Enable GitHub Sync at neetcode.io/profile/github first, then paste the repo it creates."}
        </p>

        <input
          type="text"
          placeholder={
            platform === 'leetcode' ? 'Your LeetCode username' : 'e.g. azibat0r/neetcode-submissions'
          }
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-md border border-(--color-border) bg-(--color-bg) px-4 py-2 text-sm mb-3"
        />

        {error && <p className="text-(--color-accent) text-sm mb-3">{error}</p>}

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-md border border-(--color-border) px-4 py-2 text-sm hover:border-(--color-accent) transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 rounded-md bg-(--color-accent) px-4 py-2 text-sm font-medium text-(--color-bg) hover:opacity-90 transition disabled:opacity-50"
          >
            {saving ? 'Checking...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}