const express = require('express');
const jwt = require('jsonwebtoken');
const Group = require('../models/Group');

const router = express.Router();
const jwtSecret = 'uiccs-secret-key-change-later'; // must match auth.js exactly

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

// The fields we're willing to expose about each member on a group.
// Note: never include password here.
const MEMBER_FIELDS = 'name lastKnownSubmissionAt';

router.get('/', async (req, res) => {
  const groups = await Group.find()
    .populate('createdBy', 'name')
    .populate('members', MEMBER_FIELDS);
  res.json(groups);
});

router.get('/mine', async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req);
    const groups = await Group.find({ members: userId })
      .populate('createdBy', 'name')
      .populate('members', MEMBER_FIELDS);
    res.json(groups);
  } catch {
    res.status(401).json({ error: 'Not logged in' });
  }
});

router.post('/', async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req);
    const { focus, description, format, frequency, askToJoin, memberCap } = req.body;

    const group = await Group.create({
      focus,
      description,
      format,
      frequency,
      askToJoin,
      memberCap,
      createdBy: userId,
      members: [userId],
    });

    res.json(group);
  } catch {
    res.status(401).json({ error: 'Not logged in' });
  }
});

router.post('/:id/join', async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req);
    const group = await Group.findById(req.params.id);

    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (group.members.includes(userId)) {
      return res.status(409).json({ error: 'Already a member' });
    }
    if (group.members.length >= group.memberCap) {
      return res.status(409).json({ error: 'Group is full' });
    }

    group.members.push(userId);
    await group.save();
    res.json(group);
  } catch {
    res.status(401).json({ error: 'Not logged in' });
  }
});

router.post('/:id/leave', async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req);
    const group = await Group.findById(req.params.id);

    if (!group) return res.status(404).json({ error: 'Group not found' });

    group.members = group.members.filter((memberId) => memberId.toString() !== userId);
    await group.save();
    res.json(group);
  } catch {
    res.status(401).json({ error: 'Not logged in' });
  }
});

module.exports = router;