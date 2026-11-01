
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "./navigation";
import { Sparkles, X } from "lucide-react";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({
  isOpen,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50
        flex h-screen w-64 flex-col
        border-r border-slate-200 bg-white
        transition-colors transition-transform duration-300
        dark:border-slate-800 dark:bg-slate-900
        lg:sticky lg:top-0 lg:z-30 lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-6 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-green-700 text-white">
            <Sparkles size={20} />
          </div>

          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Flowzen
          </span>
        </div>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        {navigationItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              }`}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Upgrade card */}
      <div className="shrink-0 border-t border-slate-200 p-4 dark:border-slate-800">
        <div className="rounded-xl bg-green-50 p-3 dark:bg-green-950">
          <p className="text-sm font-semibold text-green-900 dark:text-green-300">
            Flowzen Pro
          </p>

          <p className="mt-1 text-xs text-green-700 dark:text-green-400">
            Grow your business with smarter automation.
          </p>
        </div>
      </div>
    </aside>
  );
}
