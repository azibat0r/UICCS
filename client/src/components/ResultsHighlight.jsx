import { motion } from 'framer-motion';
import FadeInSection from './FadeInSection.jsx';

const RADIUS = 64;
const STROKE = 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function StatRing({ percent }) {
  const offset = CIRCUMFERENCE * (1 - percent / 100);

  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
        <circle
          cx="80"
          cy="80"
          r={RADIUS}
          fill="none"
          stroke="var(--color-accent-soft)"
          strokeWidth={STROKE}
        />
        <motion.circle
          cx="80"
          cy="80"
          r={RADIUS}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold text-(--color-accent)">{percent}%</span>
      </div>
    </div>
  );
}

function StatCard({ percent, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center gap-6 rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 text-center sm:flex-row sm:text-left"
    >
      <StatRing percent={percent} />
      <div>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-sm text-(--color-text-muted)">{description}</p>
      </div>
    </motion.div>
  );
}

export default function ResultsHighlight() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <FadeInSection>
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-(--color-accent)" />
          <span className="text-xs font-semibold tracking-widest text-(--color-accent) uppercase">
            Our Results
          </span>
        </div>
        <h2 className="font-display max-w-2xl text-3xl leading-tight sm:text-4xl">
          Results that <span className="italic text-(--color-accent)">speak</span> for
          themselves.
        </h2>
        <p className="mt-4 max-w-xl text-(--color-text-muted)">
          Real feedback from students using PathToSWE to land internships and stay
          consistent with their practice.
        </p>
      </FadeInSection>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <StatCard
          percent={87}
          title="Opportunities Found"
          description="Students discovered internships they'd have otherwise scrolled right past."
        />
        <StatCard
          percent={76}
          title="Built the Habit"
          description="Linking their account turned grinding LeetCode from a maybe into a habit."
        />
      </div>
    </section>
  );
}
