
import prisma from "@/lib/prisma";
import { authorizeCRMRequest } from "@/lib/permissions/crm-api";
import { authorize } from "@/lib/permissions/authorize";
import { PERMISSIONS } from "@/lib/permissions/permissions";
import { apiError, apiSuccess } from "@/lib/api/response";
import { leadSchema } from "@/lib/validations/lead";
import { Prisma } from "@/generated/prisma/client";

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
      permission: PERMISSIONS.LEAD_READ,
    });

    if (!access.success) return access.response;

    const { id } = await params;

    const lead = await prisma.lead.findFirst({
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
        assignedTo: {
          select: {
            id: true,
            role: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        convertedContact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        convertedCompany: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!lead) {
      return apiError({
        message: "Lead not found.",
        status: 404,
      });
    }

    return apiSuccess({
      message: "Lead retrieved successfully.",
      data: lead,
    });
  } catch (error) {
    console.error("Get lead error:", error);

    return apiError({
      message: "Failed to retrieve lead.",
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
      permission: PERMISSIONS.LEAD_UPDATE,
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

    const validation = leadSchema.safeParse(body);

    if (!validation.success) {
      return apiError({
        message: "Invalid lead details.",
        status: 400,
        errors: validation.error.flatten(),
      });
    }

    const existingLead = await prisma.lead.findFirst({
      where: {
        id,
        organizationId: access.organizationId,
        deletedAt: null,
      },
      select: {
        id: true,
        status: true,
        assignedToId: true,
      },
    });

    if (!existingLead) {
      return apiError({
        message: "Lead not found.",
        status: 404,
      });
    }

    const data = validation.data;

    if (
      existingLead.status === "CONVERTED" ||
      data.status === "CONVERTED"
    ) {
      return apiError({
        message:
          "Converted leads cannot be edited through this endpoint.",
        status: 409,
      });
    }

    // Assignment changes require the dedicated assignment permission.
    if (data.assignedToId !== existingLead.assignedToId) {
      const assignmentAccess = await authorize({
        userId: access.user.id,
        organizationId: access.organizationId,
        permission: PERMISSIONS.LEAD_ASSIGN,
      });

      if (!assignmentAccess.allowed) {
        return apiError({
          message: "You do not have permission to assign leads.",
          status: 403,
        });
      }
    }

    // Verify the selected company belongs to this organization.
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

    // Verify the assigned member belongs to this organization.
    if (data.assignedToId) {
      const member = await prisma.member.findFirst({
        where: {
          id: data.assignedToId,
          organizationId: access.organizationId,
        },
        select: { id: true },
      });

      if (!member) {
        return apiError({
          message: "Selected organization member was not found.",
          status: 404,
        });
      }
    }

    const lead = await prisma.lead.update({
      where: {
        id,
        organizationId: access.organizationId,
      },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || null,
        phone: data.phone || null,
        source: data.source || null,
        status: data.status,
        notes: data.notes || null,
        companyId: data.companyId || null,
        assignedToId: data.assignedToId || null,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return apiSuccess({
      message: "Lead updated successfully.",
      data: lead,
    });
  } catch (error) {
    console.error("Update lead error:", error);

    return apiError({
      message: "Failed to update lead.",
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
      permission: PERMISSIONS.LEAD_DELETE,
    });

    if (!access.success) return access.response;

    const { id } = await params;

    const existingLead = await prisma.lead.findFirst({
      where: {
        id,
        organizationId: access.organizationId,
        deletedAt: null,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!existingLead) {
      return apiError({
        message: "Lead not found.",
        status: 404,
      });
    }

    if (existingLead.status === "CONVERTED") {
      return apiError({
        message: "Converted leads cannot be deleted.",
        status: 409,
      });
    }

    await prisma.lead.update({
      where: {
        id,
        organizationId: access.organizationId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return apiSuccess({
      message: "Lead deleted successfully.",
      data: { id },
    });
  } catch (error) {
    console.error("Delete lead error:", error);

    return apiError({
      message: "Failed to delete lead.",
      status: 500,
    });
  }
}
