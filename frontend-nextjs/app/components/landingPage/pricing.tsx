"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const pricingPlans = [
  {
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    description: "For developers exploring CODEMASTER and getting started.",
    features: [
      "Access to selected missions",
      "Basic mission reports",
      "Public challenge browsing",
      "Limited replay access",
      "Basic progress tracking",
    ],
    cta: "Start Free",
    popular: false,
    badge: "Start Here",
    icon: "◌",
    accent: "from-white/20 to-white/5",
  },
  {
    name: "",
    price: { monthly: 12, yearly: 9 },
    description:
      "For serious learners who want better feedback and steady improvement.",
    features: [
      "Full mission library access",
      "Live thinking analyzer",
      "Deeper mission reports",
      "Replay system access",
      "Guided mastery tools",
      "Skill tracking & insights",
      "Priority support",
    ],
    cta: "Choose ",
    popular: true,
    badge: "Most Popular",
    icon: "✦",
    accent: "from-pink-500/20 to-purple-500/20",
  },
  {
    name: "Premium",
    price: { monthly: 24, yearly: 19 },
    description:
      "For advanced coders who want deeper analysis and elite training tools.",
    features: [
      "Everything in ",
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
    accent: "from-purple-500/20 to-fuchsia-500/20",
  },
];

function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  return (
    <section
    id="pricing"
     className="relative overflow-hidden bg-[#020202] px-4 py-20 text-white sm:px-6 lg:px-8">
      {/* background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[6%] top-12 h-64 w-64 rounded-full bg-pink-500/10 blur-[120px]" />
        <div className="absolute right-[7%] top-24 h-72 w-72 rounded-full bg-purple-500/10 blur-[130px]" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_38%)]" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* header */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <p className="mb-4 text-[10px] font-mono uppercase tracking-[0.35em] text-pink-400">
              Pricing
            </p>

            <h2 className="text-3xl font-black uppercase tracking-tight sm:text-4xl md:text-5xl">
              Choose your
              <span className="block text-2xl bg-gradient-to-r from-pink-500 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
                mastery plan
              </span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-gray-400 sm:text-base">
              Start free, upgrade when you want deeper feedback, stronger
              training tools, and a faster path to real coding improvement.
            </p>
          </motion.div>

          {/* toggle */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <span
              className={`text-sm transition-colors ${
                billingCycle === "monthly" ? "text-white" : "text-gray-500"
              }`}
            >
              Monthly
            </span>

            <button
              onClick={() =>
                setBillingCycle(
                  billingCycle === "monthly" ? "yearly" : "monthly"
                )
              }
              className="relative h-8 w-16 rounded-full border border-white/10 bg-white/5 p-1 transition-colors hover:bg-white/10"
              aria-label="Toggle billing cycle"
            >
              <motion.div
                animate={{ x: billingCycle === "monthly" ? 0 : 32 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
              />
            </button>

            <span
              className={`text-sm transition-colors ${
                billingCycle === "yearly" ? "text-white" : "text-gray-500"
              }`}
            >
              Yearly
              <span className="ml-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-emerald-400">
                Save 25%
              </span>
            </span>
          </motion.div>
        </div>

        {/* pricing cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {pricingPlans.map((plan, idx) => {
            const price =
              billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                className={`relative   border backdrop-blur-xl transition-all duration-300 ${
                  plan.popular
                    ? "border-pink-500/30 bg-white/[0.06] shadow-[0_0_40px_rgba(236,72,153,0.14)]"
                    : "border-white/10 bg-white/[0.03] hover:border-pink-500/20 hover:bg-white/[0.05]"
                }`}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${
                    plan.popular ? "via-pink-500/70" : "via-white/20"
                  } to-transparent`}
                />

                {plan.popular && (
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                    <span className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_18px_rgba(236,72,153,0.3)]">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-7">
                  {/* top */}
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-pink-300">
                        {plan.badge}
                      </div>

                      <h3 className="text-2xl font-black tracking-tight text-white">
                        {plan.name}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-gray-400">
                        {plan.description}
                      </p>
                    </div>

                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br ${plan.accent} text-lg text-white`}
                    >
                      {plan.icon}
                    </div>
                  </div>

                  {/* price */}
                  <div className="mb-6">
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-black tracking-tight text-white">
                        {price === 0 ? "Free" : `$${price}`}
                      </span>
                      {price !== 0 && (
                        <span className="pb-1 text-sm text-gray-500">
                          /{billingCycle === "monthly" ? "month" : "month"}
                        </span>
                      )}
                    </div>

                    {billingCycle === "yearly" && price !== 0 && (
                      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-emerald-400">
                        Billed yearly for better value
                      </p>
                    )}
                  </div>

                  {/* features */}
                  <div className="mb-7 space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/5 text-pink-400">
                          ✓
                        </span>
                        <span className="text-sm leading-6 text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* cta */}
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href={plan.name === "Premium" ? "/signup" : "/signup"}
                      className={`inline-flex w-full items-center justify-center rounded-2xl px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${
                        plan.popular
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_28px_rgba(236,72,153,0.22)] hover:shadow-[0_0_36px_rgba(168,85,247,0.28)]"
                          : "border border-white/10 bg-white/5 text-white hover:border-pink-400/25 hover:bg-white/10"
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* bottom value block */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.35 }}
          className="mt-20"
        >

        </motion.div>
      </div>
    </section>
  );
}

export default Pricing;