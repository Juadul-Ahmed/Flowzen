
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
}

export default function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
}: StatCardProps) {
  const isPositive = trend === "up";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Card heading */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <div className="flex size-10 items-center justify-center rounded-lg bg-green-50 text-green-700">
          <Icon size={20} strokeWidth={1.8} />
        </div>
      </div>

      {/* Main value */}
      <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </h3>

      {/* Percentage change */}
      <div className="mt-2 flex items-center gap-2">
        <span
          className={`text-xs font-semibold ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? "↑" : "↓"} {change}
        </span>

        <span className="text-xs text-slate-400">
          vs. last month
        </span>
      </div>
    </div>
  );
}
