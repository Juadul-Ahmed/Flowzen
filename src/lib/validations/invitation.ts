import { z } from "zod";

export const inviteMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),

  role: z.enum(["admin", "member"], {
    message: "Please select a valid role",
  }),
});

export type InviteMemberValues = z.infer<
  typeof inviteMemberSchema
>;