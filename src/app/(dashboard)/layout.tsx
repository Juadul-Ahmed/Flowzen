import type { ReactNode } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <DashboardSidebar />

      <div className="min-w-0 flex-1">
        <DashboardHeader />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}