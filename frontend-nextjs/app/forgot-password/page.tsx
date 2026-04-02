"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GuestGuard from "../components/GuestGuard";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

type RequestState = "IDLE" | "LOADING" | "SUCCESS" | "ERROR";

type ForgotPasswordResponse = {
  message?: string;
  error?: string;
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [requestState, setRequestState] = useState<RequestState>("IDLE");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const isValidEmail = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }, [email]);

  const resetFeedback = () => {
    if (requestState !== "IDLE") {
      setRequestState("IDLE");
      setFeedbackMessage("");
    }
  };

  const mapForgotPasswordError = (error: string | undefined) => {
    switch (error) {
      case "MISSING_EMAIL":
        return "Please enter your email address.";
      case "INVALID_EMAIL":
        return "Please enter a valid email address.";
      case "FORGOT_PASSWORD_FAILED":
        return "We could not process your request right now.";
      case "RATE_LIMITED":
        return "Too many reset requests. Please wait a few minutes before trying again.";
      default:
        return error || "Something went wrong while trying to send the reset email.";
    }
  };

  const handleRecovery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (requestState === "LOADING") return;

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setRequestState("ERROR");
      setFeedbackMessage("Please enter your email address.");
      return;
    }

    if (!isValidEmail) {
      setRequestState("ERROR");
      setFeedbackMessage("Please enter a valid email address.");
      return;
    }

    setRequestState("LOADING");
    setFeedbackMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
        }),
      });

      const data: ForgotPasswordResponse | null = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        setRequestState("ERROR");
        setFeedbackMessage(mapForgotPasswordError(data?.error));
        return;
      }

      setRequestState("SUCCESS");
      setFeedbackMessage(
        data?.message ||
          "If an account exists for this email, a password reset link has been sent."
      );
    } catch (error) {
      console.error("Forgot password request failed:", error);
      setRequestState("ERROR");
      setFeedbackMessage(
        "Unable to connect to the server. Please try again."
      );
    }
  };

  return (
    <GuestGuard>
      <div className="min-h-screen bg-[#050505] text-white selection:bg-fuchsia-500/20 selection:text-white">
        <Header />

        <main className="relative overflow-hidden px-4 pb-12 pt-32 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-[130px]" />
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "42px 42px",
                maskImage:
                  "radial-gradient(circle at center, black 30%, transparent 90%)",
                WebkitMaskImage:
                  "radial-gradient(circle at center, black 30%, transparent 90%)",
              }}
            />
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="mb-10 text-center">
              <Link
                href="/login"
                className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-white/45 transition-colors hover:text-fuchsia-300"
              >
                ← Back to login
              </Link>
              <h1 className="bg-gradient-to-b from-white via-white to-white/55 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl">
                Forgot password?
              </h1>
              <p className="mt-3 text-sm leading-7 text-white/50">
                No worries, we’ll send you reset instructions.
              </p>
            </div>

            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-black/60 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:p-10">
              <form onSubmit={handleRecovery} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/70">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      resetFeedback();
                    }}
                    placeholder="Enter your email"
                    required
                    className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-fuchsia-400/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-fuchsia-500/10"
                  />
                </div>

                <button
                  type="submit"
                  disabled={requestState === "LOADING" || requestState === "SUCCESS"}
                  className="group relative inline-flex h-14 w-full items-center justify-center overflow-hidden rounded-2xl bg-white text-sm font-semibold text-black transition-all hover:scale-[0.995] hover:bg-white/95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.22),rgba(255,255,255,0))] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="relative z-10">
                    {requestState === "LOADING" ? "Sending link..." : "Send reset link"}
                  </span>
                </button>
              </form>

              {requestState === "ERROR" && (
                <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center">
                  <p className="text-sm text-red-300">{feedbackMessage}</p>
                </div>
              )}

              {requestState === "SUCCESS" && (
                <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-center">
                  <p className="text-sm text-emerald-300">
                    {feedbackMessage || "Check your email for the reset link!"}
                  </p>
                </div>
              )}

              <p className="mt-8 text-center text-sm text-white/40">
                Suddenly remembered?{" "}
                <Link
                  href="/login"
                  className="font-medium text-white transition-colors hover:text-fuchsia-300"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </main>

        <Footer variant="minimal" />
      </div>
    </GuestGuard>
  );
}