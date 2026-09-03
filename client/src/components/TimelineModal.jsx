import { motion } from 'framer-motion';
import { Calendar } from '@/components/ui/calendar';

function isSubmittedDay(calendarDate, submissions) {
  return submissions.some((s) => {
    const d = new Date(s.timestamp);
    return (
      d.getFullYear() === calendarDate.year &&
      d.getMonth() + 1 === calendarDate.month &&
      d.getDate() === calendarDate.day
    );
  });
}

export default function TimelineModal({ submissions, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] px-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-(--color-surface) border border-(--color-border) rounded-xl p-6 w-[75vh] h-[75vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 flex items-center justify-center">
          <Calendar
            isReadOnly
            aria-label="Submission history"
            dayClassName={(date) =>
              isSubmittedDay(date, submissions)
                ? 'border-2 border-green-500 text-green-400'
                : ''
            }
            className="bg-transparent [--cell-size:--spacing(16)]"
          />
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-md border border-(--color-border) px-4 py-2 text-sm hover:border-(--color-accent) transition"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}
