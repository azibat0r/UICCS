import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUser } from '../context/useUser.js';
import { API_URL } from '../config.js';

export default function JoinRequestPopup() {
  const { user } = useUser();
  const [requests, setRequests] = useState([]);
  const [dismissed, setDismissed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch(`${API_URL}/api/groups/join-requests`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setRequests(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [user]);

  const current = !dismissed ? requests[0] : null;

  async function respond(action) {
    if (!current || busy) return;
    setBusy(true);
    await fetch(
      `${API_URL}/api/groups/${current.groupId}/join-requests/${current.requesterId}/${action}`,
      { method: 'POST', credentials: 'include' }
    );
    setBusy(false);
    setRequests((prev) => prev.slice(1));
  }

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative bg-(--color-surface) border border-(--color-border) rounded-xl p-6 max-w-sm w-full"
          >
            <button
              onClick={() => setDismissed(true)}
              className="absolute top-4 right-4 text-(--color-text-muted) hover:text-(--color-text) transition text-xl leading-none"
              aria-label="Close"
            >
              ×
            </button>

            <h3 className="font-bold text-lg mb-2 pr-6">Join request</h3>
            <p className="text-sm text-(--color-text-muted) mb-6">
              <strong className="text-(--color-text)">{current.requesterName}</strong> wants to
              join your study group{' '}
              <strong className="text-(--color-text)">{current.groupTitle}</strong>.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => respond('deny')}
                disabled={busy}
                className="flex-1 rounded-md border border-(--color-border) px-4 py-2 text-sm hover:border-(--color-accent) transition disabled:opacity-50"
              >
                Deny
              </button>
              <button
                onClick={() => respond('accept')}
                disabled={busy}
                className="flex-1 rounded-md bg-(--color-accent) px-4 py-2 text-sm font-medium text-(--color-bg) hover:opacity-90 transition disabled:opacity-50"
              >
                Accept
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
