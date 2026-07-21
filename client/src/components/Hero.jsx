import SyncBadge from './SyncBadge.jsx';

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pt-24">
      <SyncBadge />

      <h1 className="mt-8 max-w-3xl text-5xl sm:text-6xl font-bold leading-tight tracking-tight">
        Never refresh a
        <br />
        career page <span className="italic text-(--color-accent)">again.</span>
      </h1>

      <p className="mt-6 max-w-xl text-lg text-(--color-text-muted)">
        Every internship posted to the community's tracked GitHub repo shows up
        here automatically — no forms, no manual updates, no stale listings.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <a href="#feed" className="rounded-full bg-(--color-accent) px-6 py-3 text-sm font-medium text-(--color-bg) hover:opacity-90 transition">
          See open roles
        </a>
        <a href="https://github.com/vanshb03/Summer2027-Internships" target="_blank" rel="noreferrer" className="rounded-full border border-(--color-border) px-6 py-3 text-sm font-medium hover:border-(--color-accent) transition">
          View source repo
        </a>
      </div>
    </section>
  );
}