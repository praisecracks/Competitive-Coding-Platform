"use client";

import { useTheme } from "@/app/context/ThemeContext";
import { Code2 } from "lucide-react";
import { FaGithub, FaTwitter, FaDiscord } from "react-icons/fa";
import Link from "next/link";

export default function PageFooter() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  

  const footerLinks = {
    platform: [
      { label: "Learning", href: "/dashboard/learning" },
      { label: "Challenges", href: "/dashboard/challenges" },
      { label: "Leaderboard", href: "/dashboard/leaderboard" },
      { label: "Profile", href: "/dashboard/profile" },
    ],
    resources: [
      { label: "Documentation", href: "", comingSoon: true },
      { label: "Help Center", href: "", comingSoon: true },
      { label: "Community", href: "", comingSoon: true },
    ],
    legal: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookies", href: "/cookies" },
    ],
  };

  const socialLinks = [
    { icon: FaGithub, label: "GitHub" },
    { icon: FaTwitter, label: "Twitter" },
    { icon: FaDiscord, label: "Discord" },
  ];

  return (
    <footer
      className={`mt-16 border-t px-4 py-8 select-none ${
        isLight
          ? "border-gray-200 bg-gray-50"
          : "border-white/5 bg-[#0a0a0a]"
      }`}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {/* Platform Column */}
          <div>
            <h3
              className={`mb-3 text-xs font-semibold uppercase tracking-widest ${
                isLight ? "text-gray-900" : "text-gray-300"
              }`}
            >
              Platform
            </h3>
            <ul className="space-y-1.5">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`text-xs transition-colors ${
                      isLight
                        ? "text-gray-500 hover:text-purple-600"
                        : "text-gray-500 hover:text-purple-400"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3
              className={`mb-3 text-xs font-semibold uppercase tracking-widest ${
                isLight ? "text-gray-900" : "text-gray-300"
              }`}
            >
              Resources
            </h3>
            <ul className="space-y-1.5">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  {link.comingSoon ? (
                    <span
                      title="Coming soon"
                      className={`text-xs cursor-help ${
                        isLight
                          ? "text-gray-400 italic"
                          : "text-gray-600 italic"
                      }`}
                    >
                      {link.label}
                    </span>
                  ) : (
                    <Link
                      href={link.href}
                      className={`text-xs transition-colors ${
                        isLight
                          ? "text-gray-500 hover:text-purple-600"
                          : "text-gray-500 hover:text-purple-400"
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3
              className={`mb-3 text-xs font-semibold uppercase tracking-widest ${
                isLight ? "text-gray-900" : "text-gray-300"
              }`}
            >
              Legal
            </h3>
            <ul className="space-y-1.5">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`text-xs transition-colors ${
                      isLight
                        ? "text-gray-500 hover:text-purple-600"
                        : "text-gray-500 hover:text-purple-400"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded ${
                  isLight
                    ? "bg-purple-100 text-purple-600"
                    : "bg-purple-500/20 text-purple-400"
                }`}
              >
                <Code2 className="h-3.5 w-3.5" />
              </div>
              <span
                className={`text-sm font-semibold ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                CodeMaster
              </span>
            </div>
            <p
              className={`mb-3 text-xs leading-relaxed ${
                isLight ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Level up your coding skills with interactive challenges and guided learning paths.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <span
                  key={social.label}
                  title="Coming soon"
                  className={`cursor-help transition-colors ${
                    isLight
                      ? "text-gray-400 italic"
                      : "text-gray-600 italic"
                  }`}
                >
                  <social.icon className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div
          className={`mt-8 flex flex-col items-center justify-between gap-2 border-t pt-4 md:flex-row ${
            isLight ? "border-gray-200" : "border-white/5"
          }`}
        >
          <p
            className={`text-xs ${
              isLight ? "text-gray-400" : "text-gray-600"
            }`}
          >
            © 2026 CodeMaster. All rights reserved.
          </p>
          <p
            className={`text-xs ${
              isLight ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Built with passion for developers
          </p>
        </div>
      </div>
    </footer>
  );
}