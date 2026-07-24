import { useEffect, useState, useCallback } from 'react';
import { useUser } from '../context/useUser.js';
import GroupCard from '../components/GroupCard.jsx';
import CreateGroupForm from '../components/CreateGroupForm.jsx';
import LinkAccountModal from '../components/LinkAccountModal.jsx';

export default function StudyGroups() {
  const { user, setUser } = useUser();
  const [tab, setTab] = useState('browse');
  const [allGroups, setAllGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingGroupId, setPendingGroupId] = useState(null);

  const loadGroups = useCallback(() => {
    setLoading(true);
    fetch('http://localhost:4000/api/groups')
      .then((res) => res.json())
      .then(setAllGroups);

    if (user) {
      fetch('http://localhost:4000/api/groups/mine', { credentials: 'include' })
        .then((res) => res.json())
        .then(setMyGroups)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  async function actuallyJoin(groupId) {
    const res = await fetch(`http://localhost:4000/api/groups/${groupId}/join`, {
      method: 'POST',
      credentials: 'include',
    });
    if (res.ok) loadGroups();
  }

  function handleJoin(groupId) {
    const hasLinkedAccount = user?.leetcodeUsername || user?.neetcodeGithubRepo;
    if (!hasLinkedAccount) {
      setPendingGroupId(groupId);
    } else {
      actuallyJoin(groupId);
    }
  }

  async function handleLeave(groupId) {
    const res = await fetch(`http://localhost:4000/api/groups/${groupId}/leave`, {
      method: 'POST',
      credentials: 'include',
    });
    if (res.ok) loadGroups();
  }

  async function handleLinkAccountSaved(updatedUser) {
    setUser(updatedUser);
    if (pendingGroupId) {
      await actuallyJoin(pendingGroupId);
      setPendingGroupId(null);
    }
  }

  const myGroupIds = new Set(myGroups.map((g) => g._id));

  return (
    <div className="w-full px-6 lg:px-12 py-16">
      <h1 className="text-3xl font-bold mb-6">Study Groups</h1>

      <div className="flex gap-2 mb-8 border-b border-(--color-border)">
        {['mine', 'browse', 'create'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm border-b-2 transition ${
              tab === t
                ? 'border-(--color-accent) text-(--color-text)'
                : 'border-transparent text-(--color-text-muted) hover:text-(--color-text)'
            }`}
          >
            {t === 'mine' ? 'My Groups' : t === 'browse' ? 'Browse Groups' : 'Create Group'}
          </button>
        ))}
      </div>

      {!user && (
        <p className="text-(--color-text-muted) mb-6">
          Log in to join or create a study group.
        </p>
      )}

      {tab === 'mine' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myGroups.length === 0 && !loading && (
            <p className="text-(--color-text-muted)">You haven't joined any groups yet.</p>
          )}
          {myGroups.map((group) => (
            <GroupCard key={group._id} group={group} isMember onLeave={handleLeave} />
          ))}
        </div>
      )}

      {tab === 'browse' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allGroups.map((group) => (
            <GroupCard
              key={group._id}
              group={group}
              onJoin={user ? handleJoin : null}
              onLeave={handleLeave}
              isMember={myGroupIds.has(group._id)}
            />
          ))}
        </div>
      )}

      {tab === 'create' &&
        (user ? (
          <CreateGroupForm
            onCreated={() => {
              loadGroups();
              setTab('mine');
            }}
          />
        ) : (
          <p className="text-(--color-text-muted)">Log in to create a group.</p>
        ))}

      {pendingGroupId && (
        <LinkAccountModal
          onSaved={handleLinkAccountSaved}
          onCancel={() => setPendingGroupId(null)}
        />
      )}
    </div>
  );
}