const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = 'PathToSWE <noreply@pathtoswe.me>';

async function sendVerificationCode(to, code) {
  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: 'Your PathToSWE verification code',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Verify your email</h2>
          <p>Enter this code to verify your PathToSWE account:</p>
          <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #c1443b; margin: 24px 0;">
            ${code}
          </p>
          <p style="color:#888; font-size:12px;">
            This code expires in 15 minutes. If you didn't create this account, you can safely ignore this email.
          </p>
        </div>
      `,
    });
    return true;
  } catch (err) {
    console.error('[email] Failed to send verification code:', err.message);
    return false;
  }
}

async function sendReminderEmail(to, groupTitle, daysPerWeek, questionsPerDay) {
  try {
    const schedule = `${questionsPerDay} question${questionsPerDay === 1 ? '' : 's'} on ${daysPerWeek} day${daysPerWeek === 1 ? '' : 's'} a week`;

    await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: `Time to practice - ${groupTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Time to practice</h2>
          <p>
            Your group <strong>${groupTitle}</strong> aims for <strong>${schedule}</strong>,
            and it's been a while since your last verified submission.
          </p>
          <p style="color:#888; font-size:12px;">
            Solve a problem on LeetCode or NeetCode to stay on track with your group.
          </p>
        </div>
      `,
    });
    return true;
  } catch (err) {
    console.error('[email] Failed to send reminder email:', err.message);
    return false;
  }
}

async function sendJoinRequestEmail(to, groupTitle, requesterName) {
  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: `${requesterName} wants to join ${groupTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>New join request</h2>
          <p>
            <strong>${requesterName}</strong> wants to join your study group
            <strong>${groupTitle}</strong>.
          </p>
          <p style="color:#888; font-size:12px;">
            Open PathToSWE to accept or deny this request.
          </p>
        </div>
      `,
    });
    return true;
  } catch (err) {
    console.error('[email] Failed to send join request email:', err.message);
    return false;
  }
}

module.exports = { sendVerificationCode, sendReminderEmail, sendJoinRequestEmail };