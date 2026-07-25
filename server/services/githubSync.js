const axios = require('axios');
const Job = require('../models/Job');

let lastSyncedAt = null;

function toDate(unixSeconds) {
  return unixSeconds ? new Date(unixSeconds * 1000) : undefined;
}

function dedupeKey(company, title) {
  const c = (company || '').trim().toLowerCase();
  const t = (title || '').trim().toLowerCase();
  return `${c}::${t}`;
}

async function fetchVanshb03() {
  const url =
    'https://raw.githubusercontent.com/vanshb03/Summer2027-Internships/dev/.github/scripts/listings.json';
  const { data } = await axios.get(url, { timeout: 15000 });

  return (data || [])
    .filter((item) => item.id && item.is_visible)
    .map((item) => ({
      company: item.company_name,
      title: item.title,
      locations: item.locations || [],
      url: item.url,
      datePosted: toDate(item.date_posted),
      feedSource: 'vanshb03',
    }));
}

async function fetchZshah101() {
  const url =
    'https://zshah101.github.io/Automated-List-Of-Summer-2027-and-Fall-2026-Tech-Internships/api/jobs.json';
  const { data } = await axios.get(url, { timeout: 15000 });

  return (data?.jobs || []).map((item) => ({
    company: item.company,
    title: item.title,
    locations: (item.location || '').split(';').map((s) => s.trim()).filter(Boolean),
    url: item.url,
    datePosted: item.posted_at ? new Date(item.posted_at) : undefined,
    feedSource: 'zshah101',
  }));
}

async function syncInternships() {
  let added = 0;
  let updated = 0;

  try {
    const [fromVansh, fromZshah] = await Promise.all([
      fetchVanshb03().catch((err) => {
        console.error('[sync] vanshb03 fetch failed:', err.message);
        return [];
      }),
      fetchZshah101().catch((err) => {
        console.error('[sync] zshah101 fetch failed:', err.message);
        return [];
      }),
    ]);

    const grouped = new Map();

    for (const listing of [...fromVansh, ...fromZshah]) {
      const key = dedupeKey(listing.company, listing.title);
      const existing = grouped.get(key);

      if (!existing) {
        grouped.set(key, {
          externalId: key,
          company: listing.company,
          title: listing.title,
          locations: new Set(listing.locations),
          url: listing.url,
          datePosted: listing.datePosted,
        });
      } else {
        listing.locations.forEach((loc) => existing.locations.add(loc));
        if (listing.datePosted && (!existing.datePosted || listing.datePosted > existing.datePosted)) {
          existing.datePosted = listing.datePosted;
          existing.url = listing.url;
        }
      }
    }

    const seenIds = new Set();

    for (const job of grouped.values()) {
      seenIds.add(job.externalId);
      const doc = {
        company: job.company,
        title: job.title,
        locations: Array.from(job.locations),
        url: job.url,
        datePosted: job.datePosted,
        active: true,
      };

      const result = await Job.updateOne(
        { externalId: job.externalId },
        { $set: doc },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        added += 1;
      } else {
        updated += 1;
      }
    }

    const deactivateResult = await Job.updateMany(
      { externalId: { $nin: Array.from(seenIds) }, active: true },
      { $set: { active: false } }
    );

    lastSyncedAt = new Date();

    console.log(
      `[sync] +${added} added, ${updated} updated, ${deactivateResult.modifiedCount || 0} deactivated`
    );
  } catch (err) {
    console.error('[sync] failed:', err.message);
  }
}

module.exports = { syncInternships, getLastSyncedAt: () => lastSyncedAt };