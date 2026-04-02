"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GuestGuard from "../components/GuestGuard";
import { isAuthenticated, persistUserSession } from "@/lib/auth";
import logo from "../../assets/CodeMaster_Logo.png";

type Status = "IDLE" | "LOADING" | "SUCCESS" | "ERROR";

type SignupResponse = {
  message?: string;
  token?: string;
  user?: {
    id?: string;
    email?: string;
    username?: string;
    profilePic?: string;
    country?: string;
    rank?: string;
    bio?: string;
    createdAt?: string;
  };
  error?: string;
};

const COUNTRY_OPTIONS = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahrain",
  "Bangladesh",
  "Belgium",
  "Benin",
  "Bolivia",
  "Botswana",
  "Brazil",
  "Bulgaria",
  "Cameroon",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Congo",
  "Croatia",
  "Czech Republic",
  "Denmark",
  "Egypt",
  "Ethiopia",
  "Finland",
  "France",
  "Germany",
  "Ghana",
  "Greece",
  "Hungary",
  "India",
  "Indonesia",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Kenya",
  "Malaysia",
  "Mexico",
  "Morocco",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Norway",
  "Pakistan",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Saudi Arabia",
  "Singapore",
  "South Africa",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "Thailand",
  "Turkey",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Vietnam",
  "Zambia",
  "Zimbabwe",
].sort((a, b) => a.localeCompare(b));

export default function SignupPage() {
  const router = useRouter();

  const [checkingSession, setCheckingSession] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [status, setStatus] = useState<Status>("IDLE");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPasswordRules, setShowPasswordRules] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
      return;
    }

    setCheckingSession(false);
  }, [router]);

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
      passwordChecks.special
    );
  }, [passwordChecks]);

  const passwordStrength = useMemo(() => {
    const passedChecks = Object.values(passwordChecks).filter(Boolean).length;

    if (password.length === 0) {
      return {
        label: "",
        width: "0%",
        tone: "bg-transparent",
        textTone: "text-white/35",
      };
    }

    if (passedChecks <= 1) {
      return {
        label: "Weak",
        width: "25%",
        tone: "bg-red-500",
        textTone: "text-red-400",
      };
    }

    if (passedChecks <= 3) {
      return {
        label: "Moderate",
        width: "68%",
        tone: "bg-yellow-400",
        textTone: "text-yellow-300",
      };
    }

    return {
      label: "Strong",
      width: "100%",
      tone: "bg-emerald-400",
      textTone: "text-emerald-300",
    };
  }, [passwordChecks, password]);

  const resetFeedback = () => {
    if (status !== "IDLE") {
      setStatus("IDLE");
      setErrorMsg("");
    }
  };

  useEffect(() => {
    if (isPasswordValid) {
      setShowPasswordRules(false);
    }
  }, [isPasswordValid]);

  const mapSignupError = (error: string | undefined) => {
    switch (error) {
      case "USER_EXISTS":
        return "This email or username is already registered.";
      case "MISSING_REQUIRED_FIELDS":
        return "Please complete all required fields.";
      case "INVALID_PAYLOAD":
        return "Some of the submitted details are invalid.";
      case "USER_CHECK_FAILED":
        return "We could not verify your account details right now.";
      case "WEAK_PASSWORD":
        return "Password must be at least 8 characters and include an uppercase letter, number, and special character.";
      case "PASSWORD_HASH_FAILED":
        return "We could not secure your password right now.";
      case "SIGNUP_FAILED":
        return "We could not create your account right now.";
      default:
        return error || "Registration failed. Please try again.";
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (status === "LOADING") return;

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanUsername || !cleanEmail || !password) {
      setStatus("ERROR");
      setErrorMsg("Please complete all required fields.");
      return;
    }

    if (!agreeTerms) {
      setStatus("ERROR");
      setErrorMsg("Please agree to the terms before creating your account.");
      return;
    }

    if (!isPasswordValid) {
      setShowPasswordRules(true);
      setStatus("ERROR");
      setErrorMsg(
        "Password must be at least 8 characters and include an uppercase letter, number, and special character."
      );
      return;
    }

    setStatus("LOADING");
    setErrorMsg("");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "omit",
        body: JSON.stringify({
          email: cleanEmail,
          username: cleanUsername,
          password,
          country: country.trim(),
        }),
      });

      const data: SignupResponse | null = await res.json().catch(() => null);

      if (!res.ok) {
        setStatus("ERROR");
        setErrorMsg(mapSignupError(data?.error));

        if (data?.error === "WEAK_PASSWORD") {
          setShowPasswordRules(true);
        }

        return;
      }

      if (data?.token) {
        persistUserSession({
          token: data.token,
          username: data.user?.username || cleanUsername,
          email: data.user?.email || cleanEmail,
          country: data.user?.country || country,
          profilePic: data.user?.profilePic || "",
        });

        setStatus("SUCCESS");

        window.setTimeout(() => {
          router.replace("/dashboard");
        }, 900);

        return;
      }

      setStatus("SUCCESS");

      window.setTimeout(() => {
        router.replace(
          `/login?message=${encodeURIComponent(
            "Account created successfully. Please sign in."
          )}`
        );
      }, 1000);
    } catch (error) {
      console.error("Signup request failed:", error);
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

      <main className="relative overflow-hidden px-4 pb-12 pt-28 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-[140px]" />
          <div className="absolute left-[18%] top-[20%] h-[320px] w-[320px] rounded-full bg-purple-500/10 blur-[120px]" />
          <div className="absolute bottom-[10%] right-[12%] h-[320px] w-[320px] rounded-full bg-pink-500/10 blur-[130px]" />
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
          <div className="mb-8 text-center">
            <div className="mb-5 mt-[-50px] flex justify-center">
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl">



              </div>
            </div>

            <h1 className="bg-gradient-to-b from-white via-white to-white/55 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
              Set-up your account
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/50 sm:text-base">
              Clean access to your coding workspace.
            </p>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-black/70 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            <div className="grid min-h-[720px] lg:grid-cols-[0.92fr_1.08fr]">
              <section className="relative hidden overflow-hidden border-r border-white/8 lg:flex">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#f5d0fe_0%,#d946ef_18%,#7e22ce_42%,#14061b_68%,#050505_100%)]" />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 opacity-[0.08]">
                  <div
                    className="h-full w-full"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                    }}
                  />
                </div>

                <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-12">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Secure signup
                  </div>

                  <div className="max-w-sm">
                    <p className="mb-4 text-sm uppercase tracking-[0.24em] text-white/50">
                      Trusted access
                    </p>

                    <h2 className="text-4xl font-semibold leading-tight text-white">
                      One account. One clean starting point.
                    </h2>

                    <p className="mt-5 text-sm leading-7 text-white/68">
                      Set up your profile and move straight into your workspace.
                    </p>

                    <div className="mt-8 space-y-3">
                      <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur-md">
                        <p className="text-sm font-medium text-white">
                          Secure onboarding
                        </p>
                        <p className="mt-1 text-xs text-white/55">
                          Strong password rules and protected access.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur-md">
                        <p className="text-sm font-medium text-white">
                          Minimal friction
                        </p>
                        <p className="mt-1 text-xs text-white/55">
                          Fast account creation with GitHub or email.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs uppercase tracking-[0.22em] text-white/30">
                    Built for focus
                  </div>
                </div>
              </section>

              <section className="relative flex items-center justify-center bg-black px-5 py-10 sm:px-8 lg:px-10 xl:px-14">
                <div className="w-full max-w-md">
                  <div className="mb-7 text-center lg:text-left">
                    <p className="mb-2 text-[11px] uppercase tracking-[0.28em] text-white/30">
                      Sign Up
                    </p>
                    <h3 className="text-3xl font-semibold tracking-tight text-white">
                      Create your account
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/45">
                      Use GitHub or continue with your details.
                    </p>
                  </div>

                  <div className="mb-5">
                    <button
                      type="button"
                      onClick={() => {
                        const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
                        window.location.href = `${backendURL}/auth/github/login`;
                      }}
                      className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-medium text-white/90 transition-all hover:border-white/20 hover:bg-white/8"
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

                  <div className="mb-5 flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-[11px] uppercase tracking-[0.24em] text-white/25">
                      Or
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/72">
                        Username
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          resetFeedback();
                        }}
                        placeholder="Choose a username"
                        autoComplete="username"
                        required
                        className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-fuchsia-400/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-fuchsia-500/10"
                      />
                    </div>

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
                        className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-fuchsia-400/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-fuchsia-500/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/72">
                        Country <span className="text-white/35">(Optional)</span>
                      </label>

                      <div className="relative">
                        <select
                          value={country}
                          onChange={(e) => {
                            setCountry(e.target.value);
                            resetFeedback();
                          }}
                          className="h-14 w-full appearance-none rounded-2xl border border-white/10 bg-[#111111] px-4 pr-12 text-sm text-white outline-none transition-all hover:bg-[#181818] focus:border-fuchsia-400/50 focus:bg-[#181818] focus:ring-4 focus:ring-fuchsia-500/10"
                        >
                          <option value="" className="bg-[#111111] text-white">
                            Select your country
                          </option>
                          {COUNTRY_OPTIONS.map((item) => (
                            <option
                              key={item}
                              value={item}
                              className="bg-[#111111] text-white"
                            >
                              {item}
                            </option>
                          ))}
                        </select>

                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/35">
                          ▼
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <label className="block text-sm font-medium text-white/72">
                          Password
                        </label>
                        {password.length > 0 && (
                          <span
                            className={`text-xs font-medium ${passwordStrength.textTone}`}
                          >
                            {passwordStrength.label}
                          </span>
                        )}
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
                          autoComplete="new-password"
                          required
                          className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 pr-20 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-fuchsia-400/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-fuchsia-500/10"
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-white/45 transition-colors hover:text-fuchsia-300"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>

                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/8">
                        <div
                          className={`h-full transition-all duration-300 ${passwordStrength.tone}`}
                          style={{ width: passwordStrength.width }}
                        />
                      </div>

                      {showPasswordRules && (
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div
                            className={`rounded-xl border px-3 py-2 ${
                              passwordChecks.length
                                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                                : "border-white/8 bg-white/[0.03] text-white/35"
                            }`}
                          >
                            8+ characters
                          </div>
                          <div
                            className={`rounded-xl border px-3 py-2 ${
                              passwordChecks.uppercase
                                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                                : "border-white/8 bg-white/[0.03] text-white/35"
                            }`}
                          >
                            Uppercase letter
                          </div>
                          <div
                            className={`rounded-xl border px-3 py-2 ${
                              passwordChecks.number
                                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                                : "border-white/8 bg-white/[0.03] text-white/35"
                            }`}
                          >
                            One number
                          </div>
                          <div
                            className={`rounded-xl border px-3 py-2 ${
                              passwordChecks.special
                                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                                : "border-white/8 bg-white/[0.03] text-white/35"
                            }`}
                          >
                            Special character
                          </div>
                        </div>
                      )}
                    </div>

                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/55 transition-colors hover:bg-white/[0.05]">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={() => {
                          setAgreeTerms((prev) => !prev);
                          resetFeedback();
                        }}
                        className="mt-0.5 h-4 w-4 rounded border-white/20 bg-transparent accent-fuchsia-500"
                      />
                      <span>I agree to the platform terms and account policy.</span>
                    </label>

                    <button
                      type="submit"
                      disabled={status === "LOADING" || status === "SUCCESS"}
                      className="group relative mt-2 inline-flex h-14 w-full items-center justify-center overflow-hidden rounded-2xl bg-white text-sm font-semibold text-black transition-all hover:scale-[0.995] hover:bg-white/95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.22),rgba(255,255,255,0))] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <span className="relative z-10">
                        {status === "LOADING"
                          ? "Creating account..."
                          : status === "SUCCESS"
                          ? "Account created"
                          : "Sign Up"}
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
                        Account created successfully. Redirecting...
                      </p>
                    </div>
                  )}

                  <p className="mt-6 text-center text-sm text-white/40 lg:text-left">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-medium text-white transition-colors hover:text-fuchsia-300"
                    >
                      Log in
                    </Link>
                  </p>
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