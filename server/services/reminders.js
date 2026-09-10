const Group = require('../models/Group');
const Submission = require('../models/Submission');
// Not used directly, but Group.populate('members.user') needs the 'User'
// model registered with Mongoose - required here so this module works
// standalone instead of relying on some other file having loaded it first.
require('../models/User');
const { sendReminderEmail } = require('./email');

const HOURS_PER_WEEK = 24 * 7;

function hoursSince(date) {
  return (Date.now() - date.getTime()) / (1000 * 60 * 60);
}

// Runs through every group and emails any member who hasn't had a verified
// submission since they joined within their group's schedule window
// (a week's worth of hours spread evenly across daysPerWeek) - skipping
// anyone already reminded within that same window.
async function checkReminders() {
  let sentCount = 0;

  const groups = await Group.find().populate({
    path: 'members.user',
    select: 'email',
  });

  for (const group of groups) {
    const thresholdHours = HOURS_PER_WEEK / group.daysPerWeek;

    for (const member of group.members) {
      const user = member.user;
      if (!user?.email) continue;

      const lastSubmission = await Submission.findOne({
        user: user._id,
        timestamp: { $gte: member.joinedAt },
      }).sort({ timestamp: -1 });

      const lastActivityAt = lastSubmission ? lastSubmission.timestamp : member.joinedAt;

      if (hoursSince(lastActivityAt) < thresholdHours) continue;

      if (member.lastReminderSentAt && hoursSince(member.lastReminderSentAt) < thresholdHours) {
        continue;
      }

      const sent = await sendReminderEmail(
        user.email,
        group.title,
        group.daysPerWeek,
        group.questionsPerDay
      );
      if (sent) {
        member.lastReminderSentAt = new Date();
        await group.save();
        sentCount += 1;
      }
    }
  }

  console.log(`[reminders] sent ${sentCount} reminder email${sentCount === 1 ? '' : 's'}`);
}

module.exports = { checkReminders };
