import { Link } from 'react-router-dom';

export default function StudyGroupsHighlight() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 border-t border-(--color-border) pt-16">
      <h2 className="max-w-2xl font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl">
        Practice <span className="italic text-(--color-accent)">together,</span>
        <br />
        verified automatically.
      </h2>

      <p className="mt-6 max-w-xl text-lg text-(--color-text-muted)">
        Link your LeetCode or NeetCode account and join a study group. Every
        problem you solve is detected automatically and shared with your
        group &mdash; no manual check-ins, no honor system.
      </p>

      <div className="mt-8">
        <Link
          to="/groups"
          className="rounded-full border border-(--color-border) px-6 py-3 text-sm font-medium transition hover:border-(--color-accent-border)"
        >
          Explore study groups
        </Link>
      </div>
    </section>
  );
}