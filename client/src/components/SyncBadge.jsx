export default function SyncBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-(--color-border) bg-(--color-surface) px-3 py-1.5 text-xs text-(--color-text-muted)">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--color-accent) opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-(--color-accent)" />
      </span>
      <span>Synced 2m ago</span>
      <span className="text-(--color-border)">·</span>
      <span>pulled live from GitHub</span>
    </div>
  );
}