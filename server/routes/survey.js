const express = require('express');
const jwt = require('jsonwebtoken');
const Survey = require('../models/Survey');

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;

function getUserIdFromReq(req) {
  return new Promise((resolve, reject) => {
    const { token } = req.cookies;
    if (!token) return reject('Not logged in');
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) return reject(err);
      resolve(userData.id);
    });
  });
}

// GET /api/survey/mine - has this user already answered?
router.get('/mine', async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req);
    const survey = await Survey.findOne({ user: userId });
    res.json(survey);
  } catch {
    res.status(401).json(null);
  }
});

// POST /api/survey - submit or update their response
router.post('/', async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req);
    const { foundInternshipOpportunity, easierToStayConsistent, overallRating } = req.body;

    const survey = await Survey.findOneAndUpdate(
      { user: userId },
      { foundInternshipOpportunity, easierToStayConsistent, overallRating },
      { upsert: true, returnDocument: 'after' }
    );

    res.json(survey);
  } catch {
    res.status(401).json({ error: 'Not logged in' });
  }
});

// GET /api/survey/stats - the actual resume-ready aggregate numbers
router.get('/stats', async (req, res) => {
  const total = await Survey.countDocuments();
  if (total === 0) return res.json({ total: 0 });

  const foundInternship = await Survey.countDocuments({ foundInternshipOpportunity: true });
  const easierConsistent = await Survey.countDocuments({ easierToStayConsistent: true });

  const surveys = await Survey.find({}, 'overallRating');
  const avgRating = surveys.reduce((sum, s) => sum + s.overallRating, 0) / total;

  res.json({
    total,
    pctFoundInternship: Math.round((foundInternship / total) * 100),
    pctEasierConsistent: Math.round((easierConsistent / total) * 100),
    avgRating: Math.round(avgRating * 10) / 10,
  });
});

module.exports = router;