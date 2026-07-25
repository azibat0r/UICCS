import { useState } from 'react';
import { useUser } from '../context/useUser.js';
import LinkAccountModal from './LinkAccountModal.jsx';
import { API_URL } from '../config.js';

export default function AccountSettingsBar() {
  const { user, setUser } = useUser();
  const [linkingPlatform, setLinkingPlatform] = useState(null); // 'leetcode' | 'neetcode' | null
  const [unlinkChoice, setUnlinkChoice] = useState(false);
  const [confirmUnlink, setConfirmUnlink] = useState(null); // 'leetcode' | 'neetcode' | null

  if (!user) return null;

  const hasLeetcode = !!user.leetcodeUsername;
  const hasNeetcode = !!user.neetcodeGithubRepo;
  const linkedCount = (hasLeetcode ? 1 : 0) + (hasNeetcode ? 1 : 0);

  function handleSaved(updatedUser) {
    setUser(updatedUser);
    setLinkingPlatform(null);
  }

  function handleUnlinkClick() {
    if (linkedCount === 2) {
      setUnlinkChoice(true);
    } else if (linkedCount === 1) {
      setConfirmUnlink(hasLeetcode ? 'leetcode' : 'neetcode');
    }
  }

  async function doUnlink(platform) {
    const res = await fetch('${API_URL}/api/auth/unlink-practice-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ platform }),
    });
    if (res.ok) {
      const updatedUser = await res.json();
      setUser(updatedUser);
    }
    setUnlinkChoice(false);
    setConfirmUnlink(null);
  }

  return (
    <div className="mb-6 rounded-lg border border-(--color-border) bg-(--color-surface) px-4 py-3 text-sm">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex flex-col gap-1">
          <span className="text-(--color-text-muted) text-xs">Linked accounts</span>
          {hasLeetcode && <span>LeetCode &mdash; {user.leetcodeUsername}</span>}
          {hasNeetcode && <span>NeetCode &mdash; {user.neetcodeGithubRepo}</span>}
          {linkedCount === 0 && <span className="text-(--color-text-muted)">None linked yet</span>}
        </div>

        <div className="flex items-center gap-3">
          {!hasLeetcode && (
            <button
              onClick={() => setLinkingPlatform('leetcode')}
              className="text-xs text-(--color-accent) hover:underline"
            >
              + LeetCode
            </button>
          )}
          {!hasNeetcode && (
            <button
              onClick={() => setLinkingPlatform('neetcode')}
              className="text-xs text-(--color-accent) hover:underline"
            >
              + NeetCode
            </button>
          )}
          {linkedCount > 0 && (
            <button
              onClick={handleUnlinkClick}
              className="text-xs text-(--color-text-muted) hover:text-(--color-accent) hover:underline"
            >
              Unlink
            </button>
          )}
        </div>
      </div>

      {linkingPlatform && (
        <LinkAccountModal
          platform={linkingPlatform}
          onSaved={handleSaved}
          onCancel={() => setLinkingPlatform(null)}
        />
      )}

      {unlinkChoice && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6"
          onClick={() => setUnlinkChoice(false)}
        >
          <div
            className="bg-(--color-surface) border border-(--color-border) rounded-xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-lg mb-2">Which account should we unlink?</h3>
            <p className="text-sm text-(--color-text-muted) mb-4">
              You have two linked - removing one still leaves the other tracking your activity.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setUnlinkChoice(false);
                  setConfirmUnlink('leetcode');
                }}
                className="rounded-md border border-(--color-border) px-4 py-2 text-sm hover:border-(--color-accent) transition"
              >
                LeetCode &mdash; {user.leetcodeUsername}
              </button>
              <button
                onClick={() => {
                  setUnlinkChoice(false);
                  setConfirmUnlink('neetcode');
                }}
                className="rounded-md border border-(--color-border) px-4 py-2 text-sm hover:border-(--color-accent) transition"
              >
                NeetCode &mdash; {user.neetcodeGithubRepo}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmUnlink && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6"
          onClick={() => setConfirmUnlink(null)}
        >
          <div
            className="bg-(--color-surface) border border-(--color-border) rounded-xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-lg mb-2">
              Unlink {confirmUnlink === 'leetcode' ? 'LeetCode' : 'NeetCode'}?
            </h3>
            <p className="text-sm text-(--color-text-muted) mb-4">
              {linkedCount === 2
                ? "Your other linked account keeps tracking your activity, so you'll stay in your groups."
                : 'This is your only linked account - removing it means you\'ll be taken out of every group you\'re in, since there\'s no source left to verify your activity. Your past history stays recorded, but you\'ll need to link a new account to rejoin.'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmUnlink(null)}
                className="flex-1 rounded-md border border-(--color-border) px-4 py-2 text-sm hover:border-(--color-accent) transition"
              >
                Cancel
              </button>
              <button
                onClick={() => doUnlink(confirmUnlink)}
                className="flex-1 rounded-md bg-(--color-accent) px-4 py-2 text-sm font-medium text-(--color-bg) hover:opacity-90 transition"
              >
                Unlink
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}