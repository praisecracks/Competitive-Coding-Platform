"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { persistUserSession, sanitizeRedirect } from "@/lib/auth";

function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const username = searchParams.get("username");
    const email = searchParams.get("email");
    const profilePic = searchParams.get("profile_pic");
    const role = searchParams.get("role");
    const error = searchParams.get("error");

    if (error) {
      router.push(`/login?error=${encodeURIComponent(error)}`);
      return;
    }

    if (token && username) {
      console.log("GitHub Auth successful, persisting session...");
      // Save auth info using the same function as regular login
      persistUserSession({
        token,
        username,
        email: email || "",
        profile_pic: profilePic || "",
        role: role || "user",
      });

      // Check for stored redirect from OAuth flow
      const storedRedirect = localStorage.getItem("oauth_redirect");
      localStorage.removeItem("oauth_redirect"); // Clean up
      const redirectUrl = sanitizeRedirect(storedRedirect);

      // Force a small delay to ensure localStorage is written before redirecting
      const timer = setTimeout(() => {
        window.location.href = redirectUrl;
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // Fallback if missing data
      router.push("/login?error=Invalid+callback+data");
    }
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505]">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-2 border-fuchsia-500 border-t-transparent"></div>
        <p className="text-sm text-white/50">Completing authentication...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#050505]">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-2 border-fuchsia-500 border-t-transparent"></div>
            <p className="text-sm text-white/50">Loading authentication...</p>
          </div>
        </div>
      }
    >
      <AuthCallback />
    </Suspense>
  );
}
