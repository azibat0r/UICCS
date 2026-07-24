function submittedToday(dateStr) {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export default function GroupCard({ group, onJoin, onLeave, isMember }) {
  return (
    <div className="rounded-xl border border-(--color-border) bg-(--color-surface) p-5">
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

      {isMember && group.members?.length > 0 && (
        <div className="mt-4 border-t border-(--color-border) pt-3">
          <p className="text-xs text-(--color-text-muted) mb-2">Today's activity</p>
          <div className="flex flex-col gap-1.5">
            {group.members.map((member) => {
              const done = submittedToday(member.lastKnownSubmissionAt);
              return (
                <div key={member._id} className="flex items-center justify-between text-sm">
                  <span>{member.name}</span>
                  <span
                    className={`inline-flex h-3 w-3 rounded-full border ${
                      done ? 'bg-green-500 border-green-400' : 'bg-red-500 border-red-400'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {onJoin && !isMember && (
        <button
          onClick={() => onJoin(group._id)}
          className="mt-4 w-full rounded-md bg-(--color-accent) px-4 py-2 text-sm font-medium text-(--color-bg) hover:opacity-90 transition"
        >
          Join Group
        </button>
      )}

      {isMember && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-(--color-accent)">You're in this group</p>
          {onLeave && (
            <button
              onClick={() => onLeave(group._id)}
              className="text-xs text-(--color-text-muted) hover:text-(--color-accent) transition underline"
            >
              Leave
            </button>
          )}
        </div>
      )}
    </div>
  );
}