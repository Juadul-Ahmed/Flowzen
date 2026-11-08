
"use client";

import { Button } from "@heroui/react";
import {
  Building2,
  Mail,
  Phone,
  Pencil,
} from "lucide-react";

import DeleteContactDialog from "@/components/contacts/delete-contact-dialog";

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  jobTitle: string | null;
  company: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
}

interface ContactsTableProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

export default function ContactsTable({
  contacts,
  onEdit,
  onDelete,
}: ContactsTableProps) {
  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
          <Building2 size={24} />
        </div>

        <h3 className="font-semibold text-foreground">
          No contacts yet
        </h3>

        <p className="mt-1 max-w-sm text-sm text-muted">
          Your contacts will appear here once you add them to your organization.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
            <th className="px-4 py-3 font-medium">Contact</th>
            <th className="px-4 py-3 font-medium">Company</th>
            <th className="px-4 py-3 font-medium">Phone</th>
            <th className="px-4 py-3 font-medium">Date added</th>
            <th className="px-4 py-3 text-right font-medium">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {contacts.map((contact) => (
            <tr
              key={contact.id}
              className="transition-colors hover:bg-secondary/40"
            >
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {contact.firstName.charAt(0)}
                    {contact.lastName.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <p className="font-medium text-foreground">
                      {contact.firstName} {contact.lastName}
                    </p>

                    <p className="mt-1 flex items-center gap-1 truncate text-xs text-muted">
                      <Mail size={12} />
                      {contact.email || "No email"}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-4 py-4">
                <p className="font-medium text-foreground">
                  {contact.company?.name || "—"}
                </p>

                <p className="mt-1 text-xs text-muted">
                  {contact.jobTitle || "No job title"}
                </p>
              </td>

              <td className="px-4 py-4 text-muted">
                <span className="flex items-center gap-2">
                  <Phone size={14} />
                  {contact.phone || "—"}
                </span>
              </td>

              <td className="px-4 py-4 text-muted">
                {new Date(contact.createdAt).toLocaleDateString()}
              </td>

              <td className="px-4 py-4">
                <div className="flex justify-end gap-2">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="ghost"
                    aria-label={`Edit ${contact.firstName} ${contact.lastName}`}
                    onPress={() => onEdit(contact)}
                  >
                    <Pencil size={15} />
                  </Button>

                  <DeleteContactDialog
                    contactName={`${contact.firstName} ${contact.lastName}`}
                    onConfirm={() => onDelete(contact)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
