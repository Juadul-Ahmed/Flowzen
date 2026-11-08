
import { z } from "zod";

export const leadStatusSchema = z.enum([
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "UNQUALIFIED",
  "LOST",
  "CONVERTED",
]);

export const leadSchema = z.object({
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

  source: z
    .string()
    .trim()
    .max(100, "Lead source cannot exceed 100 characters.")
    .optional()
    .or(z.literal("")),

  status: leadStatusSchema.default("NEW"),

  notes: z
    .string()
    .trim()
    .max(2000, "Notes cannot exceed 2000 characters.")
    .optional()
    .or(z.literal("")),

  companyId: z
    .string()
    .optional()
    .or(z.literal("")),

  assignedToId: z
    .string()
    .optional()
    .or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type LeadStatusInput = z.infer<typeof leadStatusSchema>;
