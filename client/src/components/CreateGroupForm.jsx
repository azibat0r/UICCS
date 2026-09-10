import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { API_URL } from '../config.js';

function isValidInt(value, min, max) {
  if (!/^\d+$/.test(value.trim())) return false;
  const n = Number(value);
  return n >= min && n <= max;
}

export default function CreateGroupForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState('3');
  const [questionsPerDay, setQuestionsPerDay] = useState('1');
  const [askToJoin, setAskToJoin] = useState(false);
  const [memberCap, setMemberCap] = useState('20');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    daysPerWeek: false,
    questionsPerDay: false,
    memberCap: false,
  });
  const [showInvalidPopup, setShowInvalidPopup] = useState(false);

  function handleNumberChange(field, min, max, setter) {
    return (e) => {
      const value = e.target.value;
      setter(value);
      if (fieldErrors[field]) {
        setFieldErrors((prev) => ({ ...prev, [field]: !isValidInt(value, min, max) }));
      }
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const newErrors = {
      daysPerWeek: !isValidInt(daysPerWeek, 1, 7),
      questionsPerDay: !isValidInt(questionsPerDay, 1, 20),
      memberCap: !isValidInt(memberCap, 2, 100),
    };

    if (newErrors.daysPerWeek || newErrors.questionsPerDay || newErrors.memberCap) {
      setFieldErrors(newErrors);
      setShowInvalidPopup(true);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title,
          description,
          daysPerWeek: Number(daysPerWeek),
          questionsPerDay: Number(questionsPerDay),
          askToJoin,
          memberCap: Number(memberCap),
        }),
      });

      if (!res.ok) {
        setError('You must be logged in to create a group.');
        return;
      }

      setTitle('');
      setDescription('');
      onCreated();
    } catch {
      setError('Something went wrong. Try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      <div>
        <label className="text-sm text-(--color-text-muted)">Title *</label>
        <input
          type="text"
          placeholder="e.g. Daily LeetCode Grind, Blind 75, System Design Prep"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-md border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm"
          required
        />
      </div>

      <div>
        <label className="text-sm text-(--color-text-muted)">What will you be working on?</label>
        <textarea
          placeholder="e.g. Working through NeetCode 150, arrays & strings this week"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm text-(--color-text-muted)">Days per week *</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="1-7"
            value={daysPerWeek}
            onChange={handleNumberChange('daysPerWeek', 1, 7, setDaysPerWeek)}
            className={`mt-1 w-full rounded-md border bg-(--color-surface) px-4 py-2 text-sm ${
              fieldErrors.daysPerWeek ? 'border-red-500' : 'border-(--color-border)'
            }`}
          />
        </div>

        <div className="flex-1">
          <label className="text-sm text-(--color-text-muted)">Questions per day *</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="1-20"
            value={questionsPerDay}
            onChange={handleNumberChange('questionsPerDay', 1, 20, setQuestionsPerDay)}
            className={`mt-1 w-full rounded-md border bg-(--color-surface) px-4 py-2 text-sm ${
              fieldErrors.questionsPerDay ? 'border-red-500' : 'border-(--color-border)'
            }`}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm text-(--color-text-muted)">Ask to Join</label>
          <select
            value={askToJoin}
            onChange={(e) => setAskToJoin(e.target.value === 'true')}
            className="mt-1 w-full rounded-md border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm"
          >
            <option value="false">No - open to anyone</option>
            <option value="true">Yes - approval required</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="text-sm text-(--color-text-muted)">Member Cap</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="2-100"
            value={memberCap}
            onChange={handleNumberChange('memberCap', 2, 100, setMemberCap)}
            className={`mt-1 w-full rounded-md border bg-(--color-surface) px-4 py-2 text-sm ${
              fieldErrors.memberCap ? 'border-red-500' : 'border-(--color-border)'
            }`}
          />
        </div>
      </div>

      {error && <p className="text-(--color-accent) text-sm">{error}</p>}

      <button
        type="submit"
        className="rounded-md bg-(--color-accent) px-4 py-2 text-sm font-medium text-(--color-bg) hover:opacity-90 transition"
      >
        Create Group
      </button>

      <AnimatePresence>
        {showInvalidPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6"
            onClick={() => setShowInvalidPopup(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-(--color-surface) border border-(--color-border) rounded-xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-bold text-lg mb-2">Wrong info</h3>
              <p className="text-sm text-(--color-text-muted) mb-6">
                One or more fields need a valid number. Fix the fields outlined in red
                and try again.
              </p>
              <button
                type="button"
                onClick={() => setShowInvalidPopup(false)}
                className="w-full rounded-md bg-(--color-accent) px-4 py-2 text-sm font-medium text-(--color-bg) hover:opacity-90 transition"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
