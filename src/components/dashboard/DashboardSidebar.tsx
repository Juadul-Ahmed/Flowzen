
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { navigationItems } from "./navigation";
import {
  Sparkles,
  X,
  ChevronDown,
  Check,
  Plus,
  Building2,
} from "lucide-react";
import { toast } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({
  isOpen,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isOrgMenuOpen, setIsOrgMenuOpen] = useState(false);
  const [switchingOrgId, setSwitchingOrgId] = useState<string | null>(null);

  const { data: organizations, isPending: isLoadingOrganizations } =
    authClient.useListOrganizations();

  const { data: activeOrganization, isPending: isLoadingActiveOrg } =
    authClient.useActiveOrganization();

  async function handleOrganizationSwitch(organizationId: string) {
    if (
      organizationId === activeOrganization?.id ||
      switchingOrgId
    ) {
      setIsOrgMenuOpen(false);
      return;
    }

    setSwitchingOrgId(organizationId);

    try {
      const { error } = await authClient.organization.setActive({
        organizationId,
      });

      if (error) {
        toast.danger(error.message || "Unable to switch organization.");
        return;
      }

      setIsOrgMenuOpen(false);

      toast.success("Organization switched successfully.");

      router.refresh();
    } catch (error) {
      console.error("Organization switch error:", error);
      toast.danger("Something went wrong. Please try again.");
    } finally {
      setSwitchingOrgId(null);
    }
  }

  const isLoading = isLoadingOrganizations || isLoadingActiveOrg;

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50
        flex h-screen w-64 flex-col
        border-r border-slate-200 bg-white
        transition-transform duration-300
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

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      {/* Organization Switcher */}
      <div className="border-b border-slate-200 p-4 dark:border-slate-800">
        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Organization
        </p>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOrgMenuOpen((previous) => !previous)}
            disabled={isLoading || !!switchingOrgId}
            aria-expanded={isOrgMenuOpen}
            className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              <Building2 size={19} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                {isLoading
                  ? "Loading..."
                  : activeOrganization?.name || "Select organization"}
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isLoading
                  ? "Please wait"
                  : `${organizations?.length || 0} organizations`}
              </p>
            </div>

            <ChevronDown
              size={17}
              className={`shrink-0 text-slate-400 transition-transform ${
                isOrgMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOrgMenuOpen && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Your organizations
              </p>

              {organizations?.map((organization) => {
                const isActive =
                  organization.id === activeOrganization?.id;

                const isSwitching =
                  switchingOrgId === organization.id;

                return (
                  <button
                    key={organization.id}
                    type="button"
                    disabled={!!switchingOrgId || isActive}
                    onClick={() =>
                      handleOrganizationSwitch(organization.id)
                    }
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-slate-100 disabled:cursor-default disabled:opacity-70 dark:hover:bg-slate-800"
                  >
                    <Building2
                      size={17}
                      className="shrink-0 text-slate-400"
                    />

                    <span className="min-w-0 flex-1 truncate text-sm text-slate-700 dark:text-slate-200">
                      {organization.name}
                    </span>

                    {isSwitching ? (
                      <span className="text-xs text-green-600">
                        Switching...
                      </span>
                    ) : isActive ? (
                      <Check
                        size={17}
                        className="shrink-0 text-green-600"
                      />
                    ) : null}
                  </button>
                );
              })}

              {!isLoading && organizations?.length === 0 && (
                <p className="px-3 py-3 text-sm text-slate-500">
                  No organizations found.
                </p>
              )}

              <div className="mt-2 border-t border-slate-200 pt-2 dark:border-slate-700">
                <Link
                  href="/onboarding"
                  onClick={() => {
                    setIsOrgMenuOpen(false);
                    onClose();
                  }}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-green-700 transition hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950"
                >
                  <Plus size={17} />
                  Create organization
                </Link>
              </div>
            </div>
          )}
        </div>
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
