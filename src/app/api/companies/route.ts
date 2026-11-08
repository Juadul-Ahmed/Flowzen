import prisma from "@/lib/prisma";
import { authorizeCRMRequest } from "@/lib/permissions/crm-api";
import { PERMISSIONS } from "@/lib/permissions/permissions";
import { apiError, apiSuccess } from "@/lib/api/response";
import { companySchema } from "@/lib/validations/company";
import { Prisma } from "@/generated/prisma/client";
console.log("PERMISSIONS OBJECT:", PERMISSIONS);
console.log("PERMISSION KEYS:", Object.keys(PERMISSIONS));
export async function GET(request: Request) {
  try {
    const access = await authorizeCRMRequest({
      request,
      permission: PERMISSIONS.COMPANY_READ,
    });

    if (!access.success) {
      return access.response;
    }

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";

    const page = Math.max(
      1,
      Number.parseInt(searchParams.get("page") || "1", 10) || 1,
    );

    const requestedLimit = Number.parseInt(
      searchParams.get("limit") || "10",
      10,
    );

    const limit = Math.min(
      100,
      Math.max(1, Number.isNaN(requestedLimit) ? 10 : requestedLimit),
    );

    const allowedSortFields = ["name", "createdAt", "industry"] as const;

    type CompanySortField = (typeof allowedSortFields)[number];

    const requestedSort = searchParams.get("sortBy");

    const sortBy: CompanySortField = allowedSortFields.includes(
      requestedSort as CompanySortField,
    )
      ? (requestedSort as CompanySortField)
      : "createdAt";

    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    const skip = (page - 1) * limit;

const where: Prisma.CompanyWhereInput = {
  organizationId: access.organizationId,
  deletedAt: null,
  ...(search
    ? {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            industry: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            website: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }
    : {}),
};

    
const [companies, total] = await Promise.all([
  prisma.company.findMany({
    where,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
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
  }),

  prisma.company.count({ where }),
]);


    
return apiSuccess({
  message: "Companies retrieved successfully.",
  data: {
    companies,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    },
  },
});

  } catch (error) {
    console.error("Get companies error:", error);

    return apiError({
      message: "Failed to retrieve companies.",
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    const access = await authorizeCRMRequest({
      request,
      permission: PERMISSIONS.COMPANY_CREATE,
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

    const validation = companySchema.safeParse(body);

    if (!validation.success) {
      return apiError({
        message: "Invalid company details.",
        status: 400,
        errors: validation.error.flatten(),
      });
    }

    const data = validation.data;

    const company = await prisma.company.create({
      data: {
        organizationId: access.organizationId,
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
      message: "Company created successfully.",
      data: company,
      status: 201,
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

    console.error("Create company error:", error);

    return apiError({
      message: "Failed to create company.",
      status: 500,
    });
  }
}
