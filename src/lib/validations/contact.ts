
import { z } from "zod";

export const contactSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(80, "First name cannot exceed 80 characters."),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(80, "Last name cannot exceed 80 characters."),

  email: z
    .string()
    .trim()
    .max(255, "Email cannot exceed 255 characters.")
    .refine(
      (value) => !value || z.email().safeParse(value).success,
      "Please enter a valid email address.",
    )
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .trim()
    .max(30, "Phone number cannot exceed 30 characters.")
    .optional()
    .or(z.literal("")),

  jobTitle: z
    .string()
    .trim()
    .max(100, "Job title cannot exceed 100 characters.")
    .optional()
    .or(z.literal("")),

  companyId: z
    .string()
    .optional()
    .or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
