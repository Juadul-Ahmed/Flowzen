
"use client";

import { useState, type FormEvent } from "react";
import { Mail, Send } from "lucide-react";

type InvitationRole = "admin" | "member";

interface InviteMemberFormProps {
  availableRoles: InvitationRole[];
}

export default function InviteMemberForm({
  availableRoles,
}: InviteMemberFormProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InvitationRole>(
    availableRoles[0] ?? "member"
  );
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!availableRoles.includes(role)) {
      setErrorMessage("You cannot assign this role.");
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch("/api/organization/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to create invitation."
        );
      }

      setSuccessMessage("Invitation created successfully.");
      setEmail("");
      setRole(availableRoles[0] ?? "member");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setIsSending(false);
    }
  }

  if (availableRoles.length === 0) {
    return null;
  }

  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="border-b border-border p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Mail size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-foreground">
              Invite a Team Member
            </h2>
            <p className="mt-1 text-sm text-muted">
              Send an invitation to join your organization.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="invite-email"
              className="text-sm font-medium text-foreground"
            >
              Email Address
            </label>

            <input
              id="invite-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="colleague@example.com"
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="invite-role"
              className="text-sm font-medium text-foreground"
            >
              Assign Role
            </label>

            <select
              id="invite-role"
              value={role}
              onChange={(event) =>
                setRole(event.target.value as InvitationRole)
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            >
              {availableRoles.map((availableRole) => (
                <option key={availableRole} value={availableRole}>
                  {availableRole.charAt(0).toUpperCase() +
                    availableRole.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {successMessage && (
          <p className="text-sm text-green-600">
            {successMessage}
          </p>
        )}

        {errorMessage && (
          <p className="text-sm text-red-500">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSending}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={16} />
          {isSending ? "Sending..." : "Send Invitation"}
        </button>
      </form>
    </section>
  );
}
