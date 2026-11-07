
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
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

    // 2. Validate the submitted invitation details.
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

    // 3. Get the active organization.
    const organizationId = session.session.activeOrganizationId;

    if (!organizationId) {
      return Response.json(
        { message: "No active organization selected." },
        { status: 400 }
      );
    }

    // 4. Verify the user's membership and role.
    const membership = await prisma.member.findFirst({
      where: {
        userId: session.user.id,
        organizationId,
      },
      select: {
        role: true,
      },
    });

    if (!membership) {
      return Response.json(
        { message: "You are not a member of this organization." },
        { status: 403 }
      );
    }

    // 5. Enforce Flowzen's invitation role rules.
    const canInvite =
      membership.role === "owner" ||
      (membership.role === "admin" &&
        validation.data.role === "member");

    if (!canInvite) {
      return Response.json(
        {
          message:
            "You do not have permission to invite someone with this role.",
        },
        { status: 403 }
      );
    }

    // 6. Let Better Auth create and process the invitation.
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
