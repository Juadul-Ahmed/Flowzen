
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { toast } from "@heroui/react";

import ThemeToggle from "@/components/shared/ThemeToggle";
import { authClient } from "@/lib/auth-client";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export default function DashboardHeader({
  onMenuClick,
}: DashboardHeaderProps) {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Get authenticated user
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  // Generate avatar initials from user's name
  const userName = user?.name || "User";

  const initials = userName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  // Logout handler
  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.danger(error.message || "Failed to sign out.");
        return;
      }

      toast.success("Signed out successfully!", {
        description: "See you again soon.",
      });

      router.replace("/login");
      router.refresh();
    } catch {
      toast.danger("Something went wrong. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

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
        <ThemeToggle />

        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-green-600" />
        </button>

        {/* Profile dropdown */}
        <div className="relative">

          <button
            type="button"
            onClick={() => setIsMenuOpen((previous) => !previous)}
            aria-expanded={isMenuOpen}
            aria-label="Open profile menu"
            className="flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {/* Dynamic avatar */}
            <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-100 text-sm font-semibold text-green-700 dark:bg-green-900 dark:text-green-300">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={userName}
                  className="size-full object-cover"
                />
              ) : (
                isPending ? "..." : initials
              )}
            </div>

            {/* Dynamic user name */}
            <div className="hidden text-left md:block">
              <p className="max-w-32 truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                {isPending ? "Loading..." : userName}
              </p>
              <p className="max-w-32 truncate text-xs text-slate-400">
                {user?.email || ""}
              </p>
            </div>

            <ChevronDown
              size={16}
              className="hidden text-slate-400 md:block"
            />
          </button>

          {/* Dropdown menu */}
          {isMenuOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">

              <div className="border-b border-slate-200 px-3 py-3 dark:border-slate-700">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {userName}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {user?.email}
                </p>
              </div>

              <div className="space-y-1 py-2">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <User size={17} />
                  Profile
                </button>

                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Settings size={17} />
                  Settings
                </button>
              </div>

              <div className="border-t border-slate-200 pt-2 dark:border-slate-700">
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950"
                >
                  <LogOut size={17} />
                  {isSigningOut ? "Signing out..." : "Sign out"}
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </header>
  );
}
