import Skeleton from "@/components/ui/Skeleton";

export default function ContactsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Statistics skeletons */}
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-border bg-card p-5"
          >
            <Skeleton variant="text" className="h-4 w-32" />
            <Skeleton
              variant="text"
              className="mt-4 h-8 w-16"
            />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton variant="text" className="h-5 w-32" />
          <Skeleton variant="rectangular" className="h-9 w-24 rounded-lg" />
        </div>

        <div className="space-y-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 border-b border-border pb-4 last:border-0"
            >
              <Skeleton
                variant="circular"
                className="size-10 shrink-0"
              />

              <div className="flex-1 space-y-2">
                <Skeleton variant="text" className="h-4 w-36" />
                <Skeleton variant="text" className="h-3 w-48" />
              </div>

              <Skeleton
                variant="text"
                className="hidden h-4 w-28 sm:block"
              />

              <Skeleton
                variant="text"
                className="hidden h-4 w-24 md:block"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}