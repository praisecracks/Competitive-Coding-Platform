"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GuestGuard from "../components/GuestGuard";
import { isAuthenticated, persistUserSession } from "@/lib/auth";
import logo from "../../assets/CodeMaster_Logo.png";
import { BoltIcon, TrophyIcon } from "@heroicons/react/24/outline";

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

function SignupForm() {
  const router = useRouter();
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const notifyTimeoutRef = useRef<number | null>(null);

  const USERNAME_MIN = 3;
  const USERNAME_MAX = 20;

  const [checkingSession, setCheckingSession] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [status, setStatus] = useState<Status>("IDLE");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [notification, setNotification] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const notify = (msg: string, type: "success" | "error" = "error") => {
    setNotification({ msg, type });
    if (notifyTimeoutRef.current) {
      window.clearTimeout(notifyTimeoutRef.current);
    }
    notifyTimeoutRef.current = window.setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
      return;
    }

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const refCode = params.get("ref");
      if (refCode) {
        setReferralCode(refCode);
      }
    }

    setCheckingSession(false);
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        return "Password must be at least 12 characters and include an uppercase letter, number, and special character.";
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
      notify("Please complete all required fields.");
      return;
    }

    if (cleanUsername.length < USERNAME_MIN) {
      setStatus("ERROR");
      notify(`Username must be at least ${USERNAME_MIN} characters.`);
      return;
    }

    if (cleanUsername.length > USERNAME_MAX) {
      setStatus("ERROR");
      notify(`Username must not exceed ${USERNAME_MAX} characters.`);
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      setStatus("ERROR");
      notify("Username can only contain letters, numbers, and underscores.");
      return;
    }

    if (!agreeTerms) {
      setStatus("ERROR");
      notify("Please agree to the terms before creating your account.");
      return;
    }

    if (!isPasswordValid) {
      setShowPasswordRules(true);
      notify(
        "Password must be at least 8 characters and include an uppercase letter, number, and special character."
      );
      return;
    }

    setStatus("LOADING");

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
          referralCode,
        }),
      });

      const data: SignupResponse | null = await res.json().catch(() => null);

      if (!res.ok) {
        setStatus("ERROR");
        notify(mapSignupError(data?.error));

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
      notify("Unable to connect to the server. Please try again.");
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

        {notification && (
          <div className="fixed left-1/2 top-24 z-[100] -translate-x-1/2">
            <div
              className={`rounded-xl border px-5 py-3 shadow-2xl backdrop-blur-xl ${
                notification.type === "success"
                  ? "border-green-500/30 bg-green-500/10 text-green-300"
                  : "border-red-500/30 bg-red-500/10 text-red-300"
              }`}
            >
              <p className="text-sm font-medium">{notification.msg}</p>
            </div>
          </div>
        )}

        <main className="relative px-4 pb-10 pt-24 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
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
            <div className="mb-6 text-center">
              <div className="mb-4 flex justify-center">
                {/* <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 backdrop-blur-xl">
                  <Image
                    src={logo}
                    alt="CodeMaster Logo"
                    width={32}
                    height={32}
                    className="h-7 w-7 object-contain"
                  />
                  <span className="text-sm font-bold uppercase tracking-[0.2em] text-white/90">
                    CodeMaster
                  </span>
                </div> */}
              </div>

              <h1 className="bg-gradient-to-b from-white via-white to-white/55 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl">
                Set-up your account
              </h1>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-white/50 sm:text-base">
                Clean access to your coding workspace.
              </p>
            </div>

            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-black/70 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
              <div className="grid min-h-[560px] lg:grid-cols-[0.92fr_1.08fr]">
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

                  <div className="relative z-10 flex w-full flex-col justify-between p-8 xl:p-10">
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur-md">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Secure signup
                    </div>

                    <div className="max-w-sm">
                      <p className="mb-3 text-sm uppercase tracking-[0.24em] text-white/50">
                        Welcome to CODEMASTER
                      </p>
                      <p className="mt-4 text-sm leading-relaxed text-white/45 xl:text-base">
                        Be among the first
                      </p>
                      <h2 className="bg-gradient-to-br from-white to-white/60 bg-clip-text text-3xl font-bold leading-[1.15] text-transparent xl:text-4xl">
                        Start your <br /> coding <span className="text-fuchsia-400">mastery</span>.
                      </h2>
                      <p className="mt-4 text-sm leading-relaxed text-white/45 xl:text-base">
                        Join thousands of developers competing in real-time challenges.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                          <BoltIcon className="h-5 w-5 text-fuchsia-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Real-time duels</p>
                          <p className="text-xs text-white/40">Compete with others live</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                          <TrophyIcon className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Ranked rewards</p>
                          <p className="text-xs text-white/40">Climb the global leaderboard</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="flex items-center justify-center p-6 sm:p-8 xl:p-10">
                  <div className="w-full max-w-md">
                    <div className="mb-6 text-center lg:text-left">
                      <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                        Create account
                      </h3>
                      <p className="mt-2 text-sm text-white/45">
                        Join the competitive coding community, be among the first.
                      </p>
                      
                    </div>

                    <div className="mb-5">
                      <button
                        type="button"
                        onClick={() => {
                          const backendURL =
                            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
                          window.location.href = `${backendURL}/auth/github/login`;
                        }}
                        className="group inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-medium text-white/90 transition-all hover:border-white/20 hover:bg-white/8"
                      >
                        <svg
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          className="h-5 w-5 transition-transform group-hover:scale-110"
                        >
                          <path d="M12 0C5.37 0 0 5.37 0 12a12 12 0 0 0 8.21 11.39c.6.11.79-.26.79-.58v-2.03c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.31.76-1.61-2.67-.31-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.31-.54-1.53.11-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 5.8c1.02 0 2.05.14 3.01.41 2.29-1.55 3.3-1.23 3.3-1.23.65 1.65.23 2.87.11 3.18.77.84 1.24 1.91 1.24 3.22 0 4.6-2.81 5.62-5.49 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.7.8.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
                        </svg>
                        Continue with GitHub
                      </button>
                    </div>

                    <div className="mb-5 flex items-center gap-4">
                      <div className="h-px flex-1 bg-white/10" />
                      <span className="text-[11px] uppercase tracking-[0.24em] text-white/25">
                        Or continue with
                      </span>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-white/72">
                              Username
                            </label>
                            <span className={`text-xs ${
                              username.length > USERNAME_MAX 
                                ? "text-red-400" 
                                : username.length > 0 && username.length < USERNAME_MIN
                                ? "text-yellow-400"
                                : "text-white/35"
                            }`}>
                              {username.length}/{USERNAME_MAX}
                            </span>
                          </div>
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^a-zA-Z0-9_]/g, "");
                              setUsername(val);
                              resetFeedback();
                            }}
                            placeholder="johndoe"
                            maxLength={USERNAME_MAX}
                            required
                            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-fuchsia-400/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-fuchsia-500/10"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-white/72">
                            Referral <span className="text-white/35">(Opt)</span>
                          </label>
                          <input
                            type="text"
                            value={referralCode}
                            onChange={(e) => setReferralCode(e.target.value)}
                            placeholder="CODE123"
                            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-fuchsia-400/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-fuchsia-500/10"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-white/72">
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
                        <label className="mb-1.5 block text-sm font-medium text-white/72">
                          Country <span className="text-white/35">(Optional)</span>
                        </label>

                        <div className="relative" ref={countryDropdownRef}>
                          <button
                            type="button"
                            onClick={() => setShowCountryDropdown((prev) => !prev)}
                            className="flex h-12 w-full items-center justify-between rounded-2xl border border-white/10 bg-[#111111] px-4 pr-12 text-sm text-white outline-none transition-all hover:bg-[#181818] focus:border-fuchsia-400/50 focus:bg-[#181818] focus:ring-4 focus:ring-fuchsia-500/10"
                          >
                            <span className={country ? "text-white" : "text-white/35"}>
                              {country || "Select your country"}
                            </span>

                            <span
                              className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/35 transition-transform duration-200 ${
                                showCountryDropdown ? "rotate-180" : ""
                              }`}
                            >
                              ▼
                            </span>
                          </button>

                          {showCountryDropdown && (
                            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0d] shadow-[0_18px_50px_rgba(0,0,0,0.55)]">
                              <div className="max-h-64 overflow-y-auto py-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCountry("");
                                    setShowCountryDropdown(false);
                                    resetFeedback();
                                  }}
                                  className="flex w-full items-center px-4 py-3 text-left text-sm text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white"
                                >
                                  Select your country
                                </button>

                                {COUNTRY_OPTIONS.map((item) => (
                                  <button
                                    key={item}
                                    type="button"
                                    onClick={() => {
                                      setCountry(item);
                                      setShowCountryDropdown(false);
                                      resetFeedback();
                                    }}
                                    className={`flex w-full items-center px-4 py-3 text-left text-sm transition-colors hover:bg-white/[0.06] ${
                                      country === item
                                        ? "bg-fuchsia-500/10 text-fuchsia-300"
                                        : "text-white/80"
                                    }`}
                                  >
                                    {item}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="mb-1.5 flex items-center justify-between gap-3">
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

                      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-2.5 text-sm text-white/55 transition-colors hover:bg-white/[0.05]">
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
                        className="group relative mt-1 inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-2xl bg-white text-sm font-semibold text-black transition-all hover:scale-[0.995] hover:bg-white/95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
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
                      <></>
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

export default function SignupPage() {
  return <SignupForm />;
}