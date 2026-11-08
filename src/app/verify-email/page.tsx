
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MailCheck, RefreshCw, Workflow } from "lucide-react";
import { Button, toast } from "@heroui/react";

import ThemeToggle from "@/components/shared/ThemeToggle";
import { authClient } from "@/lib/auth-client";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [isResending, setIsResending] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    console.log("Verification page email:", email);
    console.log(
      "Current session email:",
      session?.user?.email ?? "No session"
    );
    console.log(
      "Session email verified:",
      session?.user?.emailVerified ?? "No session"
    );
  }, [email, session, isPending]);

  const handleResend = async () => {
    if (!email) {
      toast.danger("Email address is missing. Please register or sign in again.");
      return;
    }

    setIsResending(true);

    try {
      const { error } = await authClient.sendVerificationEmail({
        email,
        callbackURL: "/dashboard",
      });

      if (error) {
        toast.danger(
          error.message || "Unable to resend verification email."
        );
        return;
      }

      toast.success("Verification email sent!", {
        description: "Please check your inbox.",
      });
    } catch (error) {
      console.error("Resend verification error:", error);
      toast.danger("Something went wrong. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-5 py-12">
      <div className="absolute right-5 top-5">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Workflow className="h-5 w-5 text-white" />
          </div>

          <span className="text-xl font-bold text-foreground">
            Flowzen
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-xl shadow-black/5">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MailCheck size={32} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Verify your email
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted">
            We've sent a verification link to:
          </p>

          <p className="mt-2 break-all font-semibold text-foreground">
            {email || "Your registered email address"}
          </p>

          <p className="mt-4 text-sm leading-6 text-muted">
            Please check your inbox and click the verification link
            to activate your Flowzen account.
          </p>

          <Button
            type="button"
            onPress={handleResend}
            isDisabled={isResending || !email}
            className="mt-8 w-full bg-primary font-semibold text-white"
          >
            <RefreshCw
              size={17}
              className={isResending ? "animate-spin" : ""}
            />
            {isResending ? "Sending..." : "Resend verification email"}
          </Button>

          <p className="mt-6 text-sm text-muted">
            Already verified?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
