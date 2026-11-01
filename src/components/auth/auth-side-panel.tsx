
import {
  ArrowUpRight,
  ChartNoAxesCombined,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Customer management",
    description: "Keep leads, contacts, and companies organized.",
  },
  {
    icon: Workflow,
    title: "Sales automation",
    description: "Automate repetitive tasks and follow-ups.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Sales analytics",
    description: "Understand your pipeline and track performance.",
  },
];

export function AuthSidePanel() {
  return (
    <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden border-r border-border bg-card p-10 lg:flex xl:p-14">
      {/* Ambient green gradients */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />

      {/* Brand */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
            <Workflow className="h-5 w-5 text-white" />
          </div>

          <span className="text-xl font-bold tracking-tight text-foreground">
            Flowzen
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 my-16 max-w-xl space-y-10">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Your sales, simplified
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground xl:text-5xl">
            Turn customer relationships into{" "}
            <span className="text-primary">
              lasting growth.
            </span>
          </h1>

          <p className="max-w-lg text-base leading-7 text-muted">
            Flowzen brings your leads, customers, sales pipeline, and
            automation together in one intelligent workspace. Spend less
            time managing tasks and more time growing your business.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group flex items-start gap-4 rounded-xl border border-border bg-background/60 p-4 transition hover:border-primary/40 hover:bg-background"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    {feature.title}
                  </h3>

                  <p className="text-sm leading-6 text-muted">
                    {feature.description}
                  </p>
                </div>

                <ArrowUpRight className="h-4 w-4 text-muted transition group-hover:text-primary" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between text-xs text-muted">
        <p>© 2026 Flowzen. All rights reserved.</p>
        <p>Built for better business relationships.</p>
      </div>
    </section>
  );
}
