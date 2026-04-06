"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowUpRight,
  Activity,
  Clock3,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { FaGithub, FaTwitter, FaDiscord } from "react-icons/fa";
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
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour12: false,
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

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
    { name: "Documentation" },
    { name: "Blog" },
    { name: "Community" },
    { name: "Support" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ];

  const socialLinks = [
    { name: "GitHub", href: "#", icon: FaGithub },
    { name: "Twitter", href: "#", icon: FaTwitter },
    { name: "Discord", href: "#", icon: FaDiscord },
    { name: "Community", href: "#", icon: MessageCircle },
  ];

  const isDashboard = pathname?.includes("/dashboard");

  if (variant === "minimal") {
    return (
      <footer className="relative overflow-hidden border-t border-white/10 bg-[#020202] text-white">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[10%] top-0 h-36 w-36 rounded-full bg-pink-500/10 blur-[100px]" />
          <div className="absolute right-[12%] top-4 h-40 w-40 rounded-full bg-purple-500/10 blur-[110px]" />
          <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:60px_60px]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
            <Link
              href={isDashboard ? "/dashboard" : "/"}
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
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
                  className="text-xs text-gray-500 transition-colors duration-300 hover:text-white"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-4 text-center sm:flex-row sm:text-left">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} CODEMASTER. All rights reserved.
            </p>

            <p className="text-xs text-gray-600">
              Premium developer experience
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#020202] pt-16 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[8%] top-10 h-52 w-52 rounded-full bg-pink-500/10 blur-[120px]" />
        <div className="absolute right-[10%] top-16 h-60 w-60 rounded-full bg-purple-500/10 blur-[130px]" />
        <div className="absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_35%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 pb-12 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div className="max-w-sm">
            <Link
              href={isDashboard ? "/dashboard" : "/"}
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                <Image
                  src={logo}
                  alt="CodeMaster Logo"
                  width={36}
                  height={36}
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

            <p className="mt-5 max-w-[28rem] text-sm leading-7 text-gray-400">
              Competitive coding training for developers who want structured growth.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-label={item.name}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gray-300 transition-all duration-300 hover:border-pink-500/25 hover:bg-white hover:text-black"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-pink-400">
              Navigation
            </h3>

            <ul className="space-y-3">
              {footerLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-gray-400 transition-colors duration-300 hover:text-white"
                  >
                    <span>{item.name}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-pink-400">
              Resources
            </h3>

            <ul className="space-y-3">
              {resourceLinks.map((item) => (
                <li key={item.name}>
                  <span className="text-sm text-gray-500">{item.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {showDiagnostics && (
            <div>
              <div className="mb-5 flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <Activity className="h-4 w-4 text-pink-300" />
                </div>

                <div>
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-pink-400">
                    System Status
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Live platform diagnostics
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Platform Status</span>
                  <span className="inline-flex items-center gap-2 text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.7)]" />
                    Operational
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Security</span>
                  <span className="text-gray-300">Secure Platform</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Active Users</span>
                  <span className="text-white">
                    {variant === "dashboard" ? "3,842" : "2,847"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-500">
                    <Clock3 className="h-3.5 w-3.5" />
                    Local Time
                  </span>
                  <span className="font-mono text-white">
                    {time || "00:00:00"}
                  </span>
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

                <div className="inline-flex items-center gap-2 text-[11px] text-gray-400">
                  <Sparkles className="h-3.5 w-3.5 text-pink-300" />
                  Premium developer experience
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-white/10 pt-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-pink-400">
                Built for serious coders
              </p>
              <p className="mt-4 text-sm leading-7 text-gray-400">
                Premium coding workflows designed for growth, competition, and clarity.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 text-sm text-gray-500 sm:grid-cols-3 sm:gap-6">
              <div>
                <p className="text-white">Product</p>
                <p className="mt-1">Mission-based training</p>
              </div>
              <div>
                <p className="text-white">Experience</p>
                <p className="mt-1">Fast, clean, and focused</p>
              </div>
              <div>
                <p className="text-white">Focus</p>
                <p className="mt-1">Growth through real challenges</p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mt-10 pt-6"
          >
            <h1 className="text-center text-[clamp(3.2rem,11vw,9rem)] font-black leading-none tracking-[-0.06em] text-white/95">
              CODEMASTER
            </h1>
            <p className="mt-3 text-center text-sm text-gray-500">
              Train. Compete. Master your coding skills.
            </p>
          </motion.div>
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
                className="text-xs text-gray-500 transition-colors duration-300 hover:text-white"
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