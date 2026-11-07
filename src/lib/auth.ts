
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization } from "better-auth/plugins";

import prisma from "./prisma";
import { headers } from "next/headers";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  plugins: [
    organization({
      requireEmailVerificationOnInvitation: true,

      // Invitations expire after 7 days.
      invitationExpiresIn: 60 * 60 * 24 * 7,

      // Development-only invitation delivery.
      async sendInvitationEmail(data) {
        const inviteLink = `${process.env.BETTER_AUTH_URL}/accept-invitation/${data.id}`;

        console.info("\n========== FLOWZEN INVITATION ==========");
        console.info("Recipient:", data.email);
        console.info("Organization:", data.organization.name);
        console.info("Invited by:", data.inviter.user.name);
        console.info("Invitation link:", inviteLink);
        console.info("========================================\n");
      },
    }),
  ],
});

export const getSession = async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
};
