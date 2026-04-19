"use client";

import Link from "next/link";
import Image from "next/image";
import { Shield, Lock, Eye, Database, Users, Mail } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Footer from "../components/Footer";
import logo from "../../assets/CodeMaster_Logo.png";

export default function PrivacyPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className={`min-h-screen ${isLight ? "bg-gray-50 text-gray-900" : "bg-[#08080a] text-white"}`}>
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
              Privacy Policy
            </span>
          </div>
          
          <h1 className="mt-5 text-2xl sm:text-3xl font-bold tracking-tight">
            How we protect your data
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
                <Users className="h-4 w-4 text-pink-400" />
              </div>
              <h2 className="text-base font-semibold">Information We Collect</h2>
            </div>
            <div className="space-y-2 text-gray-400 text-sm leading-6">
              <p>
                We collect information you provide directly when creating an account, 
                including your username, email address, and profile information. We also collect 
                data about your activity on the platform, such as challenges completed, code submissions, 
                and duel participation.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                <Database className="h-4 w-4 text-purple-400" />
              </div>
              <h2 className="text-base font-semibold">How We Use Your Data</h2>
            </div>
            <div className="space-y-2 text-gray-400 text-sm leading-6">
              <p>
                Your data is used exclusively to provide and improve CODEMASTER services. 
                This includes authenticating your account, tracking your progress, analyzing 
                performance, and providing personalized feedback through our Thinking Analyzer.
              </p>
              <p>
                <span className="text-pink-400 font-medium">We never sell your personal data.</span> 
                Your information is never shared with third parties for marketing purposes.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                <Lock className="h-4 w-4 text-emerald-400" />
              </div>
              <h2 className="text-base font-semibold">Data Security</h2>
            </div>
            <div className="space-y-2 text-gray-400 text-sm leading-6">
              <p>
                We implement industry-standard security measures to protect your data, including 
                encrypted connections (HTTPS), secure authentication with JWT tokens, 
                and regular security audits. Our backend runs on secure infrastructure.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                <Eye className="h-4 w-4 text-blue-400" />
              </div>
              <h2 className="text-base font-semibold">Your Rights</h2>
            </div>
            <div className="space-y-2 text-gray-400 text-sm leading-6">
              <p>
                You have full control over your data. You can access your profile 
                information at any time, edit your details in settings, or download 
                your data.
              </p>
              <p>
                To request deletion of your account and all associated data, contact 
                our support team. We will process your request within 30 days.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10">
                <Mail className="h-4 w-4 text-rose-400" />
              </div>
              <h2 className="text-base font-semibold">Contact Us</h2>
            </div>
            <div className="space-y-2 text-gray-400 text-sm leading-6">
              <p>
                If you have questions about this Privacy Policy or want to exercise 
                your rights, please reach out through our support channels.
              </p>
            </div>
          </section>
        </div>

        {/* Footer note */}
        <div className="mt-8 pt-4 border-t border-white/5">
          <p className="text-xs text-gray-500">
            This policy is part of our commitment to transparency.
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer variant="minimal" />
    </div>
  );
}