"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import InviteMemberForm from "@/components/organization/invite-member-form";
import Skeleton from "@/components/ui/Skeleton";
type MemberListResponse = Awaited<
  ReturnType<typeof authClient.organization.listMembers>
>;

type OrganizationMember = NonNullable<
  MemberListResponse["data"]
>["members"][number];

type InvitationRole = "admin" | "member";

export default function MembersPage() {
  const { data: activeOrganization } = authClient.useActiveOrganization();

  const { data: session } = authClient.useSession();

  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Find the current user's membership.
  const currentMember = members.find(
    (member) => member.userId === session?.user.id,
  );

  const currentRole = currentMember?.role;

  // Determine which roles the current user can assign.
  const canInvite = currentRole === "owner" || currentRole === "admin";

  const availableRoles: InvitationRole[] =
    currentRole === "owner"
      ? ["admin", "member"]
      : currentRole === "admin"
        ? ["member"]
        : [];

  // Fetch organization members.
  useEffect(() => {
    let isActive = true;

    async function fetchMembers() {
      if (!activeOrganization?.id) {
        if (isActive) {
          setMembers([]);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await authClient.organization.listMembers({
          query: {
            organizationId: activeOrganization.id,
            limit: 100,
            offset: 0,
          },
        });

        if (error) {
          throw new Error(error.message);
        }

        if (isActive) {
          setMembers(data?.members ?? []);
        }
      } catch (err) {
        if (isActive) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load organization members.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    fetchMembers();

    return () => {
      isActive = false;
    };
  }, [activeOrganization?.id]);

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Team Members</h1>

        <p className="mt-1 text-sm text-muted">
          Manage your organization members and invitations.
        </p>
      </div>

      {/* Member statistics */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm font-medium text-muted">Total Members</p>

          <p className="mt-3 text-3xl font-bold text-foreground">
            {isLoading ? "—" : members.length}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm font-medium text-muted">Your Role</p>

          <p className="mt-3 text-3xl font-bold capitalize text-foreground">
            {currentRole ?? "—"}
          </p>
        </div>
      </div>

      {/* Invitation form */}
      {canInvite && <InviteMemberForm availableRoles={availableRoles} />}

      {/* Organization members */}
      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-foreground">
                Organization Members
              </h2>

              <p className="mt-1 text-sm text-muted">
                {activeOrganization?.name ?? "No active organization"}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted">
              <Users size={18} />
              {members.length} members
            </div>
          </div>
        </div>

        <div className="space-y-4 p-5">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="text" className="h-4 w-36" />
                    <Skeleton variant="text" className="h-3 w-48" />
                  </div>

                  <Skeleton
                    variant="rectangular"
                    className="h-7 w-20 rounded-full"
                  />
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="py-8 text-center text-sm text-red-500">{error}</p>
          ) : members.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              No members found.
            </p>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {member.user.name}
                  </p>

                  <p className="text-sm text-muted">{member.user.email}</p>
                </div>

                <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary">
                  {member.role}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
