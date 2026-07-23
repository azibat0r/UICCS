import { useEffect, useState } from 'react';

function timeAgo(dateStr) {
  if (!dateStr) return 'never';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

export default function SyncBadge() {
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/jobs/sync-status')
      .then((res) => res.json())
      .then((data) => setLastSyncedAt(data.lastSyncedAt))
      .catch(() => {});
  }, []);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-(--color-border) bg-(--color-surface) px-3 py-1.5 text-xs text-(--color-text-muted)">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--color-accent) opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-(--color-accent)" />
      </span>
      <span>Synced {timeAgo(lastSyncedAt)}</span>
      <span className="text-(--color-border)">·</span>
      <span>pulled live from GitHub</span>
    </div>
  );
}