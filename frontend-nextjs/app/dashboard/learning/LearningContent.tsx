"use client";

import { CheckCircle2, Lightbulb, XCircle } from "lucide-react";

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
  return (
    <section className="w-full px-0 py-2 sm:py-4">
      <div className="w-full max-w-none">
        <header className="mb-8 border-b border-white/6 pb-6 sm:mb-10 sm:pb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-pink-400">
            Lesson Step
          </p>

          <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
            {path.currentStepTitle}
          </h2>

          <p className="mt-4 max-w-4xl text-base leading-8 text-gray-400">
            {path.currentStepDescription}
          </p>
        </header>

        <div className="space-y-10 sm:space-y-12">
          <section>
            <div className="mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
              <div className="h-[2px] w-5 bg-pink-500" />
              Explanation
            </div>

            <div className="space-y-5">
              {path.content.map((paragraph, idx) => (
                <p
                  key={idx}
                  className="max-w-none text-[15px] leading-8 text-gray-200 sm:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          {path.example && (
            <section className="border-t border-white/6 pt-8 sm:pt-10">
              <div className="mb-5 flex items-center gap-3">
                <Lightbulb className="h-5 w-5 text-pink-400" />
                <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
                  {path.example.title || "Code Example"}
                </h4>
              </div>

              {path.example.code && (
                <div className="overflow-x-auto rounded-xl border border-white/8 bg-[#050507] px-4 py-4 sm:px-5 sm:py-5">
                  <pre className="whitespace-pre-wrap break-words font-mono text-[13px] leading-7 text-pink-300 sm:text-sm">
                    <code>{path.example.code}</code>
                  </pre>
                </div>
              )}

              {path.example.explanation && (
                <p className="mt-5 max-w-none text-[15px] leading-8 text-gray-300 sm:text-base">
                  <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-pink-400">
                    The Logic
                  </span>
                  {path.example.explanation}
                </p>
              )}
            </section>
          )}

          {path.commonMistake && (
            <section className="border-t border-white/6 pt-8 sm:pt-10">
              <div className="mb-4 flex items-center gap-3">
                <XCircle className="h-5 w-5 text-rose-400" />
                <h4 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-rose-400">
                  Common Pitfall
                </h4>
              </div>

              <p className="max-w-none text-[15px] leading-8 text-gray-300 sm:text-base">
                {path.commonMistake}
              </p>
            </section>
          )}

          {path.keyTakeaways && path.keyTakeaways.length > 0 && (
            <section className="border-t border-white/6 pt-8 sm:pt-10">
              <div className="mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                <div className="h-[2px] w-5 bg-emerald-500" />
                Key Takeaways
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {path.keyTakeaways.map((takeaway, idx) => (
                  <div key={idx} className="flex items-start gap-3 py-1">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                    <span className="text-[15px] leading-7 text-gray-200 sm:text-base">
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