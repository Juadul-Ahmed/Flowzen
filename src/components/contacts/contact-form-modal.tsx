
"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Button,
  Input,
  Label,
  Modal,
  Surface,
  TextField,
  toast,
} from "@heroui/react";
import { Users } from "lucide-react";

import {
  contactSchema,
  type ContactInput,
} from "@/lib/validations/contact";
import type { Contact } from "@/components/contacts/contacts-table";

interface Company {
  id: string;
  name: string;
}

interface ContactFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  onSaved: () => void;
}

const emptyContact: ContactInput = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  jobTitle: "",
  companyId: "",
};

export default function ContactFormModal({
  isOpen,
  onOpenChange,
  contact,
  onSaved,
}: ContactFormModalProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = contact !== null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: emptyContact,
  });

  // Load available companies.
  useEffect(() => {
    const controller = new AbortController();

    async function loadCompanies() {
      try {
        const response = await fetch("/api/companies?limit=100", {
          signal: controller.signal,
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          return;
        }

        setCompanies(result.data?.companies ?? []);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Failed to load companies:", error);
        }
      }
    }

    loadCompanies();

    return () => controller.abort();
  }, []);

  // Reset the form whenever the modal opens or the selected contact changes.
  useEffect(() => {
    if (!isOpen) return;

    if (contact) {
      reset({
        firstName: contact.firstName ?? "",
        lastName: contact.lastName ?? "",
        email: contact.email ?? "",
        phone: contact.phone ?? "",
        jobTitle: contact.jobTitle ?? "",
        companyId: contact.company?.id ?? "",
      });
    } else {
      reset(emptyContact);
    }
  }, [isOpen, contact?.id, reset]);

  async function onSubmit(values: ContactInput) {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const url = contact
        ? `/api/contacts/${contact.id}`
        : "/api/contacts";

      const response = await fetch(url, {
        method: contact ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            `Failed to ${contact ? "update" : "create"} contact.`,
        );
      }

      toast.success(
        contact
          ? "Contact updated successfully."
          : "Contact created successfully.",
      );

      reset(emptyContact);
      onOpenChange(false);
      onSaved();
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
        { variant: "danger" },
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop>
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-lg">
            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                <Users className="size-5" />
              </Modal.Icon>

              <Modal.Heading>
                {isEditing ? "Edit contact" : "Add a new contact"}
              </Modal.Heading>

              <p className="mt-1.5 text-sm leading-5 text-muted">
                {isEditing
                  ? "Update this contact's information."
                  : "Add contact details and optionally associate them with a company."}
              </p>
            </Modal.Header>

            <Modal.Body className="p-6">
              <Surface variant="default">
                <form
                  id="contact-form"
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                      className="w-full"
                      name="firstName"
                      variant="secondary"
                      isInvalid={!!errors.firstName}
                    >
                      <Label>First name *</Label>
                      <Input
                        placeholder="Enter first name"
                        {...register("firstName")}
                      />
                    </TextField>

                    <TextField
                      className="w-full"
                      name="lastName"
                      variant="secondary"
                      isInvalid={!!errors.lastName}
                    >
                      <Label>Last name *</Label>
                      <Input
                        placeholder="Enter last name"
                        {...register("lastName")}
                      />
                    </TextField>
                  </div>

                  <TextField
                    className="w-full"
                    name="email"
                    type="email"
                    variant="secondary"
                    isInvalid={!!errors.email}
                  >
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      {...register("email")}
                    />
                  </TextField>

                  <TextField
                    className="w-full"
                    name="phone"
                    type="tel"
                    variant="secondary"
                    isInvalid={!!errors.phone}
                  >
                    <Label>Phone</Label>
                    <Input
                      type="tel"
                      placeholder="Enter phone number"
                      {...register("phone")}
                    />
                  </TextField>

                  <TextField
                    className="w-full"
                    name="jobTitle"
                    variant="secondary"
                    isInvalid={!!errors.jobTitle}
                  >
                    <Label>Job title</Label>
                    <Input
                      placeholder="e.g. Marketing Manager"
                      {...register("jobTitle")}
                    />
                  </TextField>

                  <div className="flex flex-col gap-2">
                    <Label>Company</Label>

                    <select
                      {...register("companyId")}
                      className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                    >
                      <option value="">No company</option>

                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </form>
              </Surface>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="secondary"
                onPress={() => onOpenChange(false)}
                isDisabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                form="contact-form"
                isDisabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditing
                    ? "Save changes"
                    : "Create contact"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
