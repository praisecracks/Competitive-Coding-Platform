"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const pricingFaqs = [
  {
    question: "Can I start with the free plan?",
    answer:
      "Yes. The free plan lets you explore CODEMASTER, try selected missions, and understand the platform before committing to a paid plan.",
  },
  {
    question: "What makes Standard worth paying for?",
    answer:
      "Standard unlocks deeper value, more missions, stronger feedback, replay access, guided mastery tools, and better progress tracking.",
  },
  {
    question: "What makes Premium different from Standard?",
    answer:
      "Premium is built for developers who want deeper intelligence: advanced analysis, strategic feedback, ranked duels, and elite training tools.",
  },
  {
    question: "Is CODEMASTER only for competitive programmers?",
    answer:
      "No. It’s for anyone who wants structured improvement. From learners to interview prep to competitive coders.",
  },
  {
    question: "Can I upgrade later?",
    answer:
      "Yes. You can start free and upgrade anytime when you need deeper insights and more powerful tools.",
  },
  {
    question: "Do I need to pay before trying the platform?",
    answer:
      "No. CODEMASTER is free to start, so you can experience it first before upgrading.",
  },
];

export default function PricingFAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
      <section
    id="faq"
     className="relative scroll-mt-20 overflow-hidden py-20 text-white">
      {/* background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[8%] top-10 h-56 w-56 rounded-full bg-pink-500/10 blur-[120px]" />
        <div className="absolute right-[10%] top-24 h-64 w-64 rounded-full bg-purple-500/10 blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.35em] text-pink-400">
            FAQ
          </p>

          <h2 className="text-3xl font-black uppercase tracking-tight sm:text-3xl">
            Questions before you upgrade
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
            Everything you need to know before choosing the plan that fits your
            learning goals.
          </p>
        </motion.div>

        {/* FAQ LIST */}
        <div className="space-y-4">
          {pricingFaqs.map((faq, index) => {
            const isOpen = openFaq === index;

            return (
              <motion.div
                key={faq.question}
                layout
                className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all duration-300 hover:border-pink-500/20"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-base font-semibold text-gray-200 xs:text-lg">
                    {faq.question}
                  </span>

                  <span
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm text-white transition-transform duration-300 ${
                      isOpen ? "rotate-45" : "rotate-0"
                    }`}
                  >
                    +
                  </span>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5">
                    <p className="text-sm leading-7 text-gray-400 xs:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* FINAL CTA (IMPORTANT) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16"
        >
          <div className="rounded-[30px] border border-white/10 bg-gradient-to-r from-pink-500/10 to-purple-500/10 p-8 text-center backdrop-blur-xl">
            <h3 className="text-2xl font-black text-white sm:text-3xl">
              Ready to start your first mission?
            </h3>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
              Start free and experience how CODEMASTER helps you think better,
              solve faster, and grow consistently.
            </p>

            <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(236,72,153,0.22)]"
              >
                Start Mission
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:border-pink-400/25 hover:bg-white/10"
              >
                I already have an account
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}