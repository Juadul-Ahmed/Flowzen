import { ROLES, type Role } from "./roles";

export const PERMISSIONS = {
  ORGANIZATION_READ: "organization.read",
  ORGANIZATION_UPDATE: "organization.update",
  ORGANIZATION_DELETE: "organization.delete",

  MEMBER_READ: "member.read",
  MEMBER_INVITE_MEMBER: "member.invite_member",
  MEMBER_INVITE_ADMIN: "member.invite_admin",
  MEMBER_UPDATE_ROLE: "member.update_role",
  MEMBER_REMOVE: "member.remove",
} as const;

export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  [ROLES.OWNER]: [
    PERMISSIONS.ORGANIZATION_READ,
    PERMISSIONS.ORGANIZATION_UPDATE,
    PERMISSIONS.ORGANIZATION_DELETE,
    PERMISSIONS.MEMBER_READ,
    PERMISSIONS.MEMBER_INVITE_MEMBER,
    PERMISSIONS.MEMBER_INVITE_ADMIN,
    PERMISSIONS.MEMBER_UPDATE_ROLE,
    PERMISSIONS.MEMBER_REMOVE,
  ],

  [ROLES.ADMIN]: [
    PERMISSIONS.ORGANIZATION_READ,
    PERMISSIONS.ORGANIZATION_UPDATE,
    PERMISSIONS.MEMBER_READ,
    PERMISSIONS.MEMBER_INVITE_MEMBER,
    PERMISSIONS.MEMBER_REMOVE,
  ],

  [ROLES.MEMBER]: [
    PERMISSIONS.ORGANIZATION_READ,
  ],
};

export function hasPermission(
  role: Role,
  permission: Permission
): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}