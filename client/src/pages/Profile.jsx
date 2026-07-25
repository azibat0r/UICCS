import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/useUser.js';
import AccountSettingsBar from '../components/AccountSettingsBar.jsx';
import DeleteAccountModal from '../components/DeleteAccountModal.jsx';

export default function Profile() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [nameError, setNameError] = useState('');
  const [nameSaving, setNameSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!user) {
    return (
      <div className="w-full px-6 lg:px-12 py-16">
        <p className="text-(--color-text-muted)">Log in to view your profile.</p>
      </div>
    );
  }

  async function handleSaveName() {
    setNameError('');
    setNameSaving(true);

    const res = await fetch('http://localhost:4000/api/auth/change-username', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name }),
    });

    const data = await res.json();
    setNameSaving(false);

    if (!res.ok) {
      setNameError(data.error || 'Something went wrong.');
      return;
    }

    setUser(data);
  }

  async function handleDeleteAccount() {
    await fetch('http://localhost:4000/api/auth/delete-account', {
      method: 'DELETE',
      credentials: 'include',
    });
    setUser(null);
    navigate('/');
  }

  return (
    <div className="w-full px-6 lg:px-12 py-16 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <div className="mb-8">
        <label className="text-sm text-(--color-text-muted)">Username</label>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 rounded-md border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm"
          />
          <button
            onClick={handleSaveName}
            disabled={nameSaving || name === user.name}
            className="rounded-md bg-(--color-accent) px-4 py-2 text-sm font-medium text-(--color-bg) hover:opacity-90 transition disabled:opacity-50"
          >
            {nameSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
        {nameError && <p className="text-(--color-accent) text-sm mt-2">{nameError}</p>}
      </div>

      <div className="mb-8">
        <p className="text-sm text-(--color-text-muted) mb-2">Practice accounts</p>
        <AccountSettingsBar />
      </div>

      <div className="border-t border-(--color-border) pt-6">
        <p className="text-sm text-(--color-text-muted) mb-3">Danger zone</p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="rounded-md border border-red-600/40 text-red-500 px-4 py-2 text-sm hover:bg-red-600/10 transition"
        >
          Delete Account
        </button>
      </div>

      {showDeleteModal && (
        <DeleteAccountModal
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}