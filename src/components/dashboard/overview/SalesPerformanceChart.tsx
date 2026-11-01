"use client";

import { motion } from "framer-motion";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Skeleton from "@/components/ui/Skeleton";

interface SalesPerformanceChartProps {
  isLoading?: boolean;
}

const salesData = [
  { month: "Jan", leads: 120, won: 24, lost: 8 },
  { month: "Feb", leads: 145, won: 29, lost: 10 },
  { month: "Mar", leads: 138, won: 31, lost: 9 },
  { month: "Apr", leads: 170, won: 35, lost: 12 },
  { month: "May", leads: 190, won: 42, lost: 11 },
  { month: "Jun", leads: 210, won: 48, lost: 14 },
  { month: "Jul", leads: 225, won: 51, lost: 13 },
  { month: "Aug", leads: 240, won: 57, lost: 15 },
  { month: "Sep", leads: 230, won: 55, lost: 12 },
  { month: "Oct", leads: 260, won: 63, lost: 16 },
  { month: "Nov", leads: 275, won: 68, lost: 18 },
  { month: "Dec", leads: 300, won: 75, lost: 17 },
];
export default function SalesPerformanceChart({
  isLoading = false,
}: SalesPerformanceChartProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Sales Performance
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Monthly comparison of leads and deal outcomes.
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="h-80 w-full" />
      ) : (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={salesData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              barGap={4}
            >
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
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                tick={{ fill: "#64748B", fontSize: 12 }}
              />

              <Tooltip
                cursor={{ fill: "#F1F5F9" }}
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #E2E8F0",
                  fontSize: "12px",
                }}
              />

              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: "12px" }}
              />

              <Bar
                dataKey="leads"
                name="New Leads"
                fill="#15803D"
                radius={[4, 4, 0, 0]}
              />

              <Bar
                dataKey="won"
                name="Deals Won"
                fill="#60A5FA"
                radius={[4, 4, 0, 0]}
              />

              <Bar
                dataKey="lost"
                name="Deals Lost"
                fill="#F87171"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.section>
  );
}