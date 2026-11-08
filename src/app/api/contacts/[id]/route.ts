
import prisma from "@/lib/prisma";
import { authorizeCRMRequest } from "@/lib/permissions/crm-api";
import { PERMISSIONS } from "@/lib/permissions/permissions";
import { apiError, apiSuccess } from "@/lib/api/response";
import { contactSchema } from "@/lib/validations/contact";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const access = await authorizeCRMRequest({
      request,
      permission: PERMISSIONS.CONTACT_READ,
    });

    if (!access.success) return access.response;

    const { id } = await params;

    const contact = await prisma.contact.findFirst({
      where: {
        id,
        organizationId: access.organizationId,
        deletedAt: null,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        convertedFromLead: {
          select: {
            id: true,
            status: true,
            convertedAt: true,
          },
        },
      },
    });

    if (!contact) {
      return apiError({
        message: "Contact not found.",
        status: 404,
      });
    }

    return apiSuccess({
      message: "Contact retrieved successfully.",
      data: contact,
    });
  } catch (error) {
    console.error("Get contact error:", error);

    return apiError({
      message: "Failed to retrieve contact.",
      status: 500,
    });
  }
}

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const access = await authorizeCRMRequest({
      request,
      permission: PERMISSIONS.CONTACT_UPDATE,
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

    const validation = contactSchema.safeParse(body);

    if (!validation.success) {
      return apiError({
        message: "Invalid contact details.",
        status: 400,
        errors: validation.error.flatten(),
      });
    }

    const existingContact = await prisma.contact.findFirst({
      where: {
        id,
        organizationId: access.organizationId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!existingContact) {
      return apiError({
        message: "Contact not found.",
        status: 404,
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
        select: { id: true },
      });

      if (!company) {
        return apiError({
          message: "Selected company was not found.",
          status: 404,
        });
      }
    }

    const contact = await prisma.contact.update({
      where: {
        id,
        organizationId: access.organizationId,
      },
      data: {
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
      message: "Contact updated successfully.",
      data: contact,
    });
  } catch (error) {
    console.error("Update contact error:", error);

    return apiError({
      message: "Failed to update contact.",
      status: 500,
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const access = await authorizeCRMRequest({
      request,
      permission: PERMISSIONS.CONTACT_DELETE,
    });

    if (!access.success) return access.response;

    const { id } = await params;

    const existingContact = await prisma.contact.findFirst({
      where: {
        id,
        organizationId: access.organizationId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!existingContact) {
      return apiError({
        message: "Contact not found.",
        status: 404,
      });
    }

    await prisma.contact.update({
      where: {
        id,
        organizationId: access.organizationId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return apiSuccess({
      message: "Contact deleted successfully.",
      data: { id },
    });
  } catch (error) {
    console.error("Delete contact error:", error);

    return apiError({
      message: "Failed to delete contact.",
      status: 500,
    });
  }
}
