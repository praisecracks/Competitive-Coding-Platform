"use client";

import Link from "next/link";
import Image from "next/image";
import { Cookie, Settings, BarChart3, Clock, ExternalLink } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Footer from "../components/Footer";
import logo from "../../assets/CodeMaster_Logo.png";

export default function CookiesPage() {
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
            <Cookie className="h-3.5 w-3.5 text-pink-400" />
            <span className="text-xs font-medium uppercase tracking-wider text-pink-300">
              Cookie Policy
            </span>
          </div>
          
          <h1 className="mt-5 text-2xl sm:text-3xl font-bold tracking-tight">
            How we use cookies
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
                <Cookie className="h-4 w-4 text-pink-400" />
              </div>
              <h2 className="text-base font-semibold">1. What Are Cookies</h2>
            </div>
            <div className="text-gray-400 text-sm leading-6">
              <p>
                Cookies are small text files stored on your device when you visit websites. 
                They help remember your preferences and improve functionality.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                <Settings className="h-4 w-4 text-purple-400" />
              </div>
              <h2 className="text-base font-semibold">2. Types of Cookies We Use</h2>
            </div>
            <div className="text-gray-400 text-sm leading-6 space-y-3">
              <div>
                <h3 className="font-medium text-white text-sm">Essential Cookies</h3>
                <p>Required for authentication, session management, and security tokens.</p>
              </div>
              <div>
                <h3 className="font-medium text-white text-sm">Analytics Cookies</h3>
                <p>Help us understand how users interact with our platform.</p>
              </div>
              <div>
                <h3 className="font-medium text-white text-sm">Preference Cookies</h3>
                <p>Remember your settings and personalization choices.</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                <BarChart3 className="h-4 w-4 text-blue-400" />
              </div>
              <h2 className="text-base font-semibold">3. Third-Party Cookies</h2>
            </div>
            <div className="text-gray-400 text-sm leading-6">
              <p>We use analytics and may use payment processing services that set their own cookies.</p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                <Settings className="h-4 w-4 text-amber-400" />
              </div>
              <h2 className="text-base font-semibold">4. Managing Cookies</h2>
            </div>
            <div className="text-gray-400 text-sm leading-6">
              <p className="mb-2">You can control or delete cookies in your browser settings.</p>
              <p className="text-xs text-gray-500">Note: Disabling essential cookies will prevent platform login.</p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                <Clock className="h-4 w-4 text-emerald-400" />
              </div>
              <h2 className="text-base font-semibold">5. Cookie Retention</h2>
            </div>
            <div className="text-gray-400 text-sm leading-6">
              <ul className="list-disc list-inside space-y-1">
                <li>Session cookies: Deleted when you close your browser</li>
                <li>Authentication cookies: Valid for 30 days</li>
                <li>Analytics cookies: Up to 12 months</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10">
                <ExternalLink className="h-4 w-4 text-rose-400" />
              </div>
              <h2 className="text-base font-semibold">6. Updates</h2>
            </div>
            <div className="text-gray-400 text-sm leading-6">
              <p>We may update this policy as our practices evolve.</p>
            </div>
          </section>
        </div>

        {/* Quick links */}
        <div className="mt-8 pt-4 border-t border-white/5">
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="/privacy" className="text-pink-400 hover:text-pink-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-pink-400 hover:text-pink-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer variant="minimal" />
    </div>
  );
}