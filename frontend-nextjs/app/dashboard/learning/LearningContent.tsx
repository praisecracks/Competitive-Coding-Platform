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
    <section className="p-8 sm:p-10">
      <div className="max-w-4xl mx-auto">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-500">
          Lesson Step
        </p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {path.currentStepTitle}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-gray-400">
          {path.currentStepDescription}
        </p>

        {/* Content Body */}
        <div className="mt-12 space-y-12">
          {/* Explanation Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
              <div className="h-1 w-4 rounded-full bg-pink-500" />
              Explanation
            </div>
            <div className="space-y-6 text-base leading-relaxed text-gray-300">
              {path.content.map((paragraph, idx) => (
                <p key={idx} className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 transition-colors hover:bg-white/[0.04]">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Example Section */}
          {path.example && (
            <div className="rounded-[32px] border border-white/5 bg-white/[0.02] p-8 shadow-inner">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-500">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">{path.example.title || "Code Example"}</h4>
              </div>
              
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#050507] p-6 group">
                <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Snippet</span>
                </div>
                <pre className="overflow-x-auto font-mono text-sm leading-relaxed text-pink-300">
                  <code>{path.example.code}</code>
                </pre>
              </div>
              
              <div className="mt-6 flex items-start gap-3">
                <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-pink-500/20 text-pink-500">
                  <div className="h-1.5 w-1.5 rounded-full bg-pink-500" />
                </div>
                <p className="text-sm leading-relaxed text-gray-400 italic">
                  <span className="font-bold text-gray-300 not-italic uppercase tracking-widest text-[10px] mr-2">The Logic:</span> 
                  {path.example.explanation}
                </p>
              </div>
            </div>
          )}

          {/* Common Mistakes */}
          {path.commonMistake && (
            <div className="rounded-3xl border border-rose-500/10 bg-rose-500/[0.02] p-8">
              <div className="flex items-center gap-3 text-rose-500">
                <XCircle className="h-5 w-5" />
                <h4 className="text-xs font-black uppercase tracking-[0.2em]">Common Pitfall</h4>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                {path.commonMistake}
              </p>
            </div>
          )}

          {/* Key Takeaways */}
          {path.keyTakeaways && path.keyTakeaways.length > 0 && (
            <div className="space-y-6 pt-6 border-t border-white/5">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                <div className="h-1 w-4 rounded-full bg-emerald-500" />
                Key Takeaways
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {path.keyTakeaways.map((takeaway, idx) => (
                  <div key={idx} className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.01] p-4 transition-colors hover:bg-white/[0.03]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-sm font-medium text-gray-300">{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
