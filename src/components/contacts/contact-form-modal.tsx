
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

interface Company {
  id: string;
  name: string;
}

interface ContactFormModalProps {
  onCreated: () => void;
}

export default function ContactFormModal({
  onCreated,
}: ContactFormModalProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      jobTitle: "",
      companyId: "",
    },
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadCompanies() {
      try {
        const response = await fetch("/api/companies?limit=100", {
          signal: controller.signal,
          cache: "no-store",
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setCompanies(result.data?.companies ?? []);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Failed to load companies:", error);
        }
      }
    }

    loadCompanies();

    return () => controller.abort();
  }, []);

  async function onSubmit(values: ContactInput) {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create contact.");
      }

      toast.success("Contact created successfully.");
      form.reset();
      onCreated();
    } catch (error) {
       toast(
    error instanceof Error
      ? error.message
      : "Something went wrong.",
    {
      variant: "danger",
    },
  );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal>
      <Button className="bg-primary font-semibold text-white">
        <Users size={18} />
        Add contact
      </Button>

      <Modal.Backdrop>
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-lg">
            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                <Users className="size-5" />
              </Modal.Icon>

              <Modal.Heading>Add a new contact</Modal.Heading>

              <p className="mt-1.5 text-sm leading-5 text-muted">
                Add contact details and optionally associate them with a company.
              </p>
            </Modal.Header>

            <Modal.Body className="p-6">
              <Surface variant="default">
                <form
                  id="contact-form"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                      className="w-full"
                      name="firstName"
                      variant="secondary"
                      isInvalid={!!form.formState.errors.firstName}
                    >
                      <Label>First name *</Label>
                      <Input
                        placeholder="Enter first name"
                        {...form.register("firstName")}
                      />
                    </TextField>

                    <TextField
                      className="w-full"
                      name="lastName"
                      variant="secondary"
                      isInvalid={!!form.formState.errors.lastName}
                    >
                      <Label>Last name *</Label>
                      <Input
                        placeholder="Enter last name"
                        {...form.register("lastName")}
                      />
                    </TextField>
                  </div>

                  <TextField
                    className="w-full"
                    name="email"
                    type="email"
                    variant="secondary"
                    isInvalid={!!form.formState.errors.email}
                  >
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      {...form.register("email")}
                    />
                  </TextField>

                  <TextField
                    className="w-full"
                    name="phone"
                    type="tel"
                    variant="secondary"
                    isInvalid={!!form.formState.errors.phone}
                  >
                    <Label>Phone</Label>
                    <Input
                      type="tel"
                      placeholder="Enter phone number"
                      {...form.register("phone")}
                    />
                  </TextField>

                  <TextField
                    className="w-full"
                    name="jobTitle"
                    variant="secondary"
                    isInvalid={!!form.formState.errors.jobTitle}
                  >
                    <Label>Job title</Label>
                    <Input
                      placeholder="e.g. Marketing Manager"
                      {...form.register("jobTitle")}
                    />
                  </TextField>

                  <div className="flex flex-col gap-2">
                    <Label>Company</Label>
                    <select
                      {...form.register("companyId")}
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
              <Button slot="close" variant="secondary">
                Cancel
              </Button>

              <Button
                type="submit"
                form="contact-form"
                isDisabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Create contact"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
