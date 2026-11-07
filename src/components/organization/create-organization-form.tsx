
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FieldError,
  Input,
  Label,
  TextField,
  toast,
} from "@heroui/react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import {
  createOrganizationSchema,
  type CreateOrganizationValues,
} from "@/lib/validations/organization";
import { generateSlug } from "@/lib/utils/slug";

export default function CreateOrganizationForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOrganizationValues>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: CreateOrganizationValues) => {
    setIsSubmitting(true);

    try {
      const slug = generateSlug(values.name);

      if (!slug) {
        toast.danger("Please enter a valid organization name.");
        return;
      }

      // Check whether the generated slug is available.
      const { data: slugResult, error: slugError } =
        await authClient.organization.checkSlug({ slug });

      if (slugError) {
        toast.danger(slugError.message || "Unable to check organization slug.");
        return;
      }

      if (!slugResult?.status) {
        toast.warning("This organization URL is already taken.", {
          description: "Try a different organization name.",
        });
        return;
      }

      // Create the organization.
      const { data: organization, error: createError } =
        await authClient.organization.create({
          name: values.name,
          slug,
        });

      if (createError || !organization) {
        toast.danger(
          createError?.message || "Failed to create your organization.",
        );
        return;
      }

      // Set the newly created organization as active.
      const { error: activeError } =
        await authClient.organization.setActive({
          organizationId: organization.id,
        });

      if (activeError) {
        toast.warning("Organization created, but workspace activation failed.", {
          description: "Please try selecting your organization again.",
        });
        return;
      }

      toast.success("Workspace created successfully!", {
        description: `Welcome to ${organization.name}.`,
      });

      router.replace("/dashboard");
      router.refresh();
    } catch {
      toast.danger("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <TextField isRequired isInvalid={!!errors.name}>
        <Label>Organization name</Label>
        <Input
          placeholder="e.g. Acme Agency"
          autoComplete="organization"
          {...register("name")}
        />
        <FieldError>{errors.name?.message}</FieldError>
      </TextField>

      <Button
        type="submit"
        className="w-full bg-primary font-semibold text-white transition hover:brightness-110"
        isDisabled={isSubmitting}
      >
        {isSubmitting ? "Creating workspace..." : "Create workspace"}
      </Button>
    </form>
  );
}
