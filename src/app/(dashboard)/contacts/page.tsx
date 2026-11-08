
"use client";

import { useEffect, useState } from "react";
import { Button, toast } from "@heroui/react";
import { Plus, RefreshCw } from "lucide-react";

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

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(
    null,
  );

  const [deletingContactId, setDeletingContactId] = useState<string | null>(
    null,
  );

  // Load contacts
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
          throw new Error(result.message || "Failed to load contacts.");
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

    return () => controller.abort();
  }, [refreshKey]);

  // Refresh contacts
  const handleRefresh = () => {
    setIsLoading(true);
    setRefreshKey((previous) => previous + 1);
  };

  // Open create modal
  const handleAddContact = () => {
    setSelectedContact(null);
    setIsContactModalOpen(true);
  };

  // Open edit modal
  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsContactModalOpen(true);
  };

  // Delete contact
  const handleDeleteContact = async (contact: Contact) => {
    if (deletingContactId) return;

    setDeletingContactId(contact.id);

    try {
      const response = await fetch(`/api/contacts/${contact.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete contact.");
      }

      toast.success("Contact deleted successfully.");

      handleRefresh();
    } catch (err) {
      toast(
        err instanceof Error
          ? err.message
          : "Something went wrong while deleting the contact.",
        { variant: "danger" },
      );
    } finally {
      setDeletingContactId(null);
    }
  };

  const contactsWithCompany = contacts.filter(
    (contact) => contact.company !== null,
  ).length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ContactsPageHeader totalContacts={contacts.length} />

        <Button
          className="bg-primary font-semibold text-white"
          onPress={handleAddContact}
        >
          <Plus size={18} />
          Add contact
        </Button>
      </div>

      {/* Shared Add/Edit Contact Modal */}
      <ContactFormModal
        isOpen={isContactModalOpen}
        onOpenChange={setIsContactModalOpen}
        contact={selectedContact}
        onSaved={handleRefresh}
      />

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
