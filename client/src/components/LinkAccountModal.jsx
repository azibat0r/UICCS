import { useState } from 'react';

export default function LinkAccountModal({ onSaved, onCancel }) {
  const [method, setMethod] = useState('leetcode');
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [neetcodeGithubRepo, setNeetcodeGithubRepo] = useState('');
  const [error, setError] = useState('');

  async function handleSave() {
    setError('');

    if (method === 'leetcode' && !leetcodeUsername.trim()) {
      setError('Enter your LeetCode username.');
      return;
    }
    if (method === 'neetcode' && !neetcodeGithubRepo.trim()) {
      setError('Enter your GitHub repo (e.g. username/neetcode-submissions).');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/auth/link-practice-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          leetcodeUsername: method === 'leetcode' ? leetcodeUsername.trim() : undefined,
          neetcodeGithubRepo: method === 'neetcode' ? neetcodeGithubRepo.trim() : undefined,
        }),
      });

      if (!res.ok) {
        setError('Something went wrong. Try again.');
        return;
      }

      const updatedUser = await res.json();
      onSaved(updatedUser);
    } catch {
      setError('Something went wrong. Try again.');
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6">
      <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-2">Link your practice account</h2>
        <p className="text-sm text-(--color-text-muted) mb-4">
          So your group can see when you submit a problem. Pick whichever you use.
        </p>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMethod('leetcode')}
            className={`flex-1 rounded-md px-3 py-2 text-sm border transition ${
              method === 'leetcode'
                ? 'border-(--color-accent) bg-(--color-accent)/10'
                : 'border-(--color-border)'
            }`}
          >
            LeetCode
          </button>
          <button
            onClick={() => setMethod('neetcode')}
            className={`flex-1 rounded-md px-3 py-2 text-sm border transition ${
              method === 'neetcode'
                ? 'border-(--color-accent) bg-(--color-accent)/10'
                : 'border-(--color-border)'
            }`}
          >
            NeetCode
          </button>
        </div>

        {method === 'leetcode' ? (
          <input
            type="text"
            placeholder="Your LeetCode username"
            value={leetcodeUsername}
            onChange={(e) => setLeetcodeUsername(e.target.value)}
            className="w-full rounded-md border border-(--color-border) bg-(--color-bg) px-4 py-2 text-sm mb-3"
          />
        ) : (
          <div className="mb-3">
            <input
              type="text"
              placeholder="e.g. azibat0r/neetcode-submissions"
              value={neetcodeGithubRepo}
              onChange={(e) => setNeetcodeGithubRepo(e.target.value)}
              className="w-full rounded-md border border-(--color-border) bg-(--color-bg) px-4 py-2 text-sm"
            />
            <p className="text-xs text-(--color-text-muted) mt-1">
              Enable GitHub Sync at neetcode.io/profile/github, then paste the repo name it created.
            </p>
          </div>
        )}

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
            className="flex-1 rounded-md bg-(--color-accent) px-4 py-2 text-sm font-medium text-(--color-bg) hover:opacity-90 transition"
          >
            Save & Join
          </button>
        </div>
      </div>
    </div>
  );
}