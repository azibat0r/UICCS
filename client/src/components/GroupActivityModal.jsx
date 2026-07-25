import { useEffect, useState } from 'react';
import { useUser } from '../context/useUser.js';
import { getUserColor } from '../utils/userColors.js';
import WeekStrip from './WeekStrip.jsx';
import TimelineModal from './TimelineModal.jsx';

function formatDateTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function GroupActivityModal({ group, onClose }) {
  const { user } = useUser();
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTimeline, setShowTimeline] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:4000/api/submissions/group/${group._id}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then(setFeed)
      .finally(() => setLoading(false));
  }, [group._id]);

  const myFeed = feed.filter((s) => s.user?._id === user?._id);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6"
      onClick={onClose}
    >
      <div
        className="bg-(--color-surface) border border-(--color-border) rounded-xl p-6 max-w-lg w-full max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <h2 className="text-xl font-bold">{group.focus}</h2>
          <button
            onClick={onClose}
            className="text-(--color-text-muted) hover:text-(--color-text) transition text-xl leading-none"
          >
            ×
          </button>
        </div>

        <WeekStrip submissions={myFeed} onOpenTimeline={() => setShowTimeline(true)} />

        <div className="mt-6 flex-1 overflow-y-auto flex flex-col gap-3">
          {loading && <p className="text-(--color-text-muted) text-sm">Loading activity...</p>}

          {!loading && feed.length === 0 && (
            <p className="text-(--color-text-muted) text-sm">No submissions yet.</p>
          )}

          {feed.map((sub) => {
            const isMine = sub.user?._id === user?._id;
            const color = isMine
              ? { bg: 'bg-blue-500/20', border: 'border-blue-500/50' }
              : getUserColor(sub.user?._id);

            return (
              <div
                key={sub._id}
                className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
              >
                <p className="text-xs text-(--color-text-muted)">
                  {!isMine && `${sub.user?.name} · `}
                  {formatDateTime(sub.timestamp)}
                </p>
                <div
                  className={`mt-1 rounded-2xl px-4 py-2 text-sm max-w-[80%] border ${color.bg} ${color.border}`}
                >
                  Solved: {sub.problemName || 'a problem'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showTimeline && (
        <TimelineModal submissions={myFeed} onClose={() => setShowTimeline(false)} />
      )}
    </div>
  );
}