"use client";

import { CheckCircle2, Lightbulb, XCircle } from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";

type LearningContentProps = {
  path: {
    currentStepTitle: string;
    currentStepDescription: string;
    content: string[];
    keyTakeaways?: string[];
    example?: {
      title?: string;
      code?: string;
      explanation?: string;
    };
    commonMistake?: string;
  };
  progressPercentage: number;
};

export default function LearningContent({
  path,
}: LearningContentProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section className="w-full px-0 py-2 sm:py-4">
      <div className="w-full max-w-none">
        <header
          className={`mb-8 pb-6 sm:mb-10 sm:pb-8 ${
            isLight ? "border-b border-gray-200" : "border-b border-white/6"
          }`}
        >
          <p
            className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${
              isLight ? "text-pink-600" : "text-pink-400"
            }`}
          >
            Lesson Step
          </p>

          <h2
            className={`mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem] ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            {path.currentStepTitle}
          </h2>

          <p
            className={`mt-4 max-w-4xl text-base leading-8 ${
              isLight ? "text-gray-600" : "text-gray-400"
            }`}
          >
            {path.currentStepDescription}
          </p>
        </header>

        <div className="space-y-10 sm:space-y-12">
          <section>
            <div
              className={`mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] ${
                isLight ? "text-gray-500" : "text-gray-500"
              }`}
            >
              <div className="h-[2px] w-5 bg-pink-500" />
              Explanation
            </div>

            <div className="space-y-5">
              {path.content.map((paragraph, idx) => (
                <p
                  key={idx}
                  className={`max-w-none text-[15px] leading-8 sm:text-base ${
                    isLight ? "text-gray-700" : "text-gray-200"
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          {path.example && (
            <section
              className={`pt-8 sm:pt-10 ${
                isLight ? "border-t border-gray-200" : "border-t border-white/6"
              }`}
            >
              <div className="mb-5 flex items-center gap-3">
                <Lightbulb
                  className={`h-5 w-5 ${
                    isLight ? "text-pink-500" : "text-pink-400"
                  }`}
                />
                <h4
                  className={`text-sm font-semibold uppercase tracking-[0.16em] ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  {path.example.title || "Code Example"}
                </h4>
              </div>

              {path.example.code && (
                <div
                  className={`overflow-x-auto rounded-xl border px-4 py-4 sm:px-5 sm:py-5 ${
                    isLight
                      ? "border-gray-200 bg-gray-50 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
                      : "border-white/8 bg-[#050507]"
                  }`}
                >
                  <pre
                    className={`whitespace-pre-wrap break-words font-mono text-[13px] leading-7 sm:text-sm ${
                      isLight ? "text-pink-700" : "text-pink-300"
                    }`}
                  >
                    <code>{path.example.code}</code>
                  </pre>
                </div>
              )}

              {path.example.explanation && (
                <div
                  className={`mt-5 rounded-2xl border px-4 py-4 sm:px-5 ${
                    isLight
                      ? "border-pink-100 bg-pink-50/60"
                      : "border-white/8 bg-white/[0.02]"
                  }`}
                >
                  <p
                    className={`max-w-none text-[15px] leading-8 sm:text-base ${
                      isLight ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    <span
                      className={`mr-2 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                        isLight ? "text-pink-600" : "text-pink-400"
                      }`}
                    >
                      The Logic
                    </span>
                    {path.example.explanation}
                  </p>
                </div>
              )}
            </section>
          )}

          {path.commonMistake && (
            <section
              className={`pt-8 sm:pt-10 ${
                isLight ? "border-t border-gray-200" : "border-t border-white/6"
              }`}
            >
              <div className="mb-4 flex items-center gap-3">
                <XCircle
                  className={`h-5 w-5 ${
                    isLight ? "text-rose-500" : "text-rose-400"
                  }`}
                />
                <h4
                  className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${
                    isLight ? "text-rose-600" : "text-rose-400"
                  }`}
                >
                  Common Pitfall
                </h4>
              </div>

              <div
                className={`rounded-2xl border px-4 py-4 sm:px-5 ${
                  isLight
                    ? "border-rose-200 bg-rose-50"
                    : "border-rose-500/10 bg-rose-500/[0.04]"
                }`}
              >
                <p
                  className={`max-w-none text-[15px] leading-8 sm:text-base ${
                    isLight ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  {path.commonMistake}
                </p>
              </div>
            </section>
          )}

          {path.keyTakeaways && path.keyTakeaways.length > 0 && (
            <section
              className={`pt-8 sm:pt-10 ${
                isLight ? "border-t border-gray-200" : "border-t border-white/6"
              }`}
            >
              <div
                className={`mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] ${
                  isLight ? "text-gray-500" : "text-gray-500"
                }`}
              >
                <div className="h-[2px] w-5 bg-emerald-500" />
                Key Takeaways
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {path.keyTakeaways.map((takeaway, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 rounded-2xl border px-4 py-4 ${
                      isLight
                        ? "border-gray-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
                        : "border-white/8 bg-white/[0.02]"
                    }`}
                  >
                    <CheckCircle2
                      className={`mt-1 h-4 w-4 shrink-0 ${
                        isLight ? "text-emerald-500" : "text-emerald-400"
                      }`}
                    />
                    <span
                      className={`text-[15px] leading-7 sm:text-base ${
                        isLight ? "text-gray-700" : "text-gray-200"
                      }`}
                    >
                      {takeaway}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}