
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { authorizeCRMRequest } from "@/lib/permissions/crm-api";
import { PERMISSIONS } from "@/lib/permissions/permissions";
import { apiError, apiSuccess } from "@/lib/api/response";
import { leadConversionSchema } from "@/lib/validations/lead-conversion";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const access = await authorizeCRMRequest({
      request,
      permission: PERMISSIONS.LEAD_CONVERT,
    });

    if (!access.success) return access.response;

    const { id } = await params;

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return apiError({
        message: "Invalid JSON request body.",
        status: 400,
      });
    }

    const validation = leadConversionSchema.safeParse(body);

    if (!validation.success) {
      return apiError({
        message: "Invalid conversion details.",
        status: 400,
        errors: validation.error.flatten(),
      });
    }

    const data = validation.data;

    const result = await prisma.$transaction(async (tx) => {
      // Find the lead inside the active organization.
      const lead = await tx.lead.findFirst({
        where: {
          id,
          organizationId: access.organizationId,
          deletedAt: null,
        },
      });

      if (!lead) {
        throw new Error("LEAD_NOT_FOUND");
      }

      if (lead.status === "CONVERTED" || lead.convertedAt) {
        throw new Error("LEAD_ALREADY_CONVERTED");
      }

      // Resolve the company relationship.
      let companyId: string | null = lead.companyId;

      if (data.companyOption === "CREATE_NEW") {
        const company = await tx.company.create({
          data: {
            organizationId: access.organizationId,
            name: data.company!.name,
            nameNormalized: data.company!.name.trim().toLowerCase(),
            website: data.company!.website || null,
            industry: data.company!.industry || null,
            phone: data.company!.phone || null,
          },
          select: { id: true },
        });

        companyId = company.id;
      }

      if (data.companyOption === "LINK_EXISTING") {
        const company = await tx.company.findFirst({
          where: {
            id: data.existingCompanyId!,
            organizationId: access.organizationId,
            deletedAt: null,
          },
          select: { id: true },
        });

        if (!company) {
          throw new Error("COMPANY_NOT_FOUND");
        }

        companyId = company.id;
      }

      // Resolve the contact relationship.
      let contactId: string;

      if (data.contactOption === "CREATE_NEW") {
        const contact = await tx.contact.create({
          data: {
            organizationId: access.organizationId,
            firstName: data.contact!.firstName,
            lastName: data.contact!.lastName,
            email: data.contact!.email || lead.email,
            phone: data.contact!.phone || lead.phone,
            jobTitle: data.contact!.jobTitle || null,
            companyId,
          },
          select: { id: true },
        });

        contactId = contact.id;
      } else {
        const contact = await tx.contact.findFirst({
          where: {
            id: data.existingContactId!,
            organizationId: access.organizationId,
            deletedAt: null,
          },
          select: {
            id: true,
            companyId: true,
          },
        });

        if (!contact) {
          throw new Error("CONTACT_NOT_FOUND");
        }

        // Do not silently replace an existing company relationship.
        if (
          companyId &&
          contact.companyId &&
          contact.companyId !== companyId
        ) {
          throw new Error("CONTACT_COMPANY_CONFLICT");
        }

        if (companyId && !contact.companyId) {
          await tx.contact.update({
            where: {
              id: contact.id,
              organizationId: access.organizationId,
            },
            data: { companyId },
          });
        }

        contactId = contact.id;
      }

      // Preserve the lead and record its conversion history.
      const updatedLead = await tx.lead.update({
        where: {
          id,
          organizationId: access.organizationId,
        },
        data: {
          status: "CONVERTED",
          convertedAt: new Date(),
          convertedContactId: contactId,
          convertedCompanyId: companyId,
        },
        include: {
          convertedContact: true,
          convertedCompany: true,
        },
      });

      return updatedLead;
    });

    return apiSuccess({
      message: "Lead converted successfully.",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      const errors: Record<string, { message: string; status: number }> = {
        LEAD_NOT_FOUND: {
          message: "Lead not found.",
          status: 404,
        },
        LEAD_ALREADY_CONVERTED: {
          message: "This lead has already been converted.",
          status: 409,
        },
        COMPANY_NOT_FOUND: {
          message: "Selected company was not found.",
          status: 404,
        },
        CONTACT_NOT_FOUND: {
          message: "Selected contact was not found.",
          status: 404,
        },
        CONTACT_COMPANY_CONFLICT: {
          message:
            "The selected contact is already linked to a different company.",
          status: 409,
        },
      };

      const knownError = errors[error.message];

      if (knownError) {
        return apiError(knownError);
      }
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return apiError({
        message:
          "This contact or company is already linked to another conversion, or the company name already exists.",
        status: 409,
      });
    }

    console.error("Convert lead error:", error);

    return apiError({
      message: "Failed to convert lead.",
      status: 500,
    });
  }
}
