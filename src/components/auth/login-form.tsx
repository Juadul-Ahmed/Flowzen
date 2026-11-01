
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, toast, FieldError, Input, Label, TextField } from "@heroui/react";
import { useRouter } from "next/navigation";

import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/validations/auth";

import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.danger(error.message || "Login failed. Please check your credentials.");
        return;
      }

      toast.success("Login successful!", {
        description: "Welcome back to Flowzen.",
      });

      router.push("/dashboard");
    } catch {
      toast.danger("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
          placeholder="Enter your password"
          autoComplete="current-password"
          {...register("password")}
        />
        <FieldError>{errors.password?.message}</FieldError>
      </TextField>

      <Button
        type="submit"
        className="w-full bg-primary font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.99]"
        isDisabled={isSubmitting}
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
