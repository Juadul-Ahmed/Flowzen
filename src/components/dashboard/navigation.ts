import {
  LayoutDashboard,
  Users,
  Contact,
  Building2,
  BriefcaseBusiness,
  CheckSquare,
  Workflow,
  ChartNoAxesCombined,
  Settings,
} from "lucide-react";

export const navigationItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Leads",
    href: "/leads",
    icon: Users,
  },
  {
    title: "Contacts",
    href: "/contacts",
    icon: Contact,
  },
  {
    title: "Companies",
    href: "/companies",
    icon: Building2,
  },
  {
    title: "Deals",
    href: "/deals",
    icon: BriefcaseBusiness,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Automations",
    href: "/automations",
    icon: Workflow,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];