
"use client";

import { motion } from "framer-motion";
import {
  Users,
  Contact,
  BriefcaseBusiness,
  Wallet,
} from "lucide-react";

import StatCard from "./StatCard";
import StatCardSkeleton from "./StatCardSkeleton";

interface StatsOverviewProps {
  isLoading?: boolean;
}

const stats = [
  {
    title: "Total Leads",
    value: "2,450",
    change: "12.5%",
    trend: "up" as const,
    icon: Users,
  },
  {
    title: "Total Contacts",
    value: "1,820",
    change: "8.2%",
    trend: "up" as const,
    icon: Contact,
  },
  {
    title: "Active Deals",
    value: "128",
    change: "5.4%",
    trend: "up" as const,
    icon: BriefcaseBusiness,
  },
  {
    title: "Revenue",
    value: "$48,250",
    change: "15.8%",
    trend: "up" as const,
    icon: Wallet,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

export default function StatsOverview({
  isLoading = false,
}: StatsOverviewProps) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Overview
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Here's what's happening with your business.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <motion.div
                key={`skeleton-${index}`}
                variants={itemVariants}
              >
                <StatCardSkeleton />
              </motion.div>
            ))
          : stats.map((stat) => (
              <motion.div
                key={stat.title}
                variants={itemVariants}
              >
                <StatCard {...stat} />
              </motion.div>
            ))}
      </motion.div>
    </section>
  );
}
