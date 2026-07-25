import { useEffect, useState } from 'react';

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function TimelineModal({ onClose }) {
  const [submissions, setSubmissions] = useState([]);
  const [viewDate, setViewDate] = useState(new Date());

  useEffect(() => {
    fetch('http://localhost:4000/api/submissions/mine', { credentials: 'include' })
      .then((res) => res.json())
      .then(setSubmissions);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = firstOfMonth.getDay();

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function changeMonth(delta) {
    setViewDate(new Date(year, month + delta, 1));
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] px-6"
      onClick={onClose}
    >
      <div
        className="bg-(--color-surface) border border-(--color-border) rounded-xl p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => changeMonth(-1)} className="text-(--color-text-muted) hover:text-(--color-text)">‹</button>
          <h3 className="font-bold">
            {viewDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button onClick={() => changeMonth(1)} className="text-(--color-text-muted) hover:text-(--color-text)">›</button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-xs text-center text-(--color-text-muted) mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (day === null) return <div key={i} />;
            const cellDate = new Date(year, month, day);
            const submitted = submissions.some((s) => sameDay(new Date(s.timestamp), cellDate));
            return (
              <div
                key={i}
                className={`aspect-square flex items-center justify-center rounded-full text-xs ${
                  submitted ? 'bg-green-500 text-(--color-bg)' : 'text-(--color-text-muted)'
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-md border border-(--color-border) px-4 py-2 text-sm hover:border-(--color-accent) transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}