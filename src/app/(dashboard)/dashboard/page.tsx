import StatsOverview from "@/components/dashboard/overview/StatsOverview";
import RevenueChart from "@/components/dashboard/overview/RevenueChart";
import SalesPerformanceChart from "@/components/dashboard/overview/SalesPerformanceChart";
import RecentActivities from "@/components/dashboard/overview/RecentActivities";
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
      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
        <RevenueChart />
        <SalesPerformanceChart />
      </div>

      <RecentActivities  />
    </div>
  );
}
