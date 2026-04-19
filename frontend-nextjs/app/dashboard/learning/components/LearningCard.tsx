"use client";

import { ReactNode } from "react";
import { useTheme } from "@/app/context/ThemeContext";

interface LearningCardProps {
  children: ReactNode;
  accentColor?: "yellow" | "emerald" | "cyan" | "pink" | "purple" | "orange" | string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  progress?: number; // 0-100
}

export default function LearningCard({
  children,
  accentColor = "pink",
  className = "",
  onClick,
  disabled = false,
  progress,
}: LearningCardProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // All cards share same base styling — no status-based colors
  const baseStyles = `
    relative overflow-hidden rounded-2xl border
    transition-all duration-300
    ${onClick && !disabled ? "cursor-pointer hover:-translate-y-1 hover:shadow-lg" : ""}
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${isLight
      ? "bg-white border-gray-200 shadow-[0_8px_30px_rgba(15,23,42,0.08)]"
      : "border-white/10 bg-[#0c0c12] shadow-2xl"
    }
  `;

  // Accent color indicator (top border strip)
  const accentColors: Record<string, string> = {
    yellow: isLight ? "bg-yellow-500" : "bg-yellow-500",
    emerald: isLight ? "bg-emerald-500" : "bg-emerald-500",
    cyan: isLight ? "bg-cyan-500" : "bg-cyan-500",
    pink: isLight ? "bg-pink-500" : "bg-pink-500",
    purple: isLight ? "bg-purple-500" : "bg-purple-500",
    orange: isLight ? "bg-orange-500" : "bg-orange-500",
  };

  return (
    <div
      className={`${baseStyles} ${className}`}
      onClick={disabled ? undefined : onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
    >
      {/* Accent top border */}
      <div
        className={`absolute left-0 right-0 top-0 h-1 ${accentColors[accentColor] || accentColors.pink}`}
      />

      {/* Progress bar (if provided) */}
      {progress !== undefined && progress > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-transparent">
          <div
            className={`h-full rounded-r-full transition-all duration-500 ${
              isLight ? "bg-gradient-to-r from-pink-500 to-purple-500" : "bg-gradient-to-r from-pink-500 to-purple-500"
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}

      {children}
    </div>
  );
}
