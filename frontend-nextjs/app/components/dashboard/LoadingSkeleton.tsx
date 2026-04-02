// app/components/dashboard/SkeletonLoader.tsx
"use client";

export default function SkeletonLoader() {
  return (
    <div className="animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="h-4 w-24 bg-white/10 rounded mb-4" />
            <div className="h-10 w-64 bg-white/10 rounded mb-3" />
            <div className="h-16 w-full max-w-2xl bg-white/10 rounded mb-6" />
            <div className="flex gap-3">
              <div className="h-12 w-36 bg-white/10 rounded-xl" />
              <div className="h-12 w-32 bg-white/10 rounded-xl" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-28 bg-white/10 rounded-[22px]" />
            <div className="h-28 bg-white/10 rounded-[22px]" />
          </div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-white/10 rounded-[22px]" />
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="mt-8 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <div className="h-64 bg-white/10 rounded-[24px]" />
          <div className="h-80 bg-white/10 rounded-[24px]" />
        </div>
        <div className="space-y-8">
          <div className="h-56 bg-white/10 rounded-[24px]" />
          <div className="h-48 bg-white/10 rounded-[24px]" />
        </div>
      </div>
    </div>
  );
}