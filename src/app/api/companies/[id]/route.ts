
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { authorizeCRMRequest } from "@/lib/permissions/crm-api";
import { PERMISSIONS } from "@/lib/permissions/permissions";
import { apiError, apiSuccess } from "@/lib/api/response";
import { companySchema } from "@/lib/validations/company";

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
      permission: PERMISSIONS.COMPANY_READ,
    });

    if (!access.success) {
      return access.response;
    }

    const { id } = await params;

    const company = await prisma.company.findFirst({
      where: {
        id,
        organizationId: access.organizationId,
        deletedAt: null,
      },
      include: {
        contacts: {
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
        },
        leads: {
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            contacts: true,
            leads: true,
          },
        },
      },
    });

    if (!company) {
      return apiError({
        message: "Company not found.",
        status: 404,
      });
    }

    return apiSuccess({
      message: "Company retrieved successfully.",
      data: company,
    });
  } catch (error) {
    console.error("Get company error:", error);

    return apiError({
      message: "Failed to retrieve company.",
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
      permission: PERMISSIONS.COMPANY_UPDATE,
    });

    if (!access.success) {
      return access.response;
    }

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

    const validation = companySchema.safeParse(body);

    if (!validation.success) {
      return apiError({
        message: "Invalid company details.",
        status: 400,
        errors: validation.error.flatten(),
      });
    }

    const existingCompany = await prisma.company.findFirst({
      where: {
        id,
        organizationId: access.organizationId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!existingCompany) {
      return apiError({
        message: "Company not found.",
        status: 404,
      });
    }

    const data = validation.data;

    const company = await prisma.company.update({
      where: {
        id,
        organizationId: access.organizationId,
      },
      data: {
        name: data.name,
        nameNormalized: data.name.toLowerCase(),
        website: data.website || null,
        industry: data.industry || null,
        phone: data.phone || null,
        address: data.address || null,
        description: data.description || null,
      },
    });

    return apiSuccess({
      message: "Company updated successfully.",
      data: company,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return apiError({
        message: "A company with this name already exists.",
        status: 409,
      });
    }

    console.error("Update company error:", error);

    return apiError({
      message: "Failed to update company.",
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
      permission: PERMISSIONS.COMPANY_DELETE,
    });

    if (!access.success) {
      return access.response;
    }

    const { id } = await params;

    const company = await prisma.company.findFirst({
      where: {
        id,
        organizationId: access.organizationId,
        deletedAt: null,
      },
      select: {
        id: true,
        _count: {
          select: {
            contacts: {
              where: { deletedAt: null },
            },
            leads: {
              where: { deletedAt: null },
            },
          },
        },
      },
    });

    if (!company) {
      return apiError({
        message: "Company not found.",
        status: 404,
      });
    }

    if (
      company._count.contacts > 0 ||
      company._count.leads > 0
    ) {
      return apiError({
        message:
          "This company cannot be deleted while it has active contacts or leads. Remove or reassign those records first.",
        status: 409,
      });
    }

    await prisma.company.update({
      where: {
        id,
        organizationId: access.organizationId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return apiSuccess({
      message: "Company deleted successfully.",
      data: { id },
    });
  } catch (error) {
    console.error("Delete company error:", error);

    return apiError({
      message: "Failed to delete company.",
      status: 500,
    });
  }
}
