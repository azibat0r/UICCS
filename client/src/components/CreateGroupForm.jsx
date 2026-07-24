import { useState } from 'react';

export default function CreateGroupForm({ onCreated }) {
  const [focus, setFocus] = useState('');
  const [description, setDescription] = useState('');
  const [format, setFormat] = useState('Remote');
  const [frequency, setFrequency] = useState('Daily');
  const [askToJoin, setAskToJoin] = useState(false);
  const [memberCap, setMemberCap] = useState(20);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:4000/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ focus, description, format, frequency, askToJoin, memberCap }),
      });

      if (!res.ok) {
        setError('You must be logged in to create a group.');
        return;
      }

      setFocus('');
      setDescription('');
      onCreated();
    } catch {
      setError('Something went wrong. Try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      <div>
        <label className="text-sm text-(--color-text-muted)">Focus *</label>
        <input
          type="text"
          placeholder="e.g. Daily LeetCode Grind, Blind 75, System Design Prep"
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
          className="mt-1 w-full rounded-md border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm"
          required
        />
      </div>

      <div>
        <label className="text-sm text-(--color-text-muted)">What will you be working on?</label>
        <textarea
          placeholder="e.g. Working through NeetCode 150, arrays & strings this week"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm text-(--color-text-muted)">Format *</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="mt-1 w-full rounded-md border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm"
          >
            <option>Remote</option>
            <option>In Person</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="text-sm text-(--color-text-muted)">Frequency *</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="mt-1 w-full rounded-md border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm"
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Biweekly</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm text-(--color-text-muted)">Ask to Join</label>
          <select
            value={askToJoin}
            onChange={(e) => setAskToJoin(e.target.value === 'true')}
            className="mt-1 w-full rounded-md border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm"
          >
            <option value="false">No - open to anyone</option>
            <option value="true">Yes - approval required</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="text-sm text-(--color-text-muted)">Member Cap</label>
          <input
            type="number"
            value={memberCap}
            onChange={(e) => setMemberCap(Number(e.target.value))}
            min={2}
            max={100}
            className="mt-1 w-full rounded-md border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm"
          />
        </div>
      </div>

      {error && <p className="text-(--color-accent) text-sm">{error}</p>}

      <button
        type="submit"
        className="rounded-md bg-(--color-accent) px-4 py-2 text-sm font-medium text-(--color-bg) hover:opacity-90 transition"
      >
        Create Group
      </button>
    </form>
  );
}