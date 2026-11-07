
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AcceptInvitationPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const invitationId = params.id;

  const { data: session, isPending } = authClient.useSession();

  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleAcceptInvitation() {
    setIsAccepting(true);
    setError("");

    try {
      const result = await authClient.organization.acceptInvitation({
        invitationId,
      });

      if (result.error) {
        setError(
          result.error.message || "Unable to accept this invitation."
        );
        return;
      }

      setSuccess(true);

      router.push("/settings/members");
      router.refresh();
    } catch (error) {
      console.error("Invitation acceptance error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsAccepting(false);
    }
  }

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <p className="text-sm text-default-500">
          Checking your account...
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-default-200 bg-content1 p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10 text-2xl text-success">
            <span aria-hidden="true">✉</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            You're invited!
          </h1>

          <p className="mt-2 text-sm leading-6 text-default-500">
            You've been invited to join an organization on Flowzen.
            Accept the invitation to become a member.
          </p>
        </div>

        {success ? (
          <div className="rounded-xl bg-success/10 p-4 text-center text-sm text-success">
            Invitation accepted successfully. Redirecting...
          </div>
        ) : !session ? (
          <div className="space-y-4">
            <p className="rounded-xl bg-default-100 p-4 text-sm text-default-600">
              Please sign in using the email address that received this
              invitation. Return to this page after signing in.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-xl bg-default-100 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-default-500">
                Signed in as
              </p>

              <p className="mt-1 break-all text-sm font-medium">
                {session.user.email}
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-danger/20 bg-danger/10 p-3 text-sm text-danger"
              >
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleAcceptInvitation}
              disabled={isAccepting}
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isAccepting ? "Accepting invitation..." : "Accept invitation"}
            </button>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-default-400">
          Secure organization invitations powered by Flowzen.
        </p>
      </div>
    </main>
  );
}
