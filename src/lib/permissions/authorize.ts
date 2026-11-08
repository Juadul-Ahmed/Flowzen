import prisma from "@/lib/prisma";
import { hasPermission, type Permission } from "./permissions";
import { isRole } from "./roles";

type AuthorizeOptions = {
  userId: string;
  organizationId: string;
  permission: Permission;
};

type AuthorizationResult =
  | {
      allowed: true;
      role: import("./roles").Role;
    }
  | {
      allowed: false;
      reason: "NOT_A_MEMBER" | "INSUFFICIENT_PERMISSION";
    };

export async function authorize({
  userId,
  organizationId,
  permission,
}: AuthorizeOptions): Promise<AuthorizationResult> {
  // 1. Verify membership in the requested organization.
  const membership = await prisma.member.findFirst({
    where: {
      userId,
      organizationId,
    },
    select: {
      role: true,
    },
  });
 

  if (!membership) {
    return {
      allowed: false,
      reason: "NOT_A_MEMBER",
    };
  }

  // 2. Reject unknown database role values.
  if (!isRole(membership.role)) {
    return {
      allowed: false,
      reason: "INSUFFICIENT_PERMISSION",
    };
  }

  // 3. Check the requested permission.
  if (!hasPermission(membership.role, permission)) {
    return {
      allowed: false,
      reason: "INSUFFICIENT_PERMISSION",
    };
  }

  return {
    allowed: true,
    role: membership.role,
  };
}