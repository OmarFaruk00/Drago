import nodemailer from "nodemailer";

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    // In dev, allow missing config and just log.
    if (process.env.NODE_ENV !== "production") {
      console.warn("[email] SMTP env vars missing, emails will be logged only.");
      return null;
    }
    throw new Error("SMTP configuration is missing");
  }

  const secure = port === 465;
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    ...(port === 587 && { requireTLS: true }),
  });
}

export async function sendPasswordResetEmail({ to, code, resetUrl }) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@example.com";
  const subject = "Your password reset code";
  const text = `We received a request to reset the password for your account.

Your verification code: ${code}

You can also reset your password using this link:
${resetUrl}

If you did not request this, you can safely ignore this email.`;

  const html = `
    <p>We received a request to reset the password for your account.</p>
    <p><strong>Your verification code:</strong></p>
    <p style="font-size: 24px; letter-spacing: 0.3em; font-weight: bold;">${code}</p>
    <p>You can also reset your password using this link:</p>
    <p><a href="${resetUrl}" target="_blank" rel="noopener noreferrer">${resetUrl}</a></p>
    <p>If you did not request this, you can safely ignore this email.</p>
  `;

  const transport = getTransport();
  if (!transport) {
    console.log("[email] sendPasswordResetEmail (no SMTP)", { to, code, resetUrl });
    return;
  }

  try {
    await transport.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
    console.log("[email] Password reset sent to", to);
  } catch (err) {
    console.error("[email] Send failed:", err.message);
    throw err;
  }
}

