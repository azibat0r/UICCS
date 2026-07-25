import { useState } from 'react';
import { API_URL } from '../config.js';

export default function DeleteAccountModal({ onConfirm, onCancel }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-6"
      onClick={onCancel}
    >
      <div
        className="bg-(--color-surface) border border-(--color-border) rounded-xl p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-bold text-lg mb-2">Delete your account?</h3>
        <p className="text-sm text-(--color-text-muted) mb-4">
          This is permanent. You'll be removed from every study group, and your
          entire submission history will be deleted &mdash; not just unlinked,
          gone for good. This cannot be undone.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-md border border-(--color-border) px-4 py-2 text-sm hover:border-(--color-accent) transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setConfirming(true);
              onConfirm();
            }}
            disabled={confirming}
            className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition disabled:opacity-50"
          >
            {confirming ? 'Deleting...' : 'Delete Permanently'}
          </button>
        </div>
      </div>
    </div>
  );
}