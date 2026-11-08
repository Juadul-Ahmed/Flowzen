import { Users, Building2 } from "lucide-react";

interface ContactsStatsProps {
  totalContacts: number;
  contactsWithCompany: number;
}

export default function ContactsStats({
  totalContacts,
  contactsWithCompany,
}: ContactsStatsProps) {
  const stats = [
    {
      label: "Total Contacts",
      value: totalContacts,
      icon: Users,
    },
    {
      label: "With Companies",
      value: contactsWithCompany,
      icon: Building2,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted">
                {stat.label}
              </p>
              <Icon size={19} className="text-primary" />
            </div>

            <p className="mt-3 text-3xl font-bold text-foreground">
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}