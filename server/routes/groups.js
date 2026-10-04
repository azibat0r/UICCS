const express = require('express');
const Group = require('../models/Group');
const User = require('../models/User');
const { sendJoinRequestEmail } = require('../services/email');
const { getUserIdFromReq } = require('../middleware/auth');

const router = express.Router();

const MEMBER_FIELDS = 'name lastKnownSubmissionAt';

router.get('/', async (req, res) => {
  const groups = await Group.find()
    .select('-joinRequests')
    .populate('createdBy', 'name')
    .populate({ path: 'members.user', select: MEMBER_FIELDS });
  res.json(groups);
});

router.get('/mine', async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req);
    const groups = await Group.find({ 'members.user': userId })
      .select('-joinRequests')
      .populate('createdBy', 'name')
      .populate({ path: 'members.user', select: MEMBER_FIELDS });
    res.json(groups);
  } catch {
    res.status(401).json({ error: 'Not logged in' });
  }
});

// Pending join requests for every group the current user created - powers
// the accept/deny popup that appears when a group creator opens the app.
router.get('/join-requests', async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req);
    const groups = await Group.find({
      createdBy: userId,
      'joinRequests.0': { $exists: true },
    })
      .select('title joinRequests')
      .populate({ path: 'joinRequests.user', select: 'name' });

    const requests = groups.flatMap((g) =>
      g.joinRequests
        .filter((r) => r.user)
        .map((r) => ({
          groupId: g._id,
          groupTitle: g.title,
          requesterId: r.user._id,
          requesterName: r.user.name,
          requestedAt: r.requestedAt,
        }))
    );

    res.json(requests);
  } catch {
    res.status(401).json({ error: 'Not logged in' });
  }
});

router.post('/', async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req);
    const { title, description, daysPerWeek, questionsPerDay, askToJoin, memberCap } = req.body;

    const group = await Group.create({
      title,
      description,
      daysPerWeek,
      questionsPerDay,
      askToJoin,
      memberCap,
      createdBy: userId,
      members: [{ user: userId, joinedAt: new Date() }],
    });

    res.json(group);
  } catch {
    res.status(401).json({ error: 'Not logged in' });
  }
});

router.post('/:id/join', async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req);
    const group = await Group.findById(req.params.id).populate('createdBy', 'email');

    if (!group) return res.status(404).json({ error: 'Group not found' });

    const alreadyMember = group.members.some((m) => m.user.toString() === userId);
    if (alreadyMember) {
      return res.status(409).json({ error: 'Already a member' });
    }

    const alreadyRequested = group.joinRequests.some((r) => r.user.toString() === userId);
    if (alreadyRequested) {
      return res.status(409).json({ error: 'Join request already pending' });
    }

    if (group.members.length >= group.memberCap) {
      return res.status(409).json({ error: 'Group is full' });
    }

    if (group.askToJoin) {
      group.joinRequests.push({ user: userId, requestedAt: new Date() });
      await group.save();

      if (group.createdBy?.email) {
        const requester = await User.findById(userId).select('name');
        await sendJoinRequestEmail(group.createdBy.email, group.title, requester?.name || 'Someone');
      }

      return res.json({ requested: true });
    }

    group.members.push({ user: userId, joinedAt: new Date() });
    await group.save();
    res.json({ joined: true, group });
  } catch {
    res.status(401).json({ error: 'Not logged in' });
  }
});

router.post('/:id/join-requests/:userId/accept', async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req);
    const group = await Group.findById(req.params.id);

    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (group.createdBy.toString() !== userId) {
      return res.status(403).json({ error: 'Only the group creator can accept requests' });
    }

    const requestExists = group.joinRequests.some((r) => r.user.toString() === req.params.userId);
    if (!requestExists) return res.status(404).json({ error: 'No such join request' });

    if (group.members.length >= group.memberCap) {
      return res.status(409).json({ error: 'Group is full' });
    }

    group.joinRequests = group.joinRequests.filter((r) => r.user.toString() !== req.params.userId);
    group.members.push({ user: req.params.userId, joinedAt: new Date() });
    await group.save();

    res.json({ accepted: true });
  } catch {
    res.status(401).json({ error: 'Not logged in' });
  }
});

router.post('/:id/join-requests/:userId/deny', async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req);
    const group = await Group.findById(req.params.id);

    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (group.createdBy.toString() !== userId) {
      return res.status(403).json({ error: 'Only the group creator can deny requests' });
    }

    group.joinRequests = group.joinRequests.filter((r) => r.user.toString() !== req.params.userId);
    await group.save();

    res.json({ denied: true });
  } catch {
    res.status(401).json({ error: 'Not logged in' });
  }
});

router.post('/:id/leave', async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req);
    const group = await Group.findById(req.params.id);

    if (!group) return res.status(404).json({ error: 'Group not found' });

    group.members = group.members.filter((m) => m.user.toString() !== userId);

    if (group.members.length === 0) {
      await Group.findByIdAndDelete(group._id);
      return res.json({ deleted: true });
    }

    await group.save();
    res.json(group);
  } catch {
    res.status(401).json({ error: 'Not logged in' });
  }
});

module.exports = router;
