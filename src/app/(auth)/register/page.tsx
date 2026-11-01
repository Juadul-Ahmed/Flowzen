
import Link from "next/link";
import { Workflow } from "lucide-react";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { AuthSidePanel } from "@/components/auth/auth-side-panel";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="relative grid min-h-screen bg-background lg:grid-cols-[1fr_520px]">

      {/* Theme toggle */}
      <div className="absolute right-5 top-5 z-20">
        <ThemeToggle />
      </div>

      {/* Left promotional panel */}
      <AuthSidePanel />

      {/* Registration section */}
      <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md space-y-8">

          {/* Mobile brand */}
          <div className="flex items-center justify-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Workflow className="h-5 w-5 text-white" />
            </div>

            <span className="text-xl font-bold text-foreground">
              Flowzen
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">
              Get started for free
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Create your account
            </h2>

            <p className="text-sm leading-6 text-muted">
              Set up your workspace and start managing your
              sales relationships with Flowzen.
            </p>
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/5 sm:p-8">
            <RegisterForm />
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary transition hover:underline"
            >
              Sign in
            </Link>
          </p>

          {/* Footer */}
          <p className="text-center text-xs text-muted">
            By creating an account, you agree to our Terms of
            Service and Privacy Policy.
          </p>
        </div>
      </section>
    </main>
  );
}
