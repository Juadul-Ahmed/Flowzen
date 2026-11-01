
import Link from "next/link";
import { Workflow } from "lucide-react";

import ThemeToggle from "@/components/shared/ThemeToggle";
import { AuthSidePanel } from "@/components/auth/auth-side-panel";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="relative grid min-h-screen bg-background lg:grid-cols-[1fr_520px]">

      {/* Theme toggle */}
      <div className="absolute right-5 top-5 z-20">
        <ThemeToggle />
      </div>

      {/* Left promotional panel */}
      <AuthSidePanel />

      {/* Login section */}
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
              Welcome back
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Sign in to Flowzen
            </h2>

            <p className="text-sm leading-6 text-muted">
              Access your workspace and continue managing your
              sales relationships.
            </p>
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/5 sm:p-8">
            <LoginForm />
          </div>

          {/* Registration link */}
          <p className="text-center text-sm text-muted">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary transition hover:underline"
            >
              Create an account
            </Link>
          </p>

        </div>
      </section>
    </main>
  );
}
