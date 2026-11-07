
import { Users, Mail, ShieldCheck, Clock } from "lucide-react";

export default function MembersPage() {
  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Team Members
        </h1>
        <p className="mt-1 text-sm text-muted">
          Manage your organization members, roles, and invitations.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Members"
          value="1"
          description="People in your organization"
          icon={Users}
        />

        <StatCard
          title="Pending Invitations"
          value="0"
          description="Awaiting acceptance"
          icon={Mail}
        />

        <StatCard
          title="Available Roles"
          value="3"
          description="Owner, Admin, Member"
          icon={ShieldCheck}
        />
      </div>

      {/* Members section */}
      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-5">
          <h2 className="font-semibold text-foreground">
            Organization Members
          </h2>
          <p className="mt-1 text-sm text-muted">
            People who currently have access to this workspace.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
          <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Users size={22} />
          </div>

          <h3 className="font-medium text-foreground">
            Member list coming next
          </h3>

          <p className="mt-1 max-w-sm text-sm text-muted">
            We'll connect this section to your organization's actual
            membership records.
          </p>
        </div>
      </section>

      {/* Invitations section */}
      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-5">
          <h2 className="font-semibold text-foreground">
            Pending Invitations
          </h2>
          <p className="mt-1 text-sm text-muted">
            Track invitations sent to people you want to add.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
          <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Clock size={22} />
          </div>

          <h3 className="font-medium text-foreground">
            No invitations displayed yet
          </h3>

          <p className="mt-1 max-w-sm text-sm text-muted">
            We'll add the invitation management functionality next.
          </p>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted">{title}</p>

        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon size={19} />
        </div>
      </div>

      <p className="mt-4 text-3xl font-bold text-foreground">{value}</p>

      <p className="mt-1 text-xs text-muted">{description}</p>
    </div>
  );
}
