const Group = require('../models/Group');
const Submission = require('../models/Submission');
// Not used directly, but Group.populate('members.user') needs the 'User'
// model registered with Mongoose - required here so this module works
// standalone instead of relying on some other file having loaded it first.
require('../models/User');
const { sendReminderEmail } = require('./email');

const THRESHOLD_HOURS = {
  Daily: 24,
  Weekly: 24 * 7,
  Biweekly: 24 * 14,
};

function hoursSince(date) {
  return (Date.now() - date.getTime()) / (1000 * 60 * 60);
}

// Runs through every group, by frequency, and emails any member who hasn't
// had a verified submission since they joined within their group's window -
// skipping anyone already reminded within that same window.
async function checkReminders() {
  let sentCount = 0;

  for (const [frequency, thresholdHours] of Object.entries(THRESHOLD_HOURS)) {
    const groups = await Group.find({ frequency }).populate({
      path: 'members.user',
      select: 'email',
    });

    for (const group of groups) {
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

        const sent = await sendReminderEmail(user.email, group.focus, frequency);
        if (sent) {
          member.lastReminderSentAt = new Date();
          await group.save();
          sentCount += 1;
        }
      }
    }
  }

  console.log(`[reminders] sent ${sentCount} reminder email${sentCount === 1 ? '' : 's'}`);
}

module.exports = { checkReminders };
