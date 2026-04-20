"use client";

import { Search, X } from "lucide-react";
import type { ActivityType, ActivityStatus } from "../types";

interface ActivityFiltersProps {
  isLight: boolean;
  typeFilter: ActivityType | "all";
  statusFilter: ActivityStatus | "all";
  searchQuery: string;
  showFilters: boolean;
  onTypeChange: (value: ActivityType | "all") => void;
  onStatusChange: (value: ActivityStatus | "all") => void;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onToggleFilters: () => void;
}

export default function ActivityFilters({
  isLight,
  typeFilter,
  statusFilter,
  searchQuery,
  showFilters,
  onTypeChange,
  onStatusChange,
  onSearchChange,
  onClearSearch,
  onToggleFilters,
}: ActivityFiltersProps) {
  return (
    <div className="mb-6">
      <button
        onClick={onToggleFilters}
        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors md:hidden ${
          isLight
            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
            : "bg-white/10 text-gray-300 hover:bg-white/20"
        }`}
      >
        <Search className="h-4 w-4" />
        Filters
      </button>

      <div
        className={`overflow-hidden rounded-xl border transition-all duration-300 ${
          isLight ? "border-gray-200 bg-white" : "border-white/10 bg-white/[0.03]"
        } ${showFilters ? "max-h-96 opacity-100" : "max-h-0 opacity-0 md:max-h-96 md:opacity-100"}`}
      >
        <div className="p-4">
          <div className="grid gap-4 sm:grid-cols-4">
            {/* Type Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => onTypeChange(e.target.value as ActivityType | "all")}
                className={`w-full rounded-lg border px-3 py-2 text-sm appearance-none cursor-pointer ${
                  isLight
                    ? "border-gray-200 bg-white text-gray-900"
                    : "border-white/10 bg-[#1a1a1a] text-white"
                }`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "1rem",
                }}
              >
                <option value="all" className={isLight ? "" : "bg-[#1a1a1a] text-white"}>All Types</option>
                <option value="submission" className={isLight ? "" : "bg-[#1a1a1a] text-white"}>Submissions</option>
                <option value="duel" className={isLight ? "" : "bg-[#1a1a1a] text-white"}>Duels</option>
                <option value="learning" className={isLight ? "" : "bg-[#1a1a1a] text-white"}>Learning</option>
                <option value="achievement" className={isLight ? "" : "bg-[#1a1a1a] text-white"}>Achievements</option>
                <option value="profile" className={isLight ? "" : "bg-[#1a1a1a] text-white"}>Profile</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value as ActivityStatus | "all")}
                className={`w-full rounded-lg border px-3 py-2 text-sm appearance-none cursor-pointer ${
                  isLight
                    ? "border-gray-200 bg-white text-gray-900"
                    : "border-white/10 bg-[#1a1a1a] text-white"
                }`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "1rem",
                }}
              >
                <option value="all" className={isLight ? "" : "bg-[#1a1a1a] text-white"}>All Statuses</option>
                <option value="accepted" className={isLight ? "" : "bg-[#1a1a1a] text-white"}>Accepted</option>
                <option value="completed" className={isLight ? "" : "bg-[#1a1a1a] text-white"}>Completed</option>
                <option value="won" className={isLight ? "" : "bg-[#1a1a1a] text-white"}>Won</option>
                <option value="failed" className={isLight ? "" : "bg-[#1a1a1a] text-white"}>Failed</option>
                <option value="lost" className={isLight ? "" : "bg-[#1a1a1a] text-white"}>Lost</option>
                <option value="unlocked" className={isLight ? "" : "bg-[#1a1a1a] text-white"}>Unlocked</option>
              </select>
            </div>

            {/* Search */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className={`w-full rounded-lg border pl-10 pr-10 py-2 text-sm ${
                    isLight
                      ? "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
                      : "border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={onClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
