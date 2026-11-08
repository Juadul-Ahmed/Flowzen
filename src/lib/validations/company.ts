
import { z } from "zod";

export const companySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters.")
    .max(120, "Company name cannot exceed 120 characters."),

  website: z
    .string()
    .trim()
    .max(255, "Website URL is too long.")
    .refine(
      (value) => !value || z.url().safeParse(value).success,
      "Please enter a valid website URL.",
    )
    .optional()
    .or(z.literal("")),

  industry: z
    .string()
    .trim()
    .max(100, "Industry cannot exceed 100 characters.")
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .trim()
    .max(30, "Phone number cannot exceed 30 characters.")
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .trim()
    .max(255, "Address cannot exceed 255 characters.")
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters.")
    .optional()
    .or(z.literal("")),
});

export type CompanyInput = z.infer<typeof companySchema>;
