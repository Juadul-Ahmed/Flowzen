"use client";

import {
  UserPlus,
  BriefcaseBusiness,
  Contact,
  CheckCircle2,
  Building2,
  Clock,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

import Skeleton from "@/components/ui/Skeleton";

type ActivityType = "lead" | "deal" | "contact" | "task" | "company";

interface Activity {
  id: number;
  type: ActivityType;
  title: string;
  description: string;
  time: string;
}

const activities: Activity[] = [
  {
    id: 1,
    type: "lead",
    title: "New lead added",
    description: "Sarah Johnson was added as a new lead.",
    time: "5 minutes ago",
  },
  {
    id: 2,
    type: "deal",
    title: "Deal successfully closed",
    description: "Enterprise Plan — $12,500.",
    time: "30 minutes ago",
  },
  {
    id: 3,
    type: "contact",
    title: "Contact information updated",
    description: "Michael Brown's contact details were updated.",
    time: "1 hour ago",
  },
  {
    id: 4,
    type: "task",
    title: "Follow-up task completed",
    description: "Follow-up meeting with Alex Smith completed.",
    time: "3 hours ago",
  },
  {
    id: 5,
    type: "company",
    title: "New company registered",
    description: "TechSolutions Inc. was added to your CRM.",
    time: "5 hours ago",
  },
];

const activityConfig: Record<
  ActivityType,
  { icon: LucideIcon; color: string; background: string }
> = {
  lead: {
    icon: UserPlus,
    color: "text-green-700",
    background: "bg-green-50",
  },
  deal: {
    icon: BriefcaseBusiness,
    color: "text-blue-700",
    background: "bg-blue-50",
  },
  contact: {
    icon: Contact,
    color: "text-purple-700",
    background: "bg-purple-50",
  },
  task: {
    icon: CheckCircle2,
    color: "text-amber-700",
    background: "bg-amber-50",
  },
  company: {
    icon: Building2,
    color: "text-indigo-700",
    background: "bg-indigo-50",
  },
};

interface RecentActivitiesProps {
  isLoading?: boolean;
}

export default function RecentActivities({
  isLoading = false,
}: RecentActivitiesProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Activities
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Latest updates from your CRM.
          </p>
        </div>

        <Clock size={20} className="text-slate-400" />
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-start gap-3">
              <Skeleton variant="circular" className="size-10 shrink-0" />

              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-full max-w-64" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          {activities.map((activity) => {
            const config = activityConfig[activity.type];
            const Icon = config.icon;

            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full ${config.background} ${config.color}`}
                >
                  <Icon size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-slate-900">
                    {activity.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {activity.description}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.section>
  );
}