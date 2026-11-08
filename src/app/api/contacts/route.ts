
import prisma from "@/lib/prisma";
import { authorizeCRMRequest } from "@/lib/permissions/crm-api";
import { PERMISSIONS } from "@/lib/permissions/permissions";
import { apiError, apiSuccess } from "@/lib/api/response";
import { contactSchema } from "@/lib/validations/contact";

export async function GET(request: Request) {
  try {
    const access = await authorizeCRMRequest({
      request,
      permission: PERMISSIONS.CONTACT_READ,
    });

    if (!access.success) {
      return access.response;
    }

    const contacts = await prisma.contact.findMany({
      where: {
        organizationId: access.organizationId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return apiSuccess({
      message: "Contacts retrieved successfully.",
      data: contacts,
    });
  } catch (error) {
    console.error("Get contacts error:", error);

    return apiError({
      message: "Failed to retrieve contacts.",
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    const access = await authorizeCRMRequest({
      request,
      permission: PERMISSIONS.CONTACT_CREATE,
    });

    if (!access.success) {
      return access.response;
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return apiError({
        message: "Invalid JSON request body.",
        status: 400,
      });
    }

    const validation = contactSchema.safeParse(body);

    if (!validation.success) {
      return apiError({
        message: "Invalid contact details.",
        status: 400,
        errors: validation.error.flatten(),
      });
    }

    const data = validation.data;

    // Verify that the selected company belongs to this organization.
    if (data.companyId) {
      const company = await prisma.company.findFirst({
        where: {
          id: data.companyId,
          organizationId: access.organizationId,
          deletedAt: null,
        },
        select: {
          id: true,
        },
      });

      if (!company) {
        return apiError({
          message: "Selected company was not found.",
          status: 404,
        });
      }
    }

    const contact = await prisma.contact.create({
      data: {
        organizationId: access.organizationId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || null,
        phone: data.phone || null,
        jobTitle: data.jobTitle || null,
        companyId: data.companyId || null,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return apiSuccess({
      message: "Contact created successfully.",
      data: contact,
      status: 201,
    });
  } catch (error) {
    console.error("Create contact error:", error);

    return apiError({
      message: "Failed to create contact.",
      status: 500,
    });
  }
}
