
import Skeleton from "@/components/ui/Skeleton";

export default function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Heading and icon */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />

        <Skeleton className="size-10 rounded-lg" />
      </div>

      {/* Main value */}
      <div className="mt-4">
        <Skeleton className="h-8 w-32" />
      </div>

      {/* Percentage change */}
      <div className="mt-3 flex items-center gap-2">
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}
