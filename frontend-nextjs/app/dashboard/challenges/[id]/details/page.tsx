"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ChallengeDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [challenge, setChallenge] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("overview");

  const challengeId = Number(params?.id);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/challenges/${challengeId}`);
      const data = await res.json();
      setChallenge(data);
    };

    fetchData();
  }, [challengeId]);

  // 🔥 Scroll Spy
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
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10">

        {/* HEADER */}
        <div className="mb-10">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-400 hover:text-white"
          >
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[220px_1fr_280px] gap-10">

          {/* SIDEBAR */}
          <aside className="hidden xl:block sticky top-24 h-fit">
            <nav className="space-y-3 text-sm">
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
                      ? "text-white font-medium"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* MAIN CONTENT */}
          <div className="space-y-12 max-w-3xl">

            {/* OVERVIEW */}
            <section id="overview">
              <h1 className="text-4xl font-semibold">
                {challenge.title}
              </h1>

              <p className="mt-6 text-[15px] leading-8 text-gray-300">
                {challenge.description}
              </p>
            </section>

            {/* EXAMPLES */}
            {challenge.examples?.length > 0 && (
              <section id="examples" className="space-y-6">
                <h2 className="text-2xl font-semibold">Examples</h2>

                {challenge.examples.map((ex: any, i: number) => (
                  <div key={i} className="relative group">
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `Input:\n${ex.input}\n\nOutput:\n${ex.output}`
                        )
                      }
                      className="absolute top-2 right-2 text-xs bg-white/10 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      Copy
                    </button>

                    <pre className="bg-[#07080b] p-4 rounded-xl text-sm text-gray-200 overflow-x-auto">
Input:
{ex.input}

Output:
{ex.output}
                    </pre>

                    {ex.explanation && (
                      <p className="mt-3 text-[15px] leading-8 text-gray-300">
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
                <h2 className="text-2xl font-semibold">Constraints</h2>

                <ul className="space-y-2 text-gray-300">
                  {challenge.constraints.map((c: string, i: number) => (
                    <li key={i}>• {c}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* GUIDANCE */}
            <section id="guidance" className="space-y-4">
              <h2 className="text-2xl font-semibold">
                Approach Guidance
              </h2>

              <p className="text-gray-300 leading-8">
                Think about the pattern behind the problem before coding.
              </p>

              <p className="text-gray-300 leading-8">
                Use examples to validate your understanding.
              </p>

              <p className="text-gray-300 leading-8">
                Consider edge cases and constraints carefully.
              </p>
            </section>
          </div>

          {/* RIGHT PANEL */}
          <aside className="hidden xl:block sticky top-24 h-fit">
            <div className="rounded-xl border border-white/10 p-5 bg-[#0b0b0f]">
              <p className="text-sm text-gray-400">Next Step</p>

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
    </div>
  );
}