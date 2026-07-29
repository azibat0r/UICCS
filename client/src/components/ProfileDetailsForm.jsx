import { useState } from 'react';
import { useUser } from '../context/useUser.js';
import { API_URL } from '../config.js';

export default function ProfileDetailsForm() {
  const { user, setUser } = useUser();
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || '');
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || '');
  const [personalWebsite, setPersonalWebsite] = useState(user?.personalWebsite || '');
  const [companies, setCompanies] = useState((user?.companies || []).join(', '));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    setError('');
    setSaved(false);
    setSaving(true);

    const res = await fetch(`${API_URL}/api/auth/update-profile-details`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        linkedinUrl: linkedinUrl.trim(),
        githubUrl: githubUrl.trim(),
        personalWebsite: personalWebsite.trim(),
        companies: companies.trim()
          ? companies.split(',').map((c) => c.trim()).filter(Boolean)
          : [],
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || 'Something went wrong.');
      return;
    }

    setUser(data);
    setSaved(true);
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="text-sm text-(--color-text-muted)">LinkedIn URL</label>
        <input
          type="text"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
          className="mt-1 w-full rounded-md border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm text-(--color-text-muted)">GitHub URL</label>
        <input
          type="text"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          className="mt-1 w-full rounded-md border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm text-(--color-text-muted)">Personal Website</label>
        <input
          type="text"
          value={personalWebsite}
          onChange={(e) => setPersonalWebsite(e.target.value)}
          className="mt-1 w-full rounded-md border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm text-(--color-text-muted)">
          Companies (previously interned at or currently work at)
        </label>
        <input
          type="text"
          placeholder="Comma separated, e.g. Google, Meta"
          value={companies}
          onChange={(e) => setCompanies(e.target.value)}
          className="mt-1 w-full rounded-md border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm"
        />
      </div>

      {error && <p className="text-(--color-accent) text-sm">{error}</p>}
      {saved && <p className="text-sm text-(--color-text-muted)">Saved.</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="self-start rounded-md bg-(--color-accent) px-4 py-2 text-sm font-medium text-(--color-bg) hover:opacity-90 transition disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}