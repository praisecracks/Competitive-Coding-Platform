"use client";

import {
  CheckCircle2,
  ChevronRight,
  Flame,
  Lock,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/context/ThemeContext";

type StepStatus = "completed" | "active" | "locked" | "not_started";

type LearningOutlineProps = {
  path: {
    completedSteps: number;
    totalSteps: number;
    steps: Array<{
      id: string;
      title: string;
      duration: string;
      status: StepStatus;
    }>;
  };
  onStepSelect?: (stepId: string) => void;
  activeStepId?: string;
};

export default function LearningOutline({
  path,
  onStepSelect,
  activeStepId,
}: LearningOutlineProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const progressPercentage =
    path.totalSteps > 0
      ? Math.round((path.completedSteps / path.totalSteps) * 100)
      : 0;

  const getStepMeta = (status: StepStatus) => {
    if (isLight) {
      switch (status) {
        case "completed":
          return {
            icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
            container: "border-emerald-200 bg-emerald-50",
            text: "text-gray-900",
            badge: "Completed",
          };
        case "active":
          return {
            icon: <PlayCircle className="h-4 w-4 text-pink-600" />,
            container:
              "border-pink-200 bg-pink-50 shadow-[0_6px_16px_rgba(236,72,153,0.08)]",
            text: "text-gray-900",
            badge: "Active",
          };
        case "locked":
          return {
            icon: <Lock className="h-4 w-4 text-gray-400" />,
            container: "border-gray-200 bg-gray-50 opacity-70",
            text: "text-gray-500",
            badge: "Locked",
          };
        default:
          return {
            icon: (
              <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
            ),
            container: "border-gray-200 bg-white",
            text: "text-gray-700",
            badge: "Next",
          };
      }
    }

    switch (status) {
      case "completed":
        return {
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
          container: "border-emerald-500/15 bg-emerald-500/[0.03]",
          text: "text-emerald-100",
          badge: "Completed",
        };
      case "active":
        return {
          icon: <PlayCircle className="h-4 w-4 text-pink-500" />,
          container:
            "border-pink-500/30 bg-pink-500/[0.06] ring-1 ring-pink-500/20 shadow-lg shadow-pink-500/10",
          text: "text-white",
          badge: "Active",
        };
      case "locked":
        return {
          icon: <Lock className="h-4 w-4 text-gray-600" />,
          container: "border-white/5 bg-white/[0.01] opacity-50",
          text: "text-gray-500",
          badge: "Locked",
        };
      default:
        return {
          icon: (
            <div className="h-4 w-4 rounded-full border-2 border-gray-700" />
          ),
          container: "border-white/8 bg-white/[0.02]",
          text: "text-gray-400",
          badge: "Next",
        };
    }
  };

  return (
    <aside className="space-y-4 pb-10">
      <section
        className={`rounded-[28px] border p-5 sm:p-6 ${
          isLight
            ? "border-gray-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
            : "border-white/10 bg-[#09090c] shadow-2xl"
        }`}
      >
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <p
              className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${
                isLight ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Curriculum
            </p>
            <h3
              className={`mt-2 text-lg font-bold tracking-tight ${
                isLight ? "text-gray-900" : "text-white"
              }`}
            >
              Course Outline
            </h3>
          </div>

          <div
            className={`rounded-xl border px-3 py-1.5 text-right ${
              isLight
                ? "border-gray-200 bg-gray-50"
                : "border-white/10 bg-white/[0.03]"
            }`}
          >
            <p className="text-[10px] uppercase tracking-widest text-gray-500">
              Progress
            </p>
            <p
              className={`mt-0.5 text-xs font-bold ${
                isLight ? "text-gray-900" : "text-white"
              }`}
            >
              {path.completedSteps}/{path.totalSteps}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div
            className={`mb-2.5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-widest ${
              isLight ? "text-gray-500" : "text-gray-500"
            }`}
          >
            <span>Total Completion</span>
            <span className={isLight ? "text-gray-700" : "text-white"}>
              {progressPercentage}%
            </span>
          </div>

          <div
            className={`relative h-1 overflow-hidden rounded-full ${
              isLight ? "bg-gray-100" : "bg-white/5"
            }`}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
            />
          </div>
        </div>

        <div className="space-y-2.5">
          {path.steps.map((step, idx) => {
            const meta = getStepMeta(step.status);

            return (
              <button
                key={step.id}
                onClick={() => onStepSelect?.(step.id)}
                disabled={step.status === "locked"}
                className={`group relative flex w-full flex-col gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                  meta.container
                } ${
                  step.status !== "locked"
                    ? isLight
                      ? "hover:border-gray-300 hover:shadow-sm active:scale-[0.98]"
                      : "hover:border-white/20 active:scale-[0.98]"
                    : "cursor-not-allowed"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        isLight
                          ? "bg-gray-100 group-hover:bg-gray-200"
                          : "bg-white/5 group-hover:bg-white/10"
                      }`}
                    >
                      {meta.icon}
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`truncate text-[13px] font-semibold leading-tight ${meta.text}`}
                      >
                        {step.title}
                      </p>
                      <p className="mt-1 text-[10px] font-medium text-gray-500">
                        Step {idx + 1} • {step.duration}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-lg px-2 py-1 text-[8px] font-black uppercase tracking-widest ${
                      step.status === "active"
                        ? "bg-pink-500 text-white"
                        : isLight
                        ? "bg-gray-100 text-gray-500"
                        : "bg-white/5 text-gray-500"
                    }`}
                  >
                    {meta.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Help */}
      <section
        className={`rounded-[28px] border p-4 sm:p-5 ${
          isLight
            ? "border-gray-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
            : "border-white/8 bg-gradient-to-br from-white/[0.03] to-transparent shadow-xl"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
          <h4
            className={`text-sm font-bold ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            Need help while learning?
          </h4>
        </div>

        <p
          className={`mt-2 text-xs leading-6 sm:text-sm ${
            isLight ? "text-gray-600" : "text-gray-500"
          }`}
        >
          Get quick support, review tricky concepts, and stay moving through the
          course without getting stuck too long on one lesson.
        </p>

        <button
          className={`mt-5 w-full rounded-2xl border py-3 text-[10px] font-black uppercase tracking-[0.18em] transition ${
            isLight
              ? "border-gray-200 bg-gray-50 text-pink-600 hover:bg-gray-100"
              : "border-white/8 bg-white/[0.04] text-pink-400 hover:bg-white/[0.08]"
          }`}
        >
          Community Help
        </button>
      </section>
    </aside>
  );
}