import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getSession } from "@/lib/auth";

export const instant = false;

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (!session.user.emailVerified) {
    redirect(
      `/verify-email?email=${encodeURIComponent(session.user.email)}`,
    );
  }

  return <DashboardShell>{children}</DashboardShell>;
}