"use client";

import Link from "next/link";

export default function AppFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#050507] select-none">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">

        {/* LEFT */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 select-none">
          <span className="text-gray-500">
            © {new Date().getFullYear()} CODEMASTER
          </span>

          <span className="hidden sm:inline text-gray-600 select-none">•</span>

          <span className="text-gray-500">
            Train harder. Solve smarter.
          </span>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          <Link
            href="/docs"
            className="transition hover:text-white"
          >
            Docs
          </Link>

          <Link
            href="/privacy"
            className="transition hover:text-white"
          >
            Privacy
          </Link>

          <Link
            href="/terms"
            className="transition hover:text-white"
          >
            Terms
          </Link>

          <span className="hidden sm:inline text-gray-600 select-none">•</span>

          <span className="text-xs text-gray-600 select-none">
            v2.1
          </span>
        </div>
      </div>
    </footer>
  );
}