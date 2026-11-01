"use client";

import { useState } from "react";
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";

export default function DashboardHeader() {
  const [isDark, setIsDark] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Left: Page title */}
      <div>
        <h1 className="text-lg font-semibold text-slate-900">
          Overview
        </h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            placeholder="Search anything..."
            className="h-9 w-64 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-green-600 focus:bg-white"
          />
        </div>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={() => setIsDark((current) => !current)}
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
          aria-label="Toggle theme"
        >
          {isDark ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell size={20} />

          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-green-600" />
        </button>

        {/* Profile */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-slate-100"
        >
          <div className="flex size-8 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-700">
            F
          </div>

          <span className="hidden text-sm font-medium text-slate-700 md:block">
            Flowzen User
          </span>

          <ChevronDown size={16} className="text-slate-400" />
        </button>
      </div>
    </header>
  );
}