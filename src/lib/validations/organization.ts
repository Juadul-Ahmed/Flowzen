import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Organization name must be at least 2 characters")
    .max(50, "Organization name cannot exceed 50 characters"),
});

export type CreateOrganizationValues = z.infer<
  typeof createOrganizationSchema
>;