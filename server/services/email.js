const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendVerificationCode(to, code) {
  try {
    await resend.emails.send({
      from: 'PathToSWE <onboarding@resend.dev>',
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

module.exports = { sendVerificationCode };