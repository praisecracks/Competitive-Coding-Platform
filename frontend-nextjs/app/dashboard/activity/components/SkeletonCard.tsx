"use client";

interface SkeletonCardProps {
  isLight: boolean;
}

export default function SkeletonCard({ isLight }: SkeletonCardProps) {
  return (
    <div
      className={`rounded-xl border p-4 animate-pulse ${
        isLight ? "border-gray-200 bg-white" : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <div className="flex gap-3">
        <div className={`h-10 w-10 rounded-full ${isLight ? "bg-gray-200" : "bg-white/10"}`} />
        <div className="flex-1">
          <div className={`h-4 w-3/4 rounded ${isLight ? "bg-gray-200" : "bg-white/10"}`} />
          <div className={`mt-2 h-3 w-1/2 rounded ${isLight ? "bg-gray-200" : "bg-white/10"}`} />
          <div className="mt-3 flex gap-2">
            <div className={`h-5 w-16 rounded-full ${isLight ? "bg-gray-200" : "bg-white/10"}`} />
            <div className={`h-5 w-20 rounded-full ${isLight ? "bg-gray-200" : "bg-white/10"}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
