const express = require('express');
const jwt = require('jsonwebtoken');
const Submission = require('../models/Submission');
const Group = require('../models/Group');

const router = express.Router();
const jwtSecret = 'uiccs-secret-key-change-later';

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

router.get('/mine', async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req);
    const submissions = await Submission.find({ user: userId }).sort({ timestamp: -1 });
    res.json(submissions);
  } catch {
    res.status(401).json({ error: 'Not logged in' });
  }
});

// GET /api/submissions/group/:groupId - only submissions made by each
// member SINCE they joined this specific group, not their full history.
router.get('/group/:groupId', async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const joinDateByUser = {};
    group.members.forEach((m) => {
      joinDateByUser[m.user.toString()] = m.joinedAt;
    });

    const memberIds = group.members.map((m) => m.user);

    const submissions = await Submission.find({ user: { $in: memberIds } })
      .sort({ timestamp: -1 })
      .limit(200)
      .populate('user', 'name');

    const filtered = submissions
      .filter((s) => {
        const joinedAt = joinDateByUser[s.user._id.toString()];
        return joinedAt && new Date(s.timestamp) >= new Date(joinedAt);
      })
      .slice(0, 50);

    res.json(filtered);
  } catch {
    res.status(500).json({ error: 'Failed to load feed' });
  }
});

module.exports = router;