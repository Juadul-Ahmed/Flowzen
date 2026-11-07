import { auth } from "@/lib/auth";
import { authorize } from "@/lib/permissions/authorize";
import { PERMISSIONS } from "@/lib/permissions/permissions";
import { inviteMemberSchema } from "@/lib/validations/invitation";

export async function POST(request: Request) {
  try {
    // 1. Verify the current session.
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return Response.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    // 2. Validate invitation details.
    const body = await request.json();
    const validation = inviteMemberSchema.safeParse(body);

    if (!validation.success) {
      return Response.json(
        {
          message: "Invalid invitation details.",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    // 3. Get the active organization from the session.
    const organizationId = session.session.activeOrganizationId;

    if (!organizationId) {
      return Response.json(
        { message: "No active organization selected." },
        { status: 400 }
      );
    }

    // 4. Determine the required permission.
    const requiredPermission =
      validation.data.role === "admin"
        ? PERMISSIONS.MEMBER_INVITE_ADMIN
        : PERMISSIONS.MEMBER_INVITE_MEMBER;

    // 5. Check authorization.
    const authorization = await authorize({
      userId: session.user.id,
      organizationId,
      permission: requiredPermission,
    });

    if (!authorization.allowed) {
      return Response.json(
        {
          message:
            "You do not have permission to invite someone with this role.",
        },
        { status: 403 }
      );
    }

    // 6. Create the invitation through Better Auth.
    const invitation = await auth.api.createInvitation({
      headers: request.headers,
      body: {
        email: validation.data.email,
        role: validation.data.role,
        organizationId,
      },
    });

    return Response.json(
      {
        message: "Invitation created successfully.",
        invitation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Invitation creation error:", error);

    return Response.json(
      { message: "Failed to create invitation." },
      { status: 500 }
    );
  }
}