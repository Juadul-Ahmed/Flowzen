
import ThemeToggle from "@/components/shared/ThemeToggle";
import CreateOrganizationForm from "@/components/organization/create-organization-form";

export default function OnboardingPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="absolute right-5 top-5">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white shadow-lg shadow-primary/20">
            F
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Set up your workspace
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted">
            Welcome to Flowzen! Create your organization to start managing
            your customers, sales, and team in one place.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Create your organization
            </h2>
            <p className="mt-1 text-sm text-muted">
              You can invite team members after setup.
            </p>
          </div>

          <CreateOrganizationForm />
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          By continuing, you're setting up a workspace on Flowzen.
        </p>
      </div>
    </main>
  );
}
