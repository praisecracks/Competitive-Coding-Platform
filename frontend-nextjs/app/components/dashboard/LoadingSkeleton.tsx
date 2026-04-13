"use client";

import { useTheme } from "../../context/ThemeContext";

export default function SkeletonLoader() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className="space-y-5">
      <section className={`relative overflow-hidden rounded-[28px] border p-5 sm:p-6 ${
        isLight
          ? "border-gray-200 bg-white"
          : "border-white/10 bg-[#0a0a0a]"
      }`}>
        <div className={`absolute inset-0 ${
          isLight
            ? ""
            : "bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.08),transparent_24%),radial-gradient(circle_at_left,rgba(168,85,247,0.06),transparent_22%)]"
        }`} />

        <div className="relative grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <Shimmer isLight={isLight} className="h-7 w-36 rounded-full" />
            <Shimmer isLight={isLight} className="h-12 w-full max-w-[520px] rounded-2xl" />
            <div className="space-y-2">
              <Shimmer isLight={isLight} className="h-4 w-full max-w-[620px] rounded-lg" />
              <Shimmer isLight={isLight} className="h-4 w-full max-w-[540px] rounded-lg" />
            </div>
          </div>

          <div className={`rounded-[24px] border p-4 sm:p-5 ${
            isLight
              ? "border-gray-200 bg-gray-50"
              : "border-white/10 bg-white/[0.03]"
          }`}>
            <div className="space-y-3">
              <Shimmer isLight={isLight} className="h-4 w-24 rounded-full" />
              <Shimmer isLight={isLight} className="h-8 w-48 rounded-xl" />
              <div className="space-y-2">
                <Shimmer isLight={isLight} className="h-4 w-full rounded-lg" />
                <Shimmer isLight={isLight} className="h-4 w-[85%] rounded-lg" />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Shimmer isLight={isLight} className="h-11 w-40 rounded-xl" />
                <Shimmer isLight={isLight} className="h-11 w-40 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`rounded-[22px] border p-4 ${
              isLight
                ? "border-gray-200 bg-white"
                : "border-white/10 bg-[#0a0a0a]"
            }`}
          >
            <div className="space-y-3">
              <Shimmer isLight={isLight} className="h-3 w-20 rounded-full" />
              <Shimmer isLight={isLight} className="h-10 w-24 rounded-xl" />
              <Shimmer isLight={isLight} className="h-3 w-28 rounded-full" />
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <div className={`rounded-[24px] border p-5 ${
            isLight
              ? "border-gray-200 bg-white"
              : "border-white/10 bg-[#0a0a0a]"
          }`}>
            <div className="mb-5 space-y-2">
              <Shimmer isLight={isLight} className="h-6 w-44 rounded-xl" />
              <Shimmer isLight={isLight} className="h-4 w-64 rounded-lg" />
            </div>

            <div className="space-y-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Shimmer isLight={isLight} className="h-4 w-16 rounded-lg" />
                    <Shimmer isLight={isLight} className="h-4 w-20 rounded-lg" />
                  </div>
                  <Shimmer isLight={isLight} className="h-3 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-[24px] border p-5 ${
            isLight
              ? "border-gray-200 bg-white"
              : "border-white/10 bg-[#0a0a0a]"
          }`}>
            <div className="mb-5 space-y-2">
              <Shimmer isLight={isLight} className="h-6 w-40 rounded-xl" />
              <Shimmer isLight={isLight} className="h-4 w-56 rounded-lg" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-[18px] border p-4 ${
                    isLight
                      ? "border-gray-200 bg-gray-50"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <div className="space-y-3">
                    <Shimmer isLight={isLight} className="h-4 w-20 rounded-lg" />
                    <Shimmer isLight={isLight} className="h-8 w-24 rounded-xl" />
                    <Shimmer isLight={isLight} className="h-3 w-28 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className={`rounded-[24px] border p-5 ${
            isLight
              ? "border-gray-200 bg-white"
              : "border-white/10 bg-[#0a0a0a]"
          }`}>
            <div className="mb-5 flex items-center justify-between">
              <div className="space-y-2">
                <Shimmer isLight={isLight} className="h-6 w-36 rounded-xl" />
                <Shimmer isLight={isLight} className="h-4 w-32 rounded-lg" />
              </div>
              <Shimmer isLight={isLight} className="h-8 w-20 rounded-full" />
            </div>

            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-[18px] border p-4 ${
                    isLight
                      ? "border-gray-200 bg-gray-50"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Shimmer isLight={isLight} className="h-4 w-28 rounded-lg" />
                      <Shimmer isLight={isLight} className="h-4 w-12 rounded-lg" />
                    </div>
                    <Shimmer isLight={isLight} className="h-3 w-full rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-[24px] border p-5 ${
            isLight
              ? "border-gray-200 bg-white"
              : "border-white/10 bg-[#0a0a0a]"
          }`}>
            <div className="mb-5 space-y-2">
              <Shimmer isLight={isLight} className="h-6 w-32 rounded-xl" />
              <Shimmer isLight={isLight} className="h-4 w-52 rounded-lg" />
            </div>

            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 rounded-[16px] border p-3 ${
                    isLight
                      ? "border-gray-200 bg-gray-50"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <Shimmer isLight={isLight} className="h-10 w-10 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Shimmer isLight={isLight} className="h-4 w-[70%] rounded-lg" />
                    <Shimmer isLight={isLight} className="h-3 w-[45%] rounded-lg" />
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

function Shimmer({ className = "", isLight = false }: { className?: string; isLight?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden ${className} ${
        isLight ? "bg-gray-100" : "bg-white/[0.06]"
      }`}
    >
      <div className={`absolute inset-0 -translate-x-full animate-[shimmer_1.2s_infinite] bg-gradient-to-r from-transparent ${
        isLight ? "via-gray-200 to-transparent" : "via-white/[0.10] to-transparent"
      }`} />
    </div>
  );
}