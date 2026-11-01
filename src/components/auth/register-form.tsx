"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FieldError, Input, Label, TextField } from "@heroui/react";

import {
  registerSchema,
  type RegisterFormValues,
} from "@/lib/validations/auth";

import { authClient } from "@/lib/auth-client";

export function RegisterForm() {
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError("");

    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (error) {
      setServerError(error.message || "Registration failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <TextField isRequired isInvalid={!!errors.name}>
        <Label>Full name</Label>
        <Input
          placeholder="John Doe"
          autoComplete="name"
          {...register("name")}
        />
        <FieldError>{errors.name?.message}</FieldError>
      </TextField>

      <TextField isRequired isInvalid={!!errors.email}>
        <Label>Email address</Label>
        <Input
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
        />
        <FieldError>{errors.email?.message}</FieldError>
      </TextField>

      <TextField isRequired isInvalid={!!errors.password}>
        <Label>Password</Label>
        <Input
          type="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          {...register("password")}
        />
        <FieldError>{errors.password?.message}</FieldError>
      </TextField>

      {serverError && <p className="text-sm text-danger">{serverError}</p>}

      <Button
        type="submit"
        className="w-full bg-primary font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.99]"
        isDisabled={isSubmitting}
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
