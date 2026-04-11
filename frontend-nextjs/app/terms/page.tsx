"use client";

import Link from "next/link";
import Image from "next/image";
import { Shield, AlertTriangle, Code, Copyright, Ban } from "lucide-react";
import Footer from "../components/Footer";
import logo from "../../assets/CodeMaster_Logo.png";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#08080a] text-white">
      {/* Header with Logo */}
      <header className="border-b border-white/5">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
              <Image
                src={logo}
                alt="CodeMaster Logo"
                width={28}
                height={28}
                className="h-full w-full object-contain p-0.5"
              />
            </div>
            <span className="text-sm font-bold tracking-tight">CODEMASTER</span>
          </Link>
          
          <Link 
            href="/" 
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-3 py-1">
            <Shield className="h-3.5 w-3.5 text-pink-400" />
            <span className="text-xs font-medium uppercase tracking-wider text-pink-300">
              Terms of Service
            </span>
          </div>
          
          <h1 className="mt-5 text-2xl sm:text-3xl font-bold tracking-tight">
            Rules of the platform
          </h1>
          
          <p className="mt-2 text-gray-400 text-sm">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <div className="space-y-4">
          {/* Section 1 */}
          <section className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/10">
                <Shield className="h-4 w-4 text-pink-400" />
              </div>
              <h2 className="text-base font-semibold">1. Acceptance of Terms</h2>
            </div>
            <div className="text-gray-400 text-sm leading-6">
              <p>
                By accessing and using CODEMASTER, you acknowledge that you have read, 
                understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                <AlertTriangle className="h-4 w-4 text-purple-400" />
              </div>
              <h2 className="text-base font-semibold">2. Account Responsibilities</h2>
            </div>
            <div className="text-gray-400 text-sm leading-6 space-y-2">
              <p>You are responsible for maintaining the security of your account credentials.</p>
              <p>You must be at least 13 years old to create an account.</p>
              <p>You are solely responsible for all activities under your account.</p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                <Ban className="h-4 w-4 text-amber-400" />
              </div>
              <h2 className="text-base font-semibold">3. Acceptable Use</h2>
            </div>
            <div className="text-gray-400 text-sm leading-6">
              <p className="mb-2">The following activities are strictly prohibited:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-500">
                <li>Attempting to circumvent time limits or scoring systems</li>
                <li>Sharing account credentials</li>
                <li>Using automated bots without authorization</li>
                <li>Harassment or abusive behavior</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                <Code className="h-4 w-4 text-blue-400" />
              </div>
              <h2 className="text-base font-semibold">4. Code Submissions</h2>
            </div>
            <div className="text-gray-400 text-sm leading-6">
              <p>All code submitted must be your original work. Plagiarized submissions will be disqualifed.</p>
              <p className="mt-2">You retain ownership, but grant us license to use for evaluation.</p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10">
                <Copyright className="h-4 w-4 text-rose-400" />
              </div>
              <h2 className="text-base font-semibold">5. Intellectual Property</h2>
            </div>
            <div className="text-gray-400 text-sm leading-6">
              <p>CODEMASTER and all platform content remain our intellectual property.</p>
              <p className="mt-2">You may not copy or distribute any part without authorization.</p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
                <Ban className="h-4 w-4 text-red-400" />
              </div>
              <h2 className="text-base font-semibold">6. Termination</h2>
            </div>
            <div className="text-gray-400 text-sm leading-6">
              <p>We reserve the right to suspend or terminate accounts that violate these terms.</p>
            </div>
          </section>
        </div>

        {/* Footer note */}
        <div className="mt-8 pt-4 border-t border-white/5">
          <p className="text-xs text-gray-500">
            Continued use constitutes acceptance of any updated terms.
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer variant="minimal" />
    </div>
  );
}