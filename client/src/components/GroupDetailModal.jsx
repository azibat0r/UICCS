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

export default function GroupDetailModal({ group, onClose, onLeave, onViewActivity }) {
  if (!group) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6"
      onClick={onClose}
    >
      <div
        className="bg-(--color-surface) border border-(--color-border) rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">{group.focus}</h2>
            <p className="text-xs text-(--color-text-muted) mt-1">
              Created by {group.createdBy?.name || 'Unknown'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-(--color-text-muted) hover:text-(--color-text) transition text-xl leading-none"
          >
            ×
          </button>
        </div>

        {group.description && (
          <p className="mt-4 text-sm text-(--color-text-muted)">{group.description}</p>
        )}

        <div className="mt-4 flex items-center gap-3 text-xs text-(--color-text-muted)">
          <span>{group.format}</span>
          <span>·</span>
          <span>{group.frequency}</span>
          <span>·</span>
          <span>{group.askToJoin ? 'Approval required' : 'Open to join'}</span>
          <span>·</span>
          <span>{group.members?.length || 0}/{group.memberCap} members</span>
        </div>

        <div className="mt-6 border-t border-(--color-border) pt-4">
          <p className="text-sm font-medium mb-3">Today's activity</p>
          <div className="flex flex-col gap-2">
            {group.members?.map((member) => {
              const done = submittedToday(member.user?.lastKnownSubmissionAt);
              return (
                <div key={member.user?._id} className="flex items-center justify-between text-sm">
                  <span>{member.user?.name}</span>
                  <span className="flex items-center gap-2">
                    <span
                      className={`inline-flex h-3 w-3 rounded-full border ${
                        done ? 'bg-green-500 border-green-400' : 'bg-red-500 border-red-400'
                      }`}
                    />
                    <span className="text-xs text-(--color-text-muted)">
                      {done ? 'Submitted today' : 'Not yet'}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={onViewActivity}
          className="mt-6 w-full rounded-md bg-(--color-accent) px-4 py-2 text-sm font-medium text-(--color-bg) hover:opacity-90 transition"
        >
          View Activity
        </button>

        <button
          onClick={() => {
            onLeave(group._id);
            onClose();
          }}
          className="mt-3 w-full rounded-md border border-(--color-border) px-4 py-2 text-sm text-(--color-text-muted) hover:border-(--color-accent) hover:text-(--color-accent) transition"
        >
          Leave Group
        </button>
      </div>
    </div>
  );
}