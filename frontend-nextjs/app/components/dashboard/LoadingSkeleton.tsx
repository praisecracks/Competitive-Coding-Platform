"use client";

export default function SkeletonLoader() {
  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0a0a] p-5 sm:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.08),transparent_24%),radial-gradient(circle_at_left,rgba(168,85,247,0.06),transparent_22%)]" />

        <div className="relative grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <Shimmer className="h-7 w-36 rounded-full" />
            <Shimmer className="h-12 w-full max-w-[520px] rounded-2xl" />
            <div className="space-y-2">
              <Shimmer className="h-4 w-full max-w-[620px] rounded-lg" />
              <Shimmer className="h-4 w-full max-w-[540px] rounded-lg" />
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
            <div className="space-y-3">
              <Shimmer className="h-4 w-24 rounded-full" />
              <Shimmer className="h-8 w-48 rounded-xl" />
              <div className="space-y-2">
                <Shimmer className="h-4 w-full rounded-lg" />
                <Shimmer className="h-4 w-[85%] rounded-lg" />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Shimmer className="h-11 w-40 rounded-xl" />
                <Shimmer className="h-11 w-40 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[22px] border border-white/10 bg-[#0a0a0a] p-4"
          >
            <div className="space-y-3">
              <Shimmer className="h-3 w-20 rounded-full" />
              <Shimmer className="h-10 w-24 rounded-xl" />
              <Shimmer className="h-3 w-28 rounded-full" />
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <div className="rounded-[24px] border border-white/10 bg-[#0a0a0a] p-5">
            <div className="mb-5 space-y-2">
              <Shimmer className="h-6 w-44 rounded-xl" />
              <Shimmer className="h-4 w-64 rounded-lg" />
            </div>

            <div className="space-y-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Shimmer className="h-4 w-16 rounded-lg" />
                    <Shimmer className="h-4 w-20 rounded-lg" />
                  </div>
                  <Shimmer className="h-3 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-[#0a0a0a] p-5">
            <div className="mb-5 space-y-2">
              <Shimmer className="h-6 w-40 rounded-xl" />
              <Shimmer className="h-4 w-56 rounded-lg" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-[18px] border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="space-y-3">
                    <Shimmer className="h-4 w-20 rounded-lg" />
                    <Shimmer className="h-8 w-24 rounded-xl" />
                    <Shimmer className="h-3 w-28 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[24px] border border-white/10 bg-[#0a0a0a] p-5">
            <div className="mb-5 flex items-center justify-between">
              <div className="space-y-2">
                <Shimmer className="h-6 w-36 rounded-xl" />
                <Shimmer className="h-4 w-32 rounded-lg" />
              </div>
              <Shimmer className="h-8 w-20 rounded-full" />
            </div>

            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-[18px] border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Shimmer className="h-4 w-28 rounded-lg" />
                      <Shimmer className="h-4 w-12 rounded-lg" />
                    </div>
                    <Shimmer className="h-3 w-full rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-[#0a0a0a] p-5">
            <div className="mb-5 space-y-2">
              <Shimmer className="h-6 w-32 rounded-xl" />
              <Shimmer className="h-4 w-52 rounded-lg" />
            </div>

            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-[16px] border border-white/10 bg-white/[0.03] p-3"
                >
                  <Shimmer className="h-10 w-10 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Shimmer className="h-4 w-[70%] rounded-lg" />
                    <Shimmer className="h-3 w-[45%] rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-white/[0.06] ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.2s_infinite] bg-gradient-to-r from-transparent via-white/[0.10] to-transparent" />
    </div>
  );
}