
import { auth } from "@/lib/auth";
import { authorize } from "@/lib/permissions/authorize";
import type { Permission } from "@/lib/permissions/permissions";
import type { Role } from "@/lib/permissions/roles";

type Session = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>;

type CRMApiSuccess = {
  success: true;
  user: Session["user"];
  organizationId: string;
  role: Role;
};

type CRMApiFailure = {
  success: false;
  response: Response;
};

export type CRMApiResult = CRMApiSuccess | CRMApiFailure;

type CRMApiOptions = {
  request: Request;
  permission: Permission;
};

export async function authorizeCRMRequest({
  request,
  permission,
}: CRMApiOptions): Promise<CRMApiResult> {
  // 1. Authenticate the request.
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return {
      success: false,
      response: Response.json(
        { message: "You must be logged in." },
        { status: 401 },
      ),
    };
  }

  // 2. Get the active organization from the session.
  const organizationId = session.session.activeOrganizationId;

  if (!organizationId) {
    return {
      success: false,
      response: Response.json(
        { message: "No active organization selected." },
        { status: 400 },
      ),
    };
  }

  // 3. Verify membership and permission.
  console.log("CRM API PERMISSION:", permission);
  const authorization = await authorize({
    userId: session.user.id,
    organizationId,
    permission,
  });

  if (!authorization.allowed) {
    return {
      success: false,
      response: Response.json(
        { message: "You do not have permission to perform this action." },
        { status: 403 },
      ),
    };
  }

  // 4. Return trusted request context.
  return {
    success: true,
    user: session.user,
    organizationId,
    role: authorization.role,
  };
}
