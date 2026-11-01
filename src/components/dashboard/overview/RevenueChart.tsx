
"use client";

import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Skeleton from "@/components/ui/Skeleton";

interface RevenueChartProps {
  isLoading?: boolean;
}

const revenueData = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 18000 },
  { month: "Mar", revenue: 15000 },
  { month: "Apr", revenue: 24000 },
  { month: "May", revenue: 21000 },
  { month: "Jun", revenue: 32000 },
  { month: "Jul", revenue: 28000 },
  { month: "Aug", revenue: 38000 },
  { month: "Sep", revenue: 34000 },
  { month: "Oct", revenue: 45000 },
  { month: "Nov", revenue: 41000 },
  { month: "Dec", revenue: 52000 },
];

export default function RevenueChart({
  isLoading = false,
}: RevenueChartProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      {/* Chart heading */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Revenue Analytics
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Monthly revenue performance throughout the year.
        </p>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueData}
              margin={{
                top: 10,
                right: 10,
                left: -15,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#15803D"
                    stopOpacity={0.25}
                  />

                  <stop
                    offset="95%"
                    stopColor="#15803D"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E2E8F0"
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 12 }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 12 }}
                tickFormatter={(value: number) =>
                  `$${value / 1000}k`
                }
              />

              <Tooltip
                formatter={(value) => [
                  `$${Number(value).toLocaleString("en-US")}`,
                  "Revenue",
                ]}
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#15803D"
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
                activeDot={{
                  r: 6,
                  strokeWidth: 0,
                  fill: "#15803D",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.section>
  );
}
