"use client";

import { ChevronDown, ChevronRight } from "lucide-react";

interface DateGroupHeaderProps {
  group: string;
  count: number;
  isExpanded: boolean;
  onToggle: () => void;
  isLight: boolean;
}

export default function DateGroupHeader({
  group,
  count,
  isExpanded,
  onToggle,
  isLight,
}: DateGroupHeaderProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex w-full items-center justify-between py-3 px-4 rounded-lg transition-colors ${
        isLight ? "bg-gray-50 hover:bg-gray-100" : "bg-white/5 hover:bg-white/10"
      }`}
    >
      <div className="flex items-center gap-2">
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        <span className="font-semibold">{group}</span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            isLight ? "bg-gray-200 text-gray-600" : "bg-white/10 text-gray-400"
          }`}
        >
          {count}
        </span>
      </div>
    </button>
  );
}
