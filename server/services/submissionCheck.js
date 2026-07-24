const axios = require('axios');
const User = require('../models/User');

// Checks a LeetCode username's public recent accepted submissions.
// Returns the timestamp of their most recent one, or null if none/error.
async function getLatestLeetCodeSubmission(username) {
  try {
    const query = `
      query recentAcSubmissions($username: String!, $limit: Int!) {
        recentAcSubmissionList(username: $username, limit: $limit) {
          timestamp
        }
      }
    `;

    const { data } = await axios.post('https://leetcode.com/graphql', {
      query,
      variables: { username, limit: 1 },
    });

    const submissions = data?.data?.recentAcSubmissionList;
    if (!submissions || submissions.length === 0) return null;

    // LeetCode returns timestamp as a unix seconds string
    return new Date(Number(submissions[0].timestamp) * 1000);
  } catch (err) {
    console.error(`[submission-check] LeetCode lookup failed for ${username}:`, err.message);
    return null;
  }
}

// Checks a NeetCode-linked GitHub repo's most recent commit.
// repoFullName looks like "azibat0r/neetcode-submissions".
async function getLatestNeetCodeCommit(repoFullName) {
  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${repoFullName}/commits`,
      { params: { per_page: 1 } }
    );

    if (!data || data.length === 0) return null;

    return new Date(data[0].commit.author.date);
  } catch (err) {
    console.error(`[submission-check] GitHub lookup failed for ${repoFullName}:`, err.message);
    return null;
  }
}

// Runs through every user who's linked an account, checks for a newer
// submission than what we last recorded, and updates them if so.
async function checkAllSubmissions() {
  const users = await User.find({
    $or: [{ leetcodeUsername: { $ne: null } }, { neetcodeGithubRepo: { $ne: null } }],
  });

  let updated = 0;

  for (const user of users) {
    let latest = null;

    if (user.leetcodeUsername) {
      latest = await getLatestLeetCodeSubmission(user.leetcodeUsername);
    } else if (user.neetcodeGithubRepo) {
      latest = await getLatestNeetCodeCommit(user.neetcodeGithubRepo);
    }

console.log(
      `[submission-check] ${user.name}: latest=${latest}, previouslyKnown=${user.lastKnownSubmissionAt}`
    );

    if (latest && (!user.lastKnownSubmissionAt || latest > user.lastKnownSubmissionAt)) {
      user.lastKnownSubmissionAt = latest;
      await user.save();
      updated += 1;
    }
  }

  console.log(`[submission-check] checked ${users.length} users, ${updated} had new activity`);
}

module.exports = { checkAllSubmissions, getLatestLeetCodeSubmission, getLatestNeetCodeCommit };