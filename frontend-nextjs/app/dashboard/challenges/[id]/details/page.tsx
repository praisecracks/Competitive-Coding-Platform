"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "@/app/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Flag, X } from "lucide-react";

export default function ChallengeDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [challenge, setChallenge] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reporting, setReporting] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  const handleReport = async () => {
    if (!reportReason.trim()) return;
    setReporting(true);
    try {
      const token = localStorage.getItem("terminal_token");
      await fetch("/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "challenge",
          targetId: challengeId,
          reason: reportReason,
        }),
      });
      setReportSent(true);
      setTimeout(() => {
        setShowReport(false);
        setReportSent(false);
        setReportReason("");
      }, 2000);
    } catch (err) {
      console.error("Report failed:", err);
    } finally {
      setReporting(false);
    }
  };

  const challengeId = Number(params?.id);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/challenges/${challengeId}`);
      const data = await res.json();
      setChallenge(data);
    };

    fetchData();
  }, [challengeId]);

  useEffect(() => {
    const sections = ["overview", "examples", "constraints", "guidance"];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0.1 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [challenge]);

  if (!challenge) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isLight ? "bg-[#f8fafc]" : "bg-[#050507]"
        } ${isLight ? "text-gray-900" : "text-white"}`}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isLight
          ? "bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-900"
          : "bg-[#050507] text-white"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 py-10">

        {/* HEADER */}
        <div className="mb-10 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className={`text-sm transition ${
              isLight
                ? "text-gray-600 hover:text-gray-900"
                : "text-gray-400 hover:text-white"
            }`}
          >
            ← Back
          </button>
          
          <button
            onClick={() => setShowReport(true)}
            className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg border transition ${
              isLight
                ? "border-gray-200 text-gray-600 hover:bg-gray-50"
                : "border-white/10 text-gray-400 hover:bg-white/5"
            }`}
          >
            <Flag className="h-3 w-3" />
            Report
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[220px_1fr_280px] gap-10">

          {/* SIDEBAR */}
          <aside className="hidden xl:block sticky top-24 h-fit">
            <nav
              className={`space-y-3 text-sm rounded-2xl border p-4 ${
                isLight
                  ? "border-gray-200 bg-white shadow-sm"
                  : "border-white/10 bg-[#0b0b0f]"
              }`}
            >
              <p className="text-xs uppercase text-gray-500">Contents</p>

              {[
                { id: "overview", label: "Overview" },
                { id: "examples", label: "Examples" },
                { id: "constraints", label: "Constraints" },
                { id: "guidance", label: "Guidance" },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block transition ${
                    activeSection === item.id
                      ? isLight
                        ? "text-gray-900 font-medium"
                        : "text-white font-medium"
                      : isLight
                      ? "text-gray-600 hover:text-gray-900"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* MAIN */}
          <div className="space-y-12 max-w-3xl">

            {/* OVERVIEW */}
            <section id="overview">
              <h1
                className={`text-4xl font-semibold ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                {challenge.title}
              </h1>

              <p
                className={`mt-6 text-[15px] leading-8 ${
                  isLight ? "text-gray-700" : "text-gray-300"
                }`}
              >
                {challenge.description}
              </p>
            </section>

            {/* EXAMPLES */}
            {challenge.examples?.length > 0 && (
              <section id="examples" className="space-y-6">
                <h2
                  className={`text-2xl font-semibold ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  Examples
                </h2>

                {challenge.examples.map((ex: any, i: number) => (
                  <div
                    key={i}
                    className={`relative group rounded-2xl border p-4 ${
                      isLight
                        ? "border-gray-200 bg-white shadow-sm"
                        : "border-white/10 bg-[#0b0b0f]"
                    }`}
                  >
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `Input:\n${ex.input}\n\nOutput:\n${ex.output}`
                        )
                      }
                      className={`absolute top-2 right-2 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition ${
                        isLight
                          ? "bg-gray-200 text-gray-700"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      Copy
                    </button>

                    <pre
                      className={`p-4 rounded-xl text-sm overflow-x-auto ${
                        isLight
                          ? "bg-gray-50 border border-gray-200 text-gray-800"
                          : "bg-[#07080b] text-gray-200"
                      }`}
                    >
Input:
{ex.input}

Output:
{ex.output}
                    </pre>

                    {ex.explanation && (
                      <p
                        className={`mt-3 text-[15px] leading-8 ${
                          isLight ? "text-gray-700" : "text-gray-300"
                        }`}
                      >
                        {ex.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* CONSTRAINTS */}
            {challenge.constraints?.length > 0 && (
              <section id="constraints" className="space-y-4">
                <h2
                  className={`text-2xl font-semibold ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  Constraints
                </h2>

                <ul
                  className={`space-y-2 ${
                    isLight ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  {challenge.constraints.map((c: string, i: number) => (
                    <li key={i}>• {c}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* GUIDANCE */}
            <section id="guidance" className="space-y-4">
              <h2
                className={`text-2xl font-semibold ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                Approach Guidance
              </h2>

              <div
                className={`rounded-2xl border p-5 ${
                  isLight
                    ? "border-gray-200 bg-gray-50"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <p className={`${isLight ? "text-gray-700" : "text-gray-300"} leading-8`}>
                  Think about the pattern behind the problem before coding.
                </p>
                <p className={`${isLight ? "text-gray-700" : "text-gray-300"} leading-8 mt-2`}>
                  Use examples to validate your understanding.
                </p>
                <p className={`${isLight ? "text-gray-700" : "text-gray-300"} leading-8 mt-2`}>
                  Consider edge cases and constraints carefully.
                </p>
              </div>
            </section>
          </div>

          {/* RIGHT PANEL */}
          <aside className="hidden xl:block sticky top-24 h-fit">
            <div
              className={`rounded-2xl border p-5 ${
                isLight
                  ? "border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
                  : "border-white/10 bg-[#0b0b0f]"
              }`}
            >
              <p className={`${isLight ? "text-gray-600" : "text-gray-400"} text-sm`}>
                Next Step
              </p>

              <button
                onClick={() =>
                  router.push(`/challenges/${challenge.id}?mode=solo`)
                }
                className="mt-4 w-full bg-gradient-to-r from-pink-500 to-purple-500 py-3 rounded-xl text-white"
              >
                Start Challenge
              </button>
            </div>
          </aside>

        </div>
      </div>

      {/* REPORT MODAL */}
      <AnimatePresence>
        {showReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div
              className={`absolute inset-0 ${isLight ? "bg-gray-900/50" : "bg-black/80"}`}
              onClick={() => setShowReport(false)}
            />
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className={`relative w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
                isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0d0d0d]"
              }`}
            >
              {reportSent ? (
                <div className="text-center py-8">
                  <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4 ${
                    isLight ? "bg-green-100" : "bg-green-500/20"
                  }`}>
                    <Flag className={isLight ? "h-8 w-8 text-green-600" : "h-8 w-8 text-green-500"} />
                  </div>
                  <h3 className={`text-xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                    Report Submitted
                  </h3>
                  <p className={`mt-2 text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                    Thank you for helping keep our community safe.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      Report Challenge
                    </h3>
                    <button
                      onClick={() => setShowReport(false)}
                      className={`p-1 rounded-lg transition ${
                        isLight ? "hover:bg-gray-100" : "hover:bg-white/10"
                      }`}
                    >
                      <X className={isLight ? "h-5 w-5 text-gray-500" : "h-5 w-5 text-gray-400"} />
                    </button>
                  </div>

                  <p className={`text-sm mb-4 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Why are you reporting this challenge?
                  </p>

                  <div className="space-y-2 mb-6">
                    {[
                      "Inappropriate content",
                      "Incorrect problem statement",
                      "Test cases are wrong",
                      "Duplicate challenge",
                      "Spam or misleading",
                      "Other",
                    ].map((reason) => (
                      <label
                        key={reason}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                          reportReason === reason
                            ? isLight
                              ? "border-pink-500 bg-pink-50"
                              : "border-pink-500/50 bg-pink-500/10"
                            : isLight
                              ? "border-gray-200 hover:border-gray-300"
                              : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        <input
                          type="radio"
                          name="reportReason"
                          value={reason}
                          checked={reportReason === reason}
                          onChange={(e) => setReportReason(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          reportReason === reason
                            ? "border-pink-500 bg-pink-500"
                            : isLight ? "border-gray-300" : "border-white/30"
                        }`}>
                          {reportReason === reason && (
                            <div className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                          {reason}
                        </span>
                      </label>
                    ))}
                  </div>

                  <button
                    onClick={handleReport}
                    disabled={!reportReason || reporting}
                    className={`w-full py-3 rounded-xl font-medium transition ${
                      reportReason && !reporting
                        ? "bg-pink-500 text-white hover:bg-pink-600"
                        : isLight
                          ? "bg-gray-200 text-gray-500"
                          : "bg-white/10 text-white/50"
                    }`}
                  >
                    {reporting ? "Submitting..." : "Submit Report"}
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}