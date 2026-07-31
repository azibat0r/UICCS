import { Link } from 'react-router-dom';
import SyncBadge from './SyncBadge.jsx';

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pt-24">
      <SyncBadge />

      <h1 className="mt-8 max-w-3xl font-display text-5xl leading-[1.08] tracking-tight sm:text-6xl">
        Never refresh a
        <br />
        career page <span className="italic text-(--color-accent)">again.</span>
      </h1>

      <p className="mt-6 max-w-xl text-lg text-(--color-text-muted)">
        We pull internship listings from multiple community-maintained GitHub
        repositories and combine them into a single, deduplicated feed &mdash;
        refreshed automatically every 6 hours. No forms, no manual updates,
        no stale listings.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Link
          to="/feed"
          className="rounded-full bg-(--color-accent) px-6 py-3 text-sm font-medium text-(--color-bg) transition hover:opacity-90"
        >
          See open roles
        </Link>
      </div>
    </section>
  );
}