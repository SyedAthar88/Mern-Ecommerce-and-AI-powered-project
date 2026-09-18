import nodemailer from "nodemailer";
import { env } from "../config/env.js";

// ==========================================
// Transporter (created once, reused)
// ==========================================
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: false, // STARTTLS on port 587
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

// ==========================================
// Verify connection at startup (dev only)
// ==========================================
if (env.NODE_ENV === "development") {
  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ SMTP connection failed:", error.message);
    } else {
      console.log("✅ SMTP server ready to send emails");
    }
  });
}

// ==========================================
// Core send function
// ==========================================
export const sendEmail = async ({ to, subject, text, html }) => {
  const info = await transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });

  // In development, print preview URL for Ethereal
  if (env.NODE_ENV === "development") {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`📧 Email sent! Preview: ${previewUrl}`);
    }
  }

  return info;
};

// ==========================================
// Password reset email template
// ==========================================
export const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  const subject = "Password Reset Request";

  const text = `Hi ${name},

You requested to reset your password. Click the link below to set a new password:

${resetUrl}

This link expires in 15 minutes.

If you didn't request this, please ignore this email. Your password will remain unchanged.`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2>Password Reset Request</h2>
      <p>Hi ${name},</p>
      <p>You requested to reset your password. Click the button below:</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}"
           style="background: #2563eb; color: white; padding: 12px 24px;
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          Reset Password
        </a>
      </p>
      <p>Or copy this link: <br/><a href="${resetUrl}">${resetUrl}</a></p>
      <p><strong>This link expires in 15 minutes.</strong></p>
      <hr />
      <p style="color: #666; font-size: 12px;">
        If you didn't request this, ignore this email — your password won't change.
      </p>
    </div>
  `;

  return sendEmail({ to, subject, text, html });
};