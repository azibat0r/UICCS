const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Group = require('../models/Group');
const { verifyLeetCodeUsername, verifyGithubRepo } = require('../services/submissionCheck');

const router = express.Router();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
};

// TEMP: email verification is bypassed for launch - account is created
// immediately and marked verified, instead of going through PendingSignup.
// Re-enable the PendingSignup flow once a verified sending domain is set up.
router.post('/register', async (req, res) => {
  const { name, email, password, linkedinUrl, githubUrl, personalWebsite, companies } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(422).json({ error: 'That email is already registered.' });
    }

    const existingName = await User.findOne({ name });
    if (existingName) {
      return res.status(422).json({ error: 'That username is already taken.' });
    }

    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
      linkedinUrl,
      githubUrl,
      personalWebsite,
      companies,
      emailVerified: true, // TEMP - bypassed for launch
    });

    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtSecret, {}, (err, token) => {
        if (err) {
          return res.status(500).json({ error: 'Login failed. Try again.' });
        }
        res.cookie('token', token, COOKIE_OPTIONS).json(userDoc);
      });
    } else {
      res.status(422).json('pass not ok');
    }
  } else {
    res.json('not found');
  }
});

router.get('/profile', (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        return res.json(null);
      }
      try {
        const user = await User.findById(userData.id);
        if (!user) return res.json(null);
        const {
          name,
          email,
          _id,
          leetcodeUsername,
          neetcodeGithubRepo,
          emailVerified,
          linkedinUrl,
          githubUrl,
          personalWebsite,
          companies,
        } = user;
        res.json({
          name,
          email,
          _id,
          leetcodeUsername,
          neetcodeGithubRepo,
          emailVerified,
          linkedinUrl,
          githubUrl,
          personalWebsite,
          companies,
        });
      } catch {
        res.json(null);
      }
    });
  } else {
    res.json(null);
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', COOKIE_OPTIONS).json(true);
});

router.post('/link-practice-account', async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Not logged in' });

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json({ error: 'Not logged in' });

    const { platform, value } = req.body;
    const cleanValue = (value || '').trim();

    if (!cleanValue) {
      return res.status(422).json({ error: 'Please enter a value.' });
    }

    if (platform === 'leetcode') {
      const valid = await verifyLeetCodeUsername(cleanValue);
      if (!valid) {
        return res.status(422).json({ error: 'That LeetCode username could not be found.' });
      }

      const existing = await User.findOne({ leetcodeUsername: cleanValue });
      if (existing && existing._id.toString() !== userData.id) {
        return res.status(409).json({ error: 'Someone else is already tracking that LeetCode account.' });
      }

      const user = await User.findByIdAndUpdate(
        userData.id,
        { leetcodeUsername: cleanValue },
        { returnDocument: 'after' }
      );
      return res.json(pickUserFields(user));
    }

    if (platform === 'neetcode') {
      const cleanedRepo = cleanValue
        .replace(/^https?:\/\/github\.com\//, '')
        .replace(/\/$/, '');
      const valid = await verifyGithubRepo(cleanedRepo);
      if (!valid) {
        return res.status(422).json({ error: 'That GitHub repo could not be found.' });
      }

      const existing = await User.findOne({ neetcodeGithubRepo: cleanedRepo });
      if (existing && existing._id.toString() !== userData.id) {
        return res.status(409).json({ error: 'Someone else is already tracking that GitHub repo.' });
      }

      const user = await User.findByIdAndUpdate(
        userData.id,
        { neetcodeGithubRepo: cleanedRepo },
        { returnDocument: 'after' }
      );
      return res.json(pickUserFields(user));
    }

    return res.status(400).json({ error: 'Unknown platform.' });
  });
});

router.post('/unlink-practice-account', async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Not logged in' });

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json({ error: 'Not logged in' });

    const { platform } = req.body;
    const update = platform === 'leetcode'
      ? { leetcodeUsername: null }
      : { neetcodeGithubRepo: null };

    const user = await User.findByIdAndUpdate(userData.id, update, { returnDocument: 'after' });

    const stillHasALink = user.leetcodeUsername || user.neetcodeGithubRepo;

    if (!stillHasALink) {
      await Group.updateMany(
        { 'members.user': userData.id },
        { $pull: { members: { user: userData.id } } }
      );
      await Group.deleteMany({ members: { $size: 0 } });
    }

    res.json(pickUserFields(user));
  });
});

router.post('/change-username', async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Not logged in' });

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json({ error: 'Not logged in' });

    const newName = (req.body.name || '').trim();
    if (!newName) {
      return res.status(422).json({ error: 'Username cannot be empty.' });
    }

    const existing = await User.findOne({ name: newName });
    if (existing && existing._id.toString() !== userData.id) {
      return res.status(409).json({ error: 'That username is already taken.' });
    }

    const user = await User.findByIdAndUpdate(
      userData.id,
      { name: newName },
      { returnDocument: 'after' }
    );

    res.json(pickUserFields(user));
  });
});

router.post('/update-profile-details', async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Not logged in' });

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json({ error: 'Not logged in' });

    const { linkedinUrl, githubUrl, personalWebsite, companies } = req.body;

    const user = await User.findByIdAndUpdate(
      userData.id,
      { linkedinUrl, githubUrl, personalWebsite, companies },
      { returnDocument: 'after' }
    );

    res.json(pickUserFields(user));
  });
});

router.delete('/delete-account', async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Not logged in' });

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json({ error: 'Not logged in' });

    const Submission = require('../models/Submission');

    await Group.updateMany(
      { 'members.user': userData.id },
      { $pull: { members: { user: userData.id } } }
    );
    await Group.deleteMany({ members: { $size: 0 } });
    await Submission.deleteMany({ user: userData.id });
    await User.findByIdAndDelete(userData.id);

    res.clearCookie('token', COOKIE_OPTIONS).json({ deleted: true });
  });
});

function pickUserFields(user) {
  return {
    name: user.name,
    email: user.email,
    _id: user._id,
    leetcodeUsername: user.leetcodeUsername,
    neetcodeGithubRepo: user.neetcodeGithubRepo,
    linkedinUrl: user.linkedinUrl,
    githubUrl: user.githubUrl,
    personalWebsite: user.personalWebsite,
    companies: user.companies,
  };
}

module.exports = router;