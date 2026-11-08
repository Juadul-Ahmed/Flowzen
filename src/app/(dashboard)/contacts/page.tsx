
"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { RefreshCw } from "lucide-react";

import ContactsPageHeader from "@/components/contacts/contacts-page-header";
import ContactsStats from "@/components/contacts/contacts-stats";
import ContactsSkeleton from "@/components/contacts/contacts-skeleton";
import ContactsTable, {
  type Contact,
} from "@/components/contacts/contacts-table";
import ContactFormModal from "@/components/contacts/contact-form-modal";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadContacts() {
      try {
        const response = await fetch("/api/contacts", {
          method: "GET",
          signal: controller.signal,
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load contacts.",
          );
        }

        setContacts(result.data ?? []);
        setError(null);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading contacts.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadContacts();

    return () => {
      controller.abort();
    };
  }, [refreshKey]);

  const handleRefresh = () => {
    setIsLoading(true);
    setRefreshKey((previous) => previous + 1);
  };

  const handleEditContact = (contact: Contact) => {
    console.log("Edit contact:", contact.id);
  };

  const handleDeleteContact = (contact: Contact) => {
    console.log("Delete contact:", contact.id);
  };

  const contactsWithCompany = contacts.filter(
    (contact) => contact.company !== null,
  ).length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ContactsPageHeader totalContacts={contacts.length} />

        <ContactFormModal onCreated={handleRefresh} />
      </div>

      {/* Statistics */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="h-4 w-32 animate-pulse rounded bg-secondary" />
              <div className="mt-4 h-8 w-16 animate-pulse rounded bg-secondary" />
            </div>
          ))}
        </div>
      ) : (
        <ContactsStats
          totalContacts={contacts.length}
          contactsWithCompany={contactsWithCompany}
        />
      )}

      {/* Contacts table */}
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-foreground">
              All Contacts
            </h2>

            <p className="mt-1 text-sm text-muted">
              View and manage your organization's contacts.
            </p>
          </div>

          <Button
            variant="outline"
            onPress={handleRefresh}
            isDisabled={isLoading}
          >
            <RefreshCw size={15} />
            Refresh
          </Button>
        </div>

        <div className="p-5">
          {isLoading ? (
            <ContactsSkeleton />
          ) : error ? (
            <div className="py-10 text-center">
              <p className="text-sm text-danger">{error}</p>

              <Button
                className="mt-4"
                variant="outline"
                onPress={handleRefresh}
              >
                <RefreshCw size={15} />
                Try again
              </Button>
            </div>
          ) : (
            <ContactsTable
              contacts={contacts}
              onEdit={handleEditContact}
              onDelete={handleDeleteContact}
            />
          )}
        </div>

        {!isLoading && !error && contacts.length > 0 && (
          <div className="border-t border-border px-5 py-3">
            <p className="text-xs text-muted">
              Showing {contacts.length}{" "}
              {contacts.length === 1 ? "contact" : "contacts"}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
