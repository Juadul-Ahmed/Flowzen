
"use client";

import { useTheme } from "next-themes";
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Menu,
} from "lucide-react";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export default function DashboardHeader({
  onMenuClick,
}: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 dark:border-slate-700 dark:bg-slate-900">

      {/* Page title and mobile menu */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>

        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Overview
        </h1>
      </div>

      {/* Header actions */}
      <div className="flex items-center gap-2 sm:gap-4">

        {/* Search */}
        <div className="relative hidden sm:block">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            placeholder="Search anything..."
            className="h-9 w-48 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:bg-white lg:w-64 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-800"
          />
        </div>

        {/* Theme toggle */}
       <button
  type="button"
  onClick={() => setTheme(isDark ? "light" : "dark")}
  className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
  aria-label="Toggle color theme"
  title="Toggle color theme"
>
  <Moon size={20} className="block dark:hidden" />
  <Sun size={20} className="hidden dark:block" />
</button>

        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Notifications"
        >
          <Bell size={20} />

          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-green-600" />
        </button>

        {/* Profile */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <div className="flex size-8 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-700 dark:bg-green-900 dark:text-green-300">
            F
          </div>

          <span className="hidden text-sm font-medium text-slate-700 md:block dark:text-slate-200">
            Flowzen User
          </span>

          <ChevronDown
            size={16}
            className="hidden text-slate-400 md:block"
          />
        </button>

      </div>
    </header>
  );
}
