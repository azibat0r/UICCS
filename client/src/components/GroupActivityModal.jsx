import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/useUser.js';
import WeekStrip from './WeekStrip.jsx';
import TimelineModal from './TimelineModal.jsx';
import { API_URL } from '../config.js';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

function formatDateTime(dateStr) {
  const d = new Date(dateStr);
  const time = d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit' });

  if (Date.now() - d < SEVEN_DAYS_MS) {
    const weekday = d.toLocaleString('en-US', { weekday: 'long' });
    return `${weekday}, ${time}`;
  }

  const date = d.toLocaleString('en-US', { month: 'short', day: 'numeric' });
  return `${date}, ${time}`;
}

function formatProblemName(rawName) {
  if (!rawName) return 'a problem';
  return rawName
    .replace(/^Add:\s*/i, '')
    .replace(/\s*-\s*submission-\d+$/i, '')
    .trim();
}

export default function GroupActivityModal({ group, onClose }) {
  const { user } = useUser();
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTimeline, setShowTimeline] = useState(false);
  const feedContainerRef = useRef(null);

  useEffect(() => {
    fetch(`${API_URL}/api/submissions/group/${group._id}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then(setFeed)
      .finally(() => setLoading(false));
  }, [group._id]);

  const myFeed = feed.filter((s) => s.user?._id === user?._id);

  const orderedFeed = useMemo(() => [...feed].reverse(), [feed]);

  useLayoutEffect(() => {
    if (feedContainerRef.current) {
      feedContainerRef.current.scrollTop = feedContainerRef.current.scrollHeight;
    }
  }, [orderedFeed]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-(--color-surface) border border-(--color-border) rounded-xl p-6 w-[70vw] h-[70vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-end gap-3 mb-4">
          <button
            onClick={onClose}
            className="text-(--color-text-muted) hover:text-(--color-text) transition text-xl leading-none"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-(--color-text-muted) text-sm">Loading activity...</p>
          </div>
        ) : (
          <>
            <WeekStrip submissions={myFeed} onOpenTimeline={() => setShowTimeline(true)} />

            <div
              ref={feedContainerRef}
              className="mt-6 flex-1 overflow-y-auto px-2 flex flex-col gap-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {feed.length === 0 && (
                <p className="text-(--color-text-muted) text-sm">No submissions yet.</p>
              )}

              {orderedFeed.map((sub, index) => {
                const isMine = sub.user?._id === user?._id;
                const prev = orderedFeed[index - 1];
                const isGrouped =
                  prev &&
                  prev.user?._id === sub.user?._id &&
                  Math.abs(new Date(sub.timestamp) - new Date(prev.timestamp)) < TWO_HOURS_MS;

                return (
                  <div
                    key={sub._id}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    {!isGrouped && (
                      <p className="text-xs text-(--color-text-muted)">
                        {!isMine && `${sub.user?.name} · `}
                        {formatDateTime(sub.timestamp)}
                      </p>
                    )}
                    <div
                      className={`mt-1 rounded-[18px] px-4 py-2 text-sm max-w-[80%] text-white ${
                        isMine ? 'bg-[#0A84FF]' : 'bg-[#3A3A3C]'
                      }`}
                    >
                      {formatProblemName(sub.problemName)}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </motion.div>

      <AnimatePresence>
        {showTimeline && (
          <TimelineModal submissions={myFeed} onClose={() => setShowTimeline(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}