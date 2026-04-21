"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const pricingPlans = [
  {
    name: "Free",
    monthly: 0,
    yearlyTotal: 0,
    yearlyMonthlyEquivalent: 0,
    description:
      "Explore CODEMASTER, test the experience, and start improving your coding workflow.",
    features: [
      "Access to selected missions",
      "Basic mission reports",
      "Public challenge browsing",
      "Limited replays",
      "Basic progress tracking",
    ],
    cta: "Start Free",
    popular: false,
    badge: "For Starters",
    icon: "◌",
  },
  {
    name: "Standard",
    monthly: 3,
    yearlyTotal: 24,
    yearlyMonthlyEquivalent: 2,
    description:
      "For focused learners who want deeper insights, stronger progress tracking, and more training power.",
    features: [
      "Full mission library access",
      "Live thinking analyzer",
      "Deeper mission reports",
      "Replay system access",
      "Guided mastery tools",
      "Skill tracking & insights",
      "Priority support",
    ],
    cta: "Choose Standard",
    popular: true,
    badge: "Most Popular",
    icon: "✦",
  },
  {
    name: "Premium",
    monthly: 7,
    yearlyTotal: 60,
    yearlyMonthlyEquivalent: 5,
    description:
      "For advanced coders who want premium intelligence, deeper performance feedback, and elite training tools.",
    features: [
      "Everything in Standard",
      "Advanced performance intelligence",
      "Ranked duel access",
      "Custom mission creation",
      "Advanced strategy suggestions",
      "Deeper replay intelligence",
      "Premium training systems",
    ],
    cta: "Go Premium",
    popular: false,
    badge: "Advanced",
    icon: "⬢",
  },
];

function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const displayedPlans = useMemo(() => {
    return pricingPlans.map((plan) => {
      if (billingCycle === "monthly") {
        return {
          ...plan,
          displayPrice: plan.monthly,
          subLabel:
            plan.monthly === 0 ? "No credit card required" : "Per month",
          savings:
            plan.monthly > 0
              ? `$${plan.monthly * 12 - plan.yearlyTotal} saved yearly`
              : "",
        };
      }

      return {
        ...plan,
        displayPrice: plan.yearlyMonthlyEquivalent,
        subLabel:
          plan.yearlyTotal === 0
            ? "No credit card required"
            : `$${plan.yearlyTotal} billed yearly`,
        savings:
          plan.yearlyTotal > 0
            ? `Save ${Math.round(
                ((plan.monthly * 12 - plan.yearlyTotal) /
                  (plan.monthly * 12)) *
                  100
              )}%`
            : "",
      };
    });
  }, [billingCycle]);

  return (
    <section
      id="pricing"
      className="relative scroll-mt-20 overflow-hidden bg-[#020202] px-4 py-20 text-white sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[8%] top-16 h-72 w-72 rounded-full bg-pink-500/10 blur-[130px]" />
        <div className="absolute right-[8%] top-10 h-80 w-80 rounded-full bg-violet-500/10 blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-pink-300 backdrop-blur-xl">
            Pricing
          </div>

          <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">
            Simple pricing for
            <span className="block bg-gradient-to-r from-white via-pink-200 to-purple-300 bg-clip-text text-transparent">
              serious coding growth
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
            Start free, grow at your pace, and upgrade when you want stronger
            feedback, deeper analytics, and a more competitive training
            experience.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2 shadow-[0_10px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() => setBillingCycle("yearly")}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                billingCycle === "yearly"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Yearly
            </button>

            <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Save more yearly
            </div>
          </div>
        </motion.div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {displayedPlans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              whileHover={{ y: -4 }}
              className={`group relative flex h-full flex-col overflow-visible rounded-3xl border transition-all duration-300 ${
                plan.popular
                  ? "z-10 border-pink-500/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] shadow-[0_0_0_1px_rgba(236,72,153,0.08),0_24px_60px_rgba(168,85,247,0.14)]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
              }`}
            >
              <div
                className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${
                  plan.popular ? "via-pink-500/80" : "via-white/25"
                } to-transparent`}
              />

              {plan.popular && (
                <div className="absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-1/2">
                  <div className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_28px_rgba(236,72,153,0.28)]">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="flex h-full flex-col p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-300">
                      {plan.badge}
                    </div>

                    <h3 className="mt-4 text-[32px] font-bold tracking-tight text-white leading-none">
                      {plan.name}
                    </h3>

                  <p className="mt-3 max-w-[32ch] text-sm leading-6 text-gray-400">
                    {plan.description}
                  </p>
                  </div>

                  <div
                    className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-lg ${
                      plan.popular
                        ? "border-pink-500/20 bg-gradient-to-br from-pink-500/20 to-purple-500/20 text-white"
                        : "border-white/10 bg-white/5 text-white"
                    }`}
                  >
                    {plan.icon}
                  </div>
                </div>

                <div className="mt-4 border-t border-white/10 pt-6">
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-black tracking-[-0.05em] text-white leading-none">
                      {plan.displayPrice === 0 ? "Free" : `$${plan.displayPrice}`}
                    </span>

                    {plan.displayPrice !== 0 && (
                      <span className="pb-1 text-sm text-gray-500">/month</span>
                    )}
                  </div>

                  <div className="mt-2 min-h-[42px]">
                    <p className="text-sm text-gray-400">{plan.subLabel}</p>
                    {billingCycle === "yearly" && plan.savings ? (
                      <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-emerald-400">
                        {plan.savings}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-2 space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[11px] text-pink-300">
                        ✓
                      </span>
                      <span className="text-sm leading-6 text-gray-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

              <div className="mt-7 pt-1">
                <Link
                  href="/signup"
                  className={`inline-flex w-full items-center justify-center rounded-2xl px-5 py-3.5 text-sm font-semibold transition-all duration-300 no-underline ${
                    plan.popular
                      ? "bg-white !text-black border border-white/80 hover:bg-[#f5f5f5] hover:shadow-[0_12px_34px_rgba(255,255,255,0.12)]"
                      : "border border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <span className={plan.popular ? "!text-black" : "text-white"}>
                    {plan.cta}
                  </span>
                </Link>
              </div>

                <div className="mt-3 text-center text-xs text-gray-500">
                  {plan.name === "Free"
                    ? "Perfect for getting started"
                    : plan.name === "Standard"
                    ? "Best balance of value and growth"
                    : "Built for serious competitive progress"}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-5 backdrop-blur-xl"
        >
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium text-white">
                Early-stage startup pricing
              </p>
              <p className="mt-1 text-sm text-gray-400">
                These plans are intentionally founder-friendly to help users get
                in early and grow with the platform.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-gray-400">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                No hidden fees
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                Upgrade anytime
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                Cancel anytime
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Pricing;