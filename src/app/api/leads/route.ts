
import prisma from "@/lib/prisma";
import { authorizeCRMRequest } from "@/lib/permissions/crm-api";
import { PERMISSIONS } from "@/lib/permissions/permissions";
import { apiError, apiSuccess } from "@/lib/api/response";
import { leadSchema } from "@/lib/validations/lead";
import { Prisma } from "@/generated/prisma/client";

export async function GET(request: Request) {
  try {
    const access = await authorizeCRMRequest({
      request,
      permission: PERMISSIONS.LEAD_READ,
    });

    if (!access.success) return access.response;

    const leads = await prisma.lead.findMany({
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
      },
    });

    return apiSuccess({
      message: "Leads retrieved successfully.",
      data: leads,
    });
  } catch (error) {
    console.error("Get leads error:", error);

    return apiError({
      message: "Failed to retrieve leads.",
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    const access = await authorizeCRMRequest({
      request,
      permission: PERMISSIONS.LEAD_CREATE,
    });

    if (!access.success) return access.response;

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

    const data = validation.data;

    // Lead creation cannot directly mark a lead as converted.
    if (data.status === "CONVERTED") {
      return apiError({
        message: "Use the lead conversion process to convert a lead.",
        status: 400,
      });
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

    const lead = await prisma.lead.create({
      data: {
        organizationId: access.organizationId,
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
      message: "Lead created successfully.",
      data: lead,
      status: 201,
    });
  } catch (error) {
    console.error("Create lead error:", error);

    return apiError({
      message: "Failed to create lead.",
      status: 500,
    });
  }
}
