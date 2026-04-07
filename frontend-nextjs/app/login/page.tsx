"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GuestGuard from "../components/GuestGuard";
import {
  isAuthenticated,
  persistUserSession,
  sanitizeRedirect,
} from "@/lib/auth";

type Status = "IDLE" | "LOADING" | "SUCCESS" | "ERROR";

type LoginResponse = {
  message?: string;
  token?: string;
  username?: string;
  email?: string;
  country?: string;
  profile_pic?: string;
  role?: string;
  error?: string;
};

function LoginForm() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<Status>("IDLE");
  const [errorMsg, setErrorMsg] = useState("");
  const [redirect, setRedirect] = useState("/dashboard");
  const [message, setMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const searchParams = new URLSearchParams(window.location.search);
    const redirectParam = searchParams.get("redirect");
    const messageParam = searchParams.get("message") || "";
    
    setRedirect(sanitizeRedirect(redirectParam));
    setMessage(messageParam);

    const tokenFromQuery = searchParams.get("token");
    const usernameFromQuery = searchParams.get("username");
    const emailFromQuery = searchParams.get("email");
    const countryFromQuery = searchParams.get("country");
    const profilePicFromQuery = searchParams.get("profile_pic");
    const roleFromQuery = searchParams.get("role");

    if (tokenFromQuery) {
      persistUserSession({
        token: tokenFromQuery,
        username: usernameFromQuery || "",
        email: emailFromQuery || "",
        country: countryFromQuery || "",
        profile_pic: profilePicFromQuery || "",
        role: roleFromQuery || "user",
      });

      router.replace(sanitizeRedirect(redirectParam));
      return;
    }

    if (isAuthenticated()) {
      router.replace("/dashboard");
      return;
    }

    setCheckingSession(false);
  }, [router]);

  const resetFeedback = () => {
    if (status !== "IDLE") {
      setStatus("IDLE");
      setErrorMsg("");
    }
  };

  const mapLoginError = (error: string | undefined) => {
    switch (error) {
      case "INVALID_CREDENTIALS":
        return "Invalid email or password.";
      case "USER_NOT_FOUND":
        return "No account was found with that email.";
      case "MISSING_REQUIRED_FIELDS":
        return "Please enter your email and password.";
      case "INVALID_PAYLOAD":
        return "The login details submitted are invalid.";
      case "LOGIN_FAILED":
        return "We could not sign you in right now.";
      case "TOKEN_GENERATION_FAILED":
        return "We could not complete your login session.";
      default:
        return error || "Login failed. Please try again.";
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (status === "LOADING") return;

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;

    if (!cleanEmail || !cleanPassword) {
      setStatus("ERROR");
      setErrorMsg("Please enter your email and password.");
      return;
    }

    setStatus("LOADING");
    setErrorMsg("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "omit",
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPassword,
          rememberMe,
        }),
      });

      const data: LoginResponse | null = await res.json().catch(() => null);

      if (!res.ok) {
        setStatus("ERROR");
        setErrorMsg(mapLoginError(data?.error));
        return;
      }

      if (!data?.token) {
        setStatus("ERROR");
        setErrorMsg("Login succeeded but no session token was returned.");
        return;
      }

      persistUserSession(data);
      setStatus("SUCCESS");

      window.setTimeout(() => {
        router.replace(redirect);
      }, 800);
    } catch (error) {
      console.error("Login request failed:", error);
      setStatus("ERROR");
      setErrorMsg("Unable to connect to the server. Please try again.");
    }
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-fuchsia-400" />
          <p className="text-xs uppercase tracking-[0.35em] text-white/45">
            Checking session
          </p>
        </div>
      </div>
    );
  }

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
                Welcome back
              </h1>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-white/50">
                Sign in and continue where you left off.
              </p>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black/70 shadow-[0_20px_70px_rgba(0,0,0,0.40)] backdrop-blur-2xl">
              <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
                <section className="relative flex items-center justify-center border-b border-white/8 bg-black px-5 py-8 sm:px-8 lg:border-b-0 lg:border-r lg:border-white/8 xl:px-12">
                  <div className="w-full max-w-md">
                    <div className="mb-6 text-center lg:text-left">
                      <p className="mb-2 text-[11px] uppercase tracking-[0.28em] text-white/30">
                        Sign In
                      </p>
                      <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                        Access your account
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-white/45">
                        Use GitHub or continue with your email and password.
                      </p>
                    </div>

                    {message && (
                      <div className="mb-4 rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/10 px-4 py-3">
                        <p className="text-sm text-fuchsia-200">{message}</p>
                      </div>
                    )}

                    <div className="mb-4">
                      <button
                        type="button"
                        onClick={() => {
                          const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
                          window.location.href = `${backendURL}/auth/github/login`;
                        }}
                        className="group inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-medium text-white/90 transition-all hover:border-white/20 hover:bg-white/8"
                      >
                        <svg
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          className="h-4 w-4 transition-transform group-hover:scale-110"
                        >
                          <path d="M12 0C5.37 0 0 5.37 0 12a12 12 0 0 0 8.21 11.39c.6.11.79-.26.79-.58v-2.03c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.31.76-1.61-2.67-.31-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.31-.54-1.53.11-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 5.8c1.02 0 2.05.14 3.01.41 2.29-1.55 3.3-1.23 3.3-1.23.65 1.65.23 2.87.11 3.18.77.84 1.24 1.91 1.24 3.22 0 4.6-2.81 5.62-5.49 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.7.8.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
                        </svg>
                        Continue with GitHub
                      </button>
                    </div>

                    <div className="mb-4 flex items-center gap-4">
                      <div className="h-px flex-1 bg-white/10" />
                      <span className="text-[11px] uppercase tracking-[0.24em] text-white/25">
                        Or
                      </span>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-white/72">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            resetFeedback();
                          }}
                          placeholder="Enter your email"
                          autoComplete="email"
                          required
                          className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-fuchsia-400/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-fuchsia-500/10"
                        />
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <label className="block text-sm font-medium text-white/72">
                            Password
                          </label>
                          <Link
                            href="/forgot-password"
                            className="text-xs font-medium text-fuchsia-300 transition-colors hover:text-fuchsia-200"
                          >
                            Forgot password?
                          </Link>
                        </div>

                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              resetFeedback();
                            }}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 pr-20 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-fuchsia-400/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-fuchsia-500/10"
                          />

                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-white/45 transition-colors hover:text-fuchsia-300"
                          >
                            {showPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 pt-1">
                        <label className="flex cursor-pointer items-center gap-3 text-sm text-white/55">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={() => setRememberMe((prev) => !prev)}
                            className="h-4 w-4 rounded border-white/20 bg-transparent accent-fuchsia-500"
                          />
                          Remember me
                        </label>

                        <span className="text-xs text-white/30">
                          Secure session
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={status === "LOADING" || status === "SUCCESS"}
                        className="group relative mt-1 inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-2xl bg-white text-sm font-semibold text-black transition-all hover:scale-[0.995] hover:bg-white/95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.22),rgba(255,255,255,0))] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        <span className="relative z-10">
                          {status === "LOADING"
                            ? "Signing in..."
                            : status === "SUCCESS"
                            ? "Access granted"
                            : "Sign In"}
                        </span>
                      </button>
                    </form>

                    {status === "ERROR" && (
                      <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                        <p className="text-sm text-red-300">{errorMsg}</p>
                      </div>
                    )}

                    {status === "SUCCESS" && (
                      <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
                        <p className="text-sm text-emerald-300">
                          Login successful. Redirecting...
                        </p>
                      </div>
                    )}

                    <p className="mt-5 text-center text-sm text-white/40 lg:text-left">
                      Don’t have an account?{" "}
                      <Link
                        href="/signup"
                        className="font-medium text-white transition-colors hover:text-fuchsia-300"
                      >
                        Create one
                      </Link>
                    </p>
                  </div>
                </section>

                <section className="relative overflow-hidden bg-[linear-gradient(180deg,#0d0d0d_0%,#111111_100%)] px-6 py-8 sm:px-8 xl:px-10">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,70,239,0.12),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.12),transparent_28%)]" />

                  <div className="relative z-10 flex h-full flex-col justify-center">
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium text-white/70">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Account access
                    </div>

                    <h3 className="mt-5 max-w-sm text-2xl font-semibold leading-tight text-white sm:text-3xl">
                      Faster return access, without the noise.
                    </h3>

                    <p className="mt-3 max-w-sm text-sm leading-7 text-white/55">
                      Sign in with the method that works for you and get back into your workspace quickly.
                    </p>

                    <div className="mt-6 space-y-3">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <p className="text-sm font-medium text-white">
                          Use GitHub
                        </p>
                        <p className="mt-1 text-xs leading-6 text-white/45">
                          Continue with the provider already connected to your account.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <p className="text-sm font-medium text-white">
                          Reset access
                        </p>
                        <p className="mt-1 text-xs leading-6 text-white/45">
                          Forgot your password? Recover access securely anytime.
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

export default function LoginPage() {
  return <LoginForm />;
}
