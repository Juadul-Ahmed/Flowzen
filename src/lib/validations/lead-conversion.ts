
import { z } from "zod";

export const leadConversionSchema = z
  .object({
    contactOption: z.enum(["CREATE_NEW", "LINK_EXISTING"]),

    existingContactId: z
      .string()
      .optional()
      .or(z.literal("")),

    contact: z
      .object({
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
      })
      .optional(),

    companyOption: z.enum([
      "NONE",
      "CREATE_NEW",
      "LINK_EXISTING",
    ]),

    existingCompanyId: z
      .string()
      .optional()
      .or(z.literal("")),

    company: z
      .object({
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
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.contactOption === "CREATE_NEW" &&
      !data.contact
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["contact"],
        message: "Contact details are required.",
      });
    }

    if (
      data.contactOption === "LINK_EXISTING" &&
      !data.existingContactId
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["existingContactId"],
        message: "Please select an existing contact.",
      });
    }

    if (
      data.companyOption === "CREATE_NEW" &&
      !data.company
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["company"],
        message: "Company details are required.",
      });
    }

    if (
      data.companyOption === "LINK_EXISTING" &&
      !data.existingCompanyId
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["existingCompanyId"],
        message: "Please select an existing company.",
      });
    }
  });

export type LeadConversionInput = z.infer<
  typeof leadConversionSchema
>;
