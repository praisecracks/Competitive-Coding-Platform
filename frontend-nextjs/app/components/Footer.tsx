"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import logo from "../../assets/CodeMaster_Logo.png";

interface FooterProps {
  variant?: "default" | "dashboard" | "minimal";
  showDiagnostics?: boolean;
}

export default function Footer({
  variant = "default",
  showDiagnostics = true,
}: FooterProps) {
  const pathname = usePathname();
  const [time, setTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour12: false,
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const footerLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "#features" },
    { name: "Challenges", href: "/challenges" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  const resourceLinks = [
    { name: "Documentation", href: "/docs" },
    { name: "Blog", href: "/blog" },
    { name: "Community", href: "/community" },
    { name: "Support", href: "/support" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ];

  const isDashboard = pathname?.includes("/dashboard");

  if (variant === "minimal") {
    return (
      <footer className="relative overflow-hidden border-t border-white/8 bg-[#020202] text-white">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[10%] top-0 h-36 w-36 rounded-full bg-pink-500/8 blur-[100px]" />
          <div className="absolute right-[12%] top-4 h-40 w-40 rounded-full bg-purple-500/8 blur-[110px]" />
          <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:60px_60px]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 rounded-[28px] border border-white/8 bg-white/[0.025] px-5 py-5 backdrop-blur-xl sm:flex-row sm:px-6">
            <Link
              href={isDashboard ? "/dashboard" : "/"}
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-pink-500/10 to-purple-500/10 shadow-[0_8px_30px_rgba(217,70,239,0.10)]">
                <Image
                  src={logo}
                  alt="CodeMaster Logo"
                  width={34}
                  height={34}
                  className="h-full w-full object-contain p-1"
                  priority
                />
              </div>

              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold tracking-tight text-white sm:text-base">
                  CODEMASTER
                </span>
                <span className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/35">
                  Competitive Coding Platform
                </span>
              </div>
            </Link>

            <div className="flex flex-wrap items-center justify-center gap-5 sm:justify-end">
              {legalLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-xs text-gray-500 transition-colors hover:text-white"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} CODEMASTER. All rights reserved.
            </p>

            <p className="text-xs text-gray-600">
              Secure access • Premium developer experience
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#020202] pt-16 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[8%] top-10 h-48 w-48 rounded-full bg-pink-500/10 blur-[120px]" />
        <div className="absolute right-[10%] top-16 h-56 w-56 rounded-full bg-purple-500/10 blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 pb-12 md:grid-cols-2 xl:grid-cols-4">
          <div className="max-w-sm">
            <Link
              href={pathname?.includes("/dashboard") ? "/dashboard" : "/"}
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-pink-500/10 to-purple-500/10 shadow-[0_8px_30px_rgba(217,70,239,0.10)]">
                <Image
                  src={logo}
                  alt="CodeMaster Logo"
                  width={34}
                  height={34}
                  className="h-full w-full object-contain p-1"
                  priority
                />
              </div>

              <div className="flex flex-col leading-none">
                <span className="text-lg font-black tracking-tight text-white">
                  CODEMASTER
                </span>
                <span className="mt-1 text-[10px] uppercase tracking-[0.25em] text-pink-400">
                  Competitive Coding Platform
                </span>
              </div>
            </Link>

            <p className="mt-5 text-sm leading-7 text-gray-400">
              CODEMASTER helps developers improve through mission-based coding,
              intelligent feedback, replay systems, and competitive training.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/10 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.7)]" />
              <span className="text-[11px] font-medium text-emerald-300">
                System Online
              </span>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-pink-400">
              Navigation
            </h3>
            <ul className="space-y-3">
              {footerLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-pink-400">
              Resources
            </h3>
            <ul className="space-y-3">
              {resourceLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {showDiagnostics && (
            <div>
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-pink-400">
                System Status
              </h3>

              <div className="space-y-4 rounded-[24px] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Platform Status</span>
                  <span className="text-emerald-400">Operational</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Active Users</span>
                  <span className="text-white">
                    {variant === "dashboard" ? "3,842" : "2,847"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Local Time</span>
                  <span className="font-mono text-white">{time || "00:00:00"}</span>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">System Load</span>
                    <span className="text-gray-400">
                      {variant === "dashboard" ? "28%" : "12%"}
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: variant === "dashboard" ? "28%" : "12%",
                      }}
                      transition={{ duration: 0.8 }}
                      className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} CODEMASTER. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 sm:justify-end">
            {legalLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-xs text-gray-500 transition-colors hover:text-white"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}