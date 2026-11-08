
"use client";

import { Users } from "lucide-react";

interface ContactsPageHeaderProps {
  totalContacts: number;
}

export default function ContactsPageHeader({
  totalContacts,
}: ContactsPageHeaderProps) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
          <Users size={20} />
        </div>

        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
          CRM Management
        </span>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
        Contacts
      </h1>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Manage your relationships and keep customer information organized.
      </p>

      <p className="mt-2 text-xs text-slate-400">
        {totalContacts}{" "}
        {totalContacts === 1 ? "contact" : "contacts"} in your organization
      </p>
    </div>
  );
}
