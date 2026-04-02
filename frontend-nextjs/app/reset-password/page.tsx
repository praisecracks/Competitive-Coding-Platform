"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GuestGuard from "../components/GuestGuard";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

type RequestState = "IDLE" | "LOADING" | "SUCCESS" | "ERROR";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [requestState, setRequestState] = useState<RequestState>("IDLE");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      return;
    }

    // Verify token validity
    const verifyToken = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/auth/verify-reset-token?token=${encodeURIComponent(
            token
          )}`
        );
        if (res.ok) {
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
        }
      } catch (err) {
        console.error(err);
        setIsTokenValid(false);
      }
    };

    verifyToken();
  }, [token]);

  const passwordChecks = useMemo(() => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const isPasswordValid = useMemo(() => {
    return (
      passwordChecks.length &&
      passwordChecks.uppercase &&
      passwordChecks.number &&
      passwordChecks.special &&
      password === confirmPassword
    );
  }, [passwordChecks, password, confirmPassword]);

  const resetFeedback = () => {
    if (requestState !== "IDLE") {
      setRequestState("IDLE");
      setFeedbackMessage("");
    }
  };

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (requestState === "LOADING") return;

    if (!isPasswordValid) {
      setRequestState("ERROR");
      setFeedbackMessage("Please meet all password requirements and ensure passwords match.");
      return;
    }

    setRequestState("LOADING");
    setFeedbackMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setRequestState("ERROR");
        let errorMessage = data?.error || "Failed to reset password. Please try again.";
        if (data?.error === "RATE_LIMITED") {
          errorMessage = "Too many reset attempts. Please wait a few minutes before trying again.";
        }
        setFeedbackMessage(errorMessage);
        return;
      }

      setRequestState("SUCCESS");
      setFeedbackMessage("Your password has been successfully reset.");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login?message=Password reset successfully. Please log in.");
      }, 2000);
    } catch (error) {
      console.error("Reset password failed:", error);
      setRequestState("ERROR");
      setFeedbackMessage("Unable to connect to the server. Please try again.");
    }
  };

  if (isTokenValid === null) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-white/50">Verifying secure link...</p>
      </div>
    );
  }

  if (isTokenValid === false) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-6">
          <h2 className="text-lg font-semibold text-red-300">Invalid or Expired Link</h2>
          <p className="mt-2 text-sm leading-6 text-red-200/80">
            The password reset link is invalid or has expired. Please request a new one.
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-white text-sm font-semibold text-black transition hover:bg-white/90"
        >
          Request new link
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 text-center lg:text-left">
        <p className="mb-2 text-[11px] uppercase tracking-[0.28em] text-white/30">
          Secure Reset
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Create new password
        </h2>
        <p className="mt-2 text-sm leading-6 text-white/45">
          Enter your new password below.
        </p>
      </div>

      {requestState === "SUCCESS" ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-4">
            <p className="text-sm font-medium text-emerald-300">Success!</p>
            <p className="mt-2 text-sm leading-7 text-emerald-100/80">
              {feedbackMessage}
            </p>
          </div>
          <p className="text-center text-sm text-white/50">Redirecting to login...</p>
        </div>
      ) : (
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-white/72">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  resetFeedback();
                }}
                placeholder="Enter new password"
                required
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-fuchsia-400/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-fuchsia-500/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-white/40 hover:text-white/80 transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/72">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                resetFeedback();
              }}
              placeholder="Confirm new password"
              required
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-fuchsia-400/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-fuchsia-500/10"
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <p className="mb-3 text-xs font-medium text-white/70">
              Password requirements
            </p>
            <ul className="space-y-2 text-xs">
              <li
                className={`flex items-center gap-2 ${
                  passwordChecks.length ? "text-emerald-400" : "text-white/40"
                }`}
              >
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    passwordChecks.length ? "bg-emerald-400" : "bg-white/20"
                  }`}
                />
                At least 8 characters
              </li>
              <li
                className={`flex items-center gap-2 ${
                  passwordChecks.uppercase ? "text-emerald-400" : "text-white/40"
                }`}
              >
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    passwordChecks.uppercase ? "bg-emerald-400" : "bg-white/20"
                  }`}
                />
                One uppercase letter
              </li>
              <li
                className={`flex items-center gap-2 ${
                  passwordChecks.number ? "text-emerald-400" : "text-white/40"
                }`}
              >
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    passwordChecks.number ? "bg-emerald-400" : "bg-white/20"
                  }`}
                />
                One number
              </li>
              <li
                className={`flex items-center gap-2 ${
                  passwordChecks.special ? "text-emerald-400" : "text-white/40"
                }`}
              >
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    passwordChecks.special ? "bg-emerald-400" : "bg-white/20"
                  }`}
                />
                One special character
              </li>
              <li
                className={`flex items-center gap-2 ${
                  password && password === confirmPassword
                    ? "text-emerald-400"
                    : "text-white/40"
                }`}
              >
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    password && password === confirmPassword
                      ? "bg-emerald-400"
                      : "bg-white/20"
                  }`}
                />
                Passwords match
              </li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={requestState === "LOADING" || !isPasswordValid}
            className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-white text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {requestState === "LOADING" ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}

      {requestState === "ERROR" && feedbackMessage && (
        <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3">
          <p className="text-sm text-red-300">{feedbackMessage}</p>
        </div>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <GuestGuard>
      <div className="min-h-screen bg-[#050505] text-white selection:bg-fuchsia-500/20 selection:text-white">
        <Header />

        <main className="relative overflow-hidden px-4 pb-8 pt-24 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-[120px]" />
            <div className="absolute left-[16%] top-[22%] h-[240px] w-[240px] rounded-full bg-purple-500/10 blur-[110px]" />
            <div className="absolute bottom-[12%] right-[12%] h-[260px] w-[260px] rounded-full bg-pink-500/10 blur-[120px]" />
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "38px 38px",
                maskImage:
                  "radial-gradient(circle at center, black 30%, transparent 85%)",
                WebkitMaskImage:
                  "radial-gradient(circle at center, black 30%, transparent 85%)",
              }}
            />
          </div>

          <div className="relative mx-auto w-full max-w-6xl">
            <div className="mb-6 text-center">
              <h1 className="bg-gradient-to-b from-white via-white to-white/55 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl">
                Secure your account
              </h1>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-white/50">
                Create a new strong password to regain access.
              </p>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black/70 shadow-[0_20px_70px_rgba(0,0,0,0.40)] backdrop-blur-2xl">
              <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
                <section className="relative flex items-center justify-center border-b border-white/8 bg-black px-5 py-8 sm:px-8 lg:border-b-0 lg:border-r lg:border-white/8 xl:px-12">
                  <Suspense fallback={<div className="text-white/50">Loading...</div>}>
                    <ResetPasswordForm />
                  </Suspense>
                </section>

                <section className="relative overflow-hidden bg-[linear-gradient(180deg,#0d0d0d_0%,#111111_100%)] px-6 py-8 sm:px-8 xl:px-10">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,70,239,0.12),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.12),transparent_28%)]" />

                  <div className="relative z-10 flex h-full flex-col justify-center">
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium text-white/70">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Security tips
                    </div>

                    <h3 className="mt-5 max-w-sm text-2xl font-semibold leading-tight text-white sm:text-3xl">
                      Keep it secure.
                    </h3>

                    <p className="mt-3 max-w-sm text-sm leading-7 text-white/55">
                      A strong password helps protect your coding progress and account settings.
                    </p>

                    <div className="mt-6 space-y-3">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <p className="text-sm font-medium text-white">
                          Use a password manager
                        </p>
                        <p className="mt-1 text-xs leading-6 text-white/45">
                          Generate and store complex passwords safely.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <p className="text-sm font-medium text-white">
                          Never reuse passwords
                        </p>
                        <p className="mt-1 text-xs leading-6 text-white/45">
                          Ensure this password is unique to CODEMASTER.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>

        <Footer variant="minimal" />
      </div>
    </GuestGuard>
  );
}
