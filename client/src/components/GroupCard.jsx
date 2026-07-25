export default function GroupCard({ group, onJoin, onOpen, isMember }) {
  return (
    <div
      onClick={isMember ? () => onOpen(group) : undefined}
      className={`rounded-xl border border-(--color-border) bg-(--color-surface) p-5 ${
        isMember ? 'cursor-pointer hover:border-(--color-accent) transition' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-lg">{group.focus}</h3>
          <p className="text-xs text-(--color-text-muted) mt-1">
            Created by {group.createdBy?.name || 'Unknown'}
          </p>
        </div>
        <span className="text-xs rounded-full border border-(--color-border) px-2 py-1 text-(--color-text-muted)">
          {group.members?.length || 0}/{group.memberCap}
        </span>
      </div>

      {group.description && (
        <p className="mt-3 text-sm text-(--color-text-muted)">{group.description}</p>
      )}

      <div className="mt-4 flex items-center gap-3 text-xs text-(--color-text-muted)">
        <span>{group.format}</span>
        <span>·</span>
        <span>{group.frequency}</span>
        <span>·</span>
        <span>{group.askToJoin ? 'Approval required' : 'Open to join'}</span>
      </div>

      {onJoin && !isMember && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onJoin(group._id);
          }}
          className="mt-4 w-full rounded-md bg-(--color-accent) px-4 py-2 text-sm font-medium text-(--color-bg) hover:opacity-90 transition"
        >
          Join Group
        </button>
      )}

      {isMember && (
        <p className="mt-4 text-sm text-(--color-accent)">You're in this group · Click to view</p>
      )}
    </div>
  );
}