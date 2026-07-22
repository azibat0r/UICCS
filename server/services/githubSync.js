const axios = require('axios');
const Job = require('../models/Job');

const LISTINGS_URL =
  'https://raw.githubusercontent.com/vanshb03/Summer2027-Internships/dev/.github/scripts/listings.json';

function toDate(unixSeconds) {
  return unixSeconds ? new Date(unixSeconds * 1000) : undefined;
}

async function syncInternships() {
  try {
    const { data: listings } = await axios.get(LISTINGS_URL);

    let added = 0;
    let updated = 0;

    for (const item of listings) {
      if (!item.id || !item.is_visible) continue; // skip hidden/malformed entries

      const doc = {
        externalId: item.id,
        company: item.company_name,
        title: item.title,
        locations: item.locations || [],
        url: item.url,
        active: !!item.active,
        datePosted: toDate(item.date_posted),
      };

      const result = await Job.updateOne(
        { externalId: item.id },
        { $set: doc },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        added += 1;
      } else {
        updated += 1;
      }
    }

    console.log(`[sync] +${added} added, ${updated} updated`);
  } catch (err) {
    console.error('[sync] failed:', err.message);
  }
}

module.exports = { syncInternships };