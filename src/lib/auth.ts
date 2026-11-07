import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization } from "better-auth/plugins";

import prisma from "./prisma";
import { headers } from "next/headers";
import { sendEmail } from "./email";

// Escape dynamic values before inserting them into HTML emails.
function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  // Email verification through Resend.
  emailVerification: {
    async sendVerificationEmail({ user, url }) {
      await sendEmail({
        to: user.email,
        subject: "Verify your Flowzen email address",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; padding: 32px;">
            <h1 style="color: #166534;">Verify your email</h1>
            <p>Hello ${escapeHtml(user.name || "there")},</p>
            <p>Please verify your email address to continue using Flowzen.</p>
            <a
              href="${escapeHtml(url)}"
              style="display: inline-block; padding: 12px 24px; background: #166534; color: white; text-decoration: none; border-radius: 8px;"
            >
              Verify email address
            </a>
            <p style="margin-top: 24px; color: #666; font-size: 13px;">
              If you didn't request this verification, you can ignore this email.
            </p>
          </div>
        `,
      });
    },
  },

  plugins: [
    organization({
      requireEmailVerificationOnInvitation: true,

      // Invitations expire after 7 days.
      invitationExpiresIn: 60 * 60 * 24 * 7,

      // Organization invitations through Resend.
      async sendInvitationEmail(data) {
        const appUrl = process.env.APP_URL;

        if (!appUrl) {
          throw new Error("APP_URL is not configured.");
        }

        const inviteLink = `${appUrl}/accept-invitation/${data.id}`;

        await sendEmail({
          to: data.email,
          subject: `You're invited to join ${data.organization.name} on Flowzen`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; padding: 32px;">
              <h1 style="color: #166534;">You're invited!</h1>
              <p>
                ${escapeHtml(data.inviter.user.name || "An organization member")}
                has invited you to join
                <strong>${escapeHtml(data.organization.name)}</strong>
                on Flowzen.
              </p>
              <p>
                Your assigned role:
                <strong>${escapeHtml(data.role)}</strong>
              </p>
              <a
                href="${escapeHtml(inviteLink)}"
                style="display: inline-block; padding: 12px 24px; background: #166534; color: white; text-decoration: none; border-radius: 8px;"
              >
                Accept invitation
              </a>
              <p style="margin-top: 24px; color: #666; font-size: 13px;">
                This invitation expires in 7 days.
              </p>
            </div>
          `,
        });
      },
    }),
  ],
});

export const getSession = async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
};