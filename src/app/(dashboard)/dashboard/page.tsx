
import StatsOverview from "@/components/dashboard/overview/StatsOverview";
import RevenueChart from "@/components/dashboard/overview/RevenueChart";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <section>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Welcome back!
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Here's an overview of your sales and business performance.
        </p>
      </section>

      {/* KPI Cards */}
      <StatsOverview />

      {/* Revenue Analytics */}
      <RevenueChart />
    </div>
  );
}
