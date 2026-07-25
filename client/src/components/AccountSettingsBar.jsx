import { useState } from 'react';
import { useUser } from '../context/useUser.js';
import LinkAccountModal from './LinkAccountModal.jsx';

export default function AccountSettingsBar() {
  const { user, setUser } = useUser();
  const [showWarning, setShowWarning] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);

  if (!user) return null;

  const hasLinked = user.leetcodeUsername || user.neetcodeGithubRepo;

  function handleChangeClick() {
    if (hasLinked) {
      setShowWarning(true);
    } else {
      setShowLinkModal(true);
    }
  }

  function handleSaved(updatedUser) {
    setUser(updatedUser);
    setShowLinkModal(false);
  }

  return (
    <div className="mb-6 flex items-center justify-between rounded-lg border border-(--color-border) bg-(--color-surface) px-4 py-3 text-sm">
      <div>
        <span className="text-(--color-text-muted)">Linked account: </span>
        {user.leetcodeUsername && (
          <span>LeetCode &mdash; {user.leetcodeUsername}</span>
        )}
        {user.neetcodeGithubRepo && (
          <span>NeetCode &mdash; {user.neetcodeGithubRepo}</span>
        )}
        {!hasLinked && <span className="text-(--color-text-muted)">None linked yet</span>}
      </div>

      <button
        onClick={handleChangeClick}
        className="text-xs text-(--color-accent) hover:underline"
      >
        {hasLinked ? 'Change' : 'Link account'}
      </button>

      {showWarning && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6"
          onClick={() => setShowWarning(false)}
        >
          <div
            className="bg-(--color-surface) border border-(--color-border) rounded-xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-lg mb-2">Switch linked account?</h3>
            <p className="text-sm text-(--color-text-muted) mb-4">
              Your past submissions stay recorded, but going forward we'll only track
              the new account &mdash; activity from your current one won't carry over
              automatically.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowWarning(false)}
                className="flex-1 rounded-md border border-(--color-border) px-4 py-2 text-sm hover:border-(--color-accent) transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowWarning(false);
                  setShowLinkModal(true);
                }}
                className="flex-1 rounded-md bg-(--color-accent) px-4 py-2 text-sm font-medium text-(--color-bg) hover:opacity-90 transition"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {showLinkModal && (
        <LinkAccountModal onSaved={handleSaved} onCancel={() => setShowLinkModal(false)} />
      )}
    </div>
  );
}