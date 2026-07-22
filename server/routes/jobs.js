const express = require('express');
const Job = require('../models/Job');

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

module.exports = router;