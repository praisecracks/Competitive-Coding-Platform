"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

interface GuestGuardProps {
  children: React.ReactNode;
}

/**
 * GuestGuard ensures that only non-authenticated users can access the wrapped page.
 * If a user is already logged in, they are redirected to the dashboard.
 */
export default function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      // If already logged in, push to dashboard and don't render children
      router.replace("/dashboard");
    } else {
      // Not logged in, safe to show the page
      setIsChecking(false);
    }
  }, [router]);

  // While checking, we show a blank screen or a loader to prevent flicker
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-fuchsia-400" />
          <p className="text-xs uppercase tracking-[0.35em] text-white/45">
            Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
