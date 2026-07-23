const express = require('express');
const Job = require('../models/Job');
const { getLastSyncedAt } = require('../services/githubSync');

const router = express.Router();

// GET /api/jobs - returns all active internships, newest first
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ active: true }).sort({ datePosted: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load jobs' });
  }
});

// GET /api/jobs/sync-status - returns when the feed last synced
router.get('/sync-status', (req, res) => {
  res.json({ lastSyncedAt: getLastSyncedAt() });
});

module.exports = router;