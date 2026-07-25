const axios = require('axios');
const User = require('../models/User');
const Submission = require('../models/Submission');

async function getRecentLeetCodeSubmissions(username, limit = 20) {
  try {
    const query = `
      query recentAcSubmissions($username: String!, $limit: Int!) {
        recentAcSubmissionList(username: $username, limit: $limit) {
          title
          timestamp
        }
      }
    `;
    const { data } = await axios.post('https://leetcode.com/graphql', {
      query,
      variables: { username, limit },
    });
    const submissions = data?.data?.recentAcSubmissionList || [];
    return submissions.map((s) => ({
      problemName: s.title,
      timestamp: new Date(Number(s.timestamp) * 1000),
      source: 'leetcode',
    }));
  } catch (err) {
    console.error(`[submission-check] LeetCode lookup failed for ${username}:`, err.message);
    return [];
  }
}

async function getRecentNeetCodeCommits(repoFullName, limit = 20) {
  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${repoFullName}/commits`,
      { params: { per_page: limit } }
    );
    return (data || []).map((c) => ({
      problemName: c.commit.message.split('\n')[0],
      timestamp: new Date(c.commit.author.date),
      source: 'neetcode',
    }));
  } catch (err) {
    console.error(`[submission-check] GitHub lookup failed for ${repoFullName}:`, err.message);
    return [];
  }
}

// Used to validate a username BEFORE saving it - checks existence only,
// doesn't care whether they've solved anything yet.
async function verifyLeetCodeUsername(username) {
  try {
    const query = `
      query userExists($username: String!) {
        matchedUser(username: $username) { username }
      }
    `;
    const { data } = await axios.post('https://leetcode.com/graphql', {
      query,
      variables: { username },
    });
    return !!data?.data?.matchedUser;
  } catch {
    return false;
  }
}

// Used to validate a repo BEFORE saving it - a plain existence check.
async function verifyGithubRepo(repoFullName) {
  try {
    await axios.get(`https://api.github.com/repos/${repoFullName}`);
    return true;
  } catch {
    return false;
  }
}

// Runs through every user with at least one linked account, checks BOTH
// sources if both are linked, and records any submissions newer than
// what we've already seen.
async function checkAllSubmissions() {
  const users = await User.find({
    $or: [{ leetcodeUsername: { $ne: null } }, { neetcodeGithubRepo: { $ne: null } }],
  });

  let totalNewSubmissions = 0;

  for (const user of users) {
    let recent = [];

    if (user.leetcodeUsername) {
      recent = recent.concat(await getRecentLeetCodeSubmissions(user.leetcodeUsername));
    }
    if (user.neetcodeGithubRepo) {
      recent = recent.concat(await getRecentNeetCodeCommits(user.neetcodeGithubRepo));
    }

    const newOnes = user.lastKnownSubmissionAt
      ? recent.filter((s) => s.timestamp > user.lastKnownSubmissionAt)
      : recent;

    for (const sub of newOnes) {
      try {
        await Submission.create({
          user: user._id,
          problemName: sub.problemName,
          timestamp: sub.timestamp,
          source: sub.source,
        });
        totalNewSubmissions += 1;
      } catch {
        // Duplicate - already recorded, safe to ignore.
      }
    }

    if (recent.length > 0) {
      const newest = recent.reduce((a, b) => (a.timestamp > b.timestamp ? a : b));
      if (!user.lastKnownSubmissionAt || newest.timestamp > user.lastKnownSubmissionAt) {
        user.lastKnownSubmissionAt = newest.timestamp;
        await user.save();
      }
    }
  }

  console.log(
    `[submission-check] checked ${users.length} users, ${totalNewSubmissions} new submissions recorded`
  );
}

module.exports = {
  checkAllSubmissions,
  verifyLeetCodeUsername,
  verifyGithubRepo,
};