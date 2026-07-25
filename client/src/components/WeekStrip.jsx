function getWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    days.push(d);
  }
  return days;
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function WeekStrip({ submissions, onOpenTimeline }) {
  const days = getWeekDates();
  const today = new Date();

  return (
    <div>
      <button
        onClick={onOpenTimeline}
        className="text-xs text-(--color-text-muted) hover:text-(--color-accent) transition mb-2"
      >
        Timeline
      </button>
      <div className="flex justify-between gap-1">
        {days.map((day, i) => {
          const submitted = submissions.some((s) => sameDay(new Date(s.timestamp), day));
          const isFuture = day > today && !sameDay(day, today);
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs border ${
                  isFuture
                    ? 'border-(--color-border) text-(--color-text-muted)'
                    : submitted
                    ? 'bg-green-500 border-green-400 text-(--color-bg)'
                    : 'bg-red-500/20 border-red-500 text-red-400'
                }`}
              >
                {day.getDate()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}