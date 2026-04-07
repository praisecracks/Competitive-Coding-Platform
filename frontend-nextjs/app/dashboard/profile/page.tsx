"use client";

import { Copy, Share2, MessageCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import EditProfileModal from "@/app/components/profile/editmodal";
import { getCountryFlag } from "@/lib/flags";
import {
  AUTH_EMAIL_KEY,
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  AUTH_USERNAME_KEY,
  getStoredUser,
  normalizeProfileImageUrl,
} from "@/lib/auth";

type ProfileData = {
  id?: string;
  username: string;
  email: string;
  rank?: string;
  bio?: string;
  country?: string;
  profile_pic?: string | null;
  totalSolved?: number;
  currentStreak?: number;
  joinDate?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  role?: string;
  referralCode?: string;
  duelsWon?: number;
  winRate?: number;
};

type SubmissionItem = {
  id?: number;
  title?: string;
  status?: string;
  score?: number;
  date?: string;
};

type Notice = {
  msg: string;
  type: "success" | "error";
};

type InsightTone = "good" | "warning" | "neutral";

type InsightItem = {
  title: string;
  description: string;
  tone: InsightTone;
};

const API_BASE_URL = "/api";

const DEFAULT_BIO = "Building, learning, and improving every day.";
const DEFAULT_RANK = "Beginner";

const USERNAME_MIN = 3;
const USERNAME_MAX = 20;
const BIO_MAX = 220;
const URL_MAX = 200;

function resolveAssetUrl(path?: string | null) {
  if (!path) return null;

  const normalized = normalizeProfileImageUrl(path);
  if (!normalized) return null;

  if (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://")
  ) {
    return normalized;
  }

  if (normalized.startsWith("/uploads/")) {
    return normalized;
  }

  if (normalized.startsWith("uploads/")) {
    return `/${normalized}`;
  }

  return normalized;
}

function clampUsername(value: string) {
  return value.replace(/\s+/g, " ").trimStart().slice(0, USERNAME_MAX);
}

function clampBio(value: string) {
  return value.slice(0, BIO_MAX);
}

function clampUrl(value: string) {
  return value.trim().slice(0, URL_MAX);
}

function normalizeUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function isValidUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function truncateText(value: string, max: number) {
  if (!value) return "";
  return value.length > max ? `${value.slice(0, max)}…` : value;
}

const FRONTEND_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || "http://127.0.0.1:3000";

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const notifyTimeoutRef = useRef<number | null>(null);

  const [user, setUser] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notification, setNotification] = useState<Notice | null>(null);
  const [profileError, setProfileError] = useState("");
  const [statsError, setStatsError] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [recentActivity, setRecentActivity] = useState<SubmissionItem[]>([]);
  const [imageError, setImageError] = useState(false);

  const notify = useCallback(
    (msg: string, type: "success" | "error" = "success") => {
      setNotification({ msg, type });

      if (notifyTimeoutRef.current) {
        window.clearTimeout(notifyTimeoutRef.current);
      }

      notifyTimeoutRef.current = window.setTimeout(() => {
        setNotification(null);
      }, 3000);
    },
    []
  );

  const syncSidebarCache = useCallback(
    (payload?: Partial<ProfileData>) => {
      const cachedUser = getStoredUser();

      const currentName = payload?.username ?? user?.username ?? "Developer";
      const currentEmail = payload?.email ?? user?.email ?? "";
      const currentRank = payload?.rank ?? user?.rank ?? DEFAULT_RANK;
      const currentCountry = payload?.country ?? user?.country ?? "";
      const currentProfilePic = normalizeProfileImageUrl(
        payload?.profile_pic ?? user?.profile_pic ?? ""
      );
      const currentSolved = payload?.totalSolved ?? user?.totalSolved ?? 0;
      const currentStreak = payload?.currentStreak ?? user?.currentStreak ?? 0;
      const currentGithubUrl = payload?.githubUrl ?? user?.githubUrl ?? "";
      const currentLinkedinUrl = payload?.linkedinUrl ?? user?.linkedinUrl ?? "";
      const currentRole = payload?.role ?? user?.role ?? cachedUser?.role ?? "user";
      const currentReferralCode =
        payload?.referralCode ?? user?.referralCode ?? "";
      const currentDuelsWon = payload?.duelsWon ?? user?.duelsWon ?? 0;
      const currentWinRate = payload?.winRate ?? user?.winRate ?? 0;

      localStorage.setItem(
        AUTH_USERNAME_KEY,
        truncateText(currentName, USERNAME_MAX)
      );
      localStorage.setItem(AUTH_EMAIL_KEY, currentEmail);

      const rawUser = localStorage.getItem(AUTH_USER_KEY);
      let parsed = {};

      if (rawUser) {
        try {
          parsed = JSON.parse(rawUser);
        } catch {
          parsed = {};
        }
      }

      localStorage.setItem(
        AUTH_USER_KEY,
        JSON.stringify({
          ...parsed,
          username: truncateText(currentName, USERNAME_MAX),
          email: currentEmail,
          rank: currentRank,
          country: currentCountry,
          profile_pic: currentProfilePic,
          totalSolved: currentSolved,
          currentStreak: currentStreak,
          githubUrl: currentGithubUrl,
          linkedinUrl: currentLinkedinUrl,
          referralCode: currentReferralCode,
          role: currentRole,
          duelsWon: currentDuelsWon,
          winRate: currentWinRate,
        })
      );

      Promise.resolve().then(() => {
        window.dispatchEvent(new Event("user-profile-updated"));
      });
    },
    [user]
  );

  useEffect(() => {
    return () => {
      if (notifyTimeoutRef.current) {
        window.clearTimeout(notifyTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
      router.push("/login?redirect=/dashboard/profile");
      return;
    }

    void loadProfilePage(token);
  }, [router]);

  const loadProfilePage = async (token: string) => {
    setLoading(true);
    await Promise.all([
      fetchProfile(token),
      fetchDashboardStats(token),
      fetchReferralCode(token),
    ]);
    setLoading(false);
  };

  const fetchProfile = async (token: string) => {
    try {
      setProfileError("");

      const res = await fetch(`/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        console.error("Profile fetch failed:", res.status, errorText);
        setProfileError("Unable to load live profile data right now.");
        setFallbackProfile();
        return;
      }

      const data = await res.json();
      const cachedUser = getStoredUser();

      const normalizedUser: ProfileData = {
        id: data.id || "",
        username: truncateText(
          data.username ||
            cachedUser?.username ||
            localStorage.getItem(AUTH_USERNAME_KEY) ||
            "Developer",
          USERNAME_MAX
        ),
        email:
          data.email ||
          cachedUser?.email ||
          localStorage.getItem(AUTH_EMAIL_KEY) ||
          "user@codemaster.com",
        rank: data.rank || (cachedUser as any)?.rank || DEFAULT_RANK,
        bio: data.bio || DEFAULT_BIO,
        country: data.country || cachedUser?.country || "",
        profile_pic: normalizeProfileImageUrl(data.profile_pic || ""),
        totalSolved:
          typeof data.totalSolved === "number"
            ? data.totalSolved
            : (cachedUser as any)?.totalSolved ?? 0,
        currentStreak:
          typeof data.currentStreak === "number"
            ? data.currentStreak
            : (cachedUser as any)?.currentStreak ?? 0,
        joinDate: data.joinDate || "",
        githubUrl: data.githubUrl || (cachedUser as any)?.githubUrl || "",
        linkedinUrl:
          data.linkedinUrl || (cachedUser as any)?.linkedinUrl || "",
        role: data.role || cachedUser?.role || "user",
        duelsWon:
          typeof data.duelsWon === "number"
            ? data.duelsWon
            : (cachedUser as any)?.duelsWon ?? 0,
        winRate:
          typeof data.winRate === "number"
            ? data.winRate
            : (cachedUser as any)?.winRate ?? 0,
      };

      setUser((prev) => ({ ...prev, ...normalizedUser }));
      syncSidebarCache(normalizedUser);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setProfileError("Unable to connect to the profile service.");
      setFallbackProfile();
    }
  };

  const fetchReferralCode = async (token: string) => {
    try {
      const res = await fetch(`/api/profile/referral-code`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const fullReferralLink = `${FRONTEND_URL}/signup?ref=${data.referralCode}`;
        setReferralLink(fullReferralLink);
        setUser((prev) =>
          prev ? { ...prev, referralCode: data.referralCode ?? undefined } : null
        );
      } else {
        console.error("Failed to fetch referral code:", res.status);
      }
    } catch (error) {
      console.error("Failed to fetch referral code:", error);
    }
  };

  const fetchDashboardStats = async (token: string) => {
    try {
      setStatsError("");

      const res = await fetch(`/api/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        console.error("Dashboard stats fetch failed:", res.status, errorText);
        setStatsError("Recent activity is unavailable right now.");
        return;
      }

      const data = await res.json();

      setRecentActivity(
        Array.isArray(data.recentSubmissions) ? data.recentSubmissions : []
      );

      setUser((prev) => {
        if (!prev) return prev;

        const updated = {
          ...prev,
          totalSolved: data.totalSolved ?? prev.totalSolved ?? 0,
          currentStreak: data.currentStreak ?? prev.currentStreak ?? 0,
          duelsWon: data.duelsWon ?? prev.duelsWon ?? 0,
          winRate: data.winRate ?? prev.winRate ?? 0,
        };

        syncSidebarCache(updated);
        return updated;
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      setStatsError("Unable to load recent activity.");
    }
  };

  const setFallbackProfile = () => {
    const cachedUser = getStoredUser();

    const fallbackUser: ProfileData = {
      username: truncateText(
        cachedUser?.username ||
          localStorage.getItem(AUTH_USERNAME_KEY) ||
          "Developer",
        USERNAME_MAX
      ),
      email:
        cachedUser?.email ||
        localStorage.getItem(AUTH_EMAIL_KEY) ||
        "user@codemaster.com",
      rank: (cachedUser as any)?.rank || DEFAULT_RANK,
      bio: DEFAULT_BIO,
      country: cachedUser?.country || "",
      profile_pic: normalizeProfileImageUrl(cachedUser?.profile_pic || ""),
      totalSolved: (cachedUser as any)?.totalSolved ?? 0,
      currentStreak: (cachedUser as any)?.currentStreak ?? 0,
      joinDate: "",
      id: "",
      githubUrl: (cachedUser as any)?.githubUrl || "",
      linkedinUrl: (cachedUser as any)?.linkedinUrl || "",
      role: cachedUser?.role || "user",
      referralCode: (cachedUser as any)?.referralCode || "",
      duelsWon: (cachedUser as any)?.duelsWon ?? 0,
      winRate: (cachedUser as any)?.winRate ?? 0,
    };

    setUser(fallbackUser);
    syncSidebarCache(fallbackUser);
  };

  const handleSaveProfile = async (data: {
    username: string;
    bio: string;
    rank: string;
    country: string;
    githubUrl: string;
    linkedinUrl: string;
  }) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token || !user) return;

    const cleanPayload = {
      username: clampUsername(data.username),
      bio: clampBio(data.bio),
      rank: data.rank,
      country: data.country,
      githubUrl: clampUrl(data.githubUrl),
      linkedinUrl: clampUrl(data.linkedinUrl),
    };

    if (
      cleanPayload.githubUrl &&
      !isValidUrl(normalizeUrl(cleanPayload.githubUrl))
    ) {
      notify("GitHub URL is invalid.", "error");
      return;
    }

    if (
      cleanPayload.linkedinUrl &&
      !isValidUrl(normalizeUrl(cleanPayload.linkedinUrl))
    ) {
      notify("LinkedIn URL is invalid.", "error");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(`${API_BASE_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...cleanPayload,
          githubUrl: cleanPayload.githubUrl
            ? normalizeUrl(cleanPayload.githubUrl)
            : "",
          linkedinUrl: cleanPayload.linkedinUrl
            ? normalizeUrl(cleanPayload.linkedinUrl)
            : "",
        }),
      });

      if (!res.ok) {
        const responseData = await res.json().catch(() => null);
        const backendError = responseData?.error || "";

        if (backendError === "USERNAME_TAKEN") {
          notify("That username is already in use.", "error");
          return;
        }

        console.error("Profile update failed:", res.status, backendError);
        notify("Profile update failed.", "error");
        return;
      }

      const updatedUser: ProfileData = {
        ...user,
        ...cleanPayload,
        githubUrl: cleanPayload.githubUrl
          ? normalizeUrl(cleanPayload.githubUrl)
          : "",
        linkedinUrl: cleanPayload.linkedinUrl
          ? normalizeUrl(cleanPayload.linkedinUrl)
          : "",
      };

      setUser(updatedUser);
      syncSidebarCache(updatedUser);
      setIsEditModalOpen(false);
      notify("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      notify("Network error while updating profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarIntent = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!file || !token) return;

    if (!file.type.startsWith("image/")) {
      notify("Please choose a valid image file.", "error");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      notify("Profile image must be 2MB or less.", "error");
      return;
    }

    try {
      notify("Uploading avatar...");

      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch(`${API_BASE_URL}/profile/avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const rawText = await res.text().catch(() => "");
        console.error("Avatar upload failed:", {
          status: res.status,
          statusText: res.statusText,
          body: rawText,
        });
        notify(`Failed to upload avatar. (${res.status})`, "error");
        return;
      }

      const data = await res.json();
      const normalizedProfilePic = normalizeProfileImageUrl(data.profile_pic || "");

      setImageError(false);

      setUser((prev) => {
        if (!prev) return prev;

        const updated = {
          ...prev,
          profile_pic: normalizedProfilePic,
        };

        syncSidebarCache(updated);
        return updated;
      });

      notify("Avatar updated successfully");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      notify("Network error during upload.", "error");
    }
  };

  const displayJoinDate = useMemo(() => {
    if (!user?.joinDate) return "Not available yet";
    const parsed = new Date(user.joinDate);
    if (Number.isNaN(parsed.getTime())) return "Not available yet";
    return parsed.toDateString();
  }, [user?.joinDate]);

  const displayJoinYear = useMemo(() => {
    if (!user?.joinDate) return "—";
    const parsed = new Date(user.joinDate);
    if (Number.isNaN(parsed.getTime())) return "—";
    return parsed.getFullYear().toString();
  }, [user?.joinDate]);

  const avatarInitials = useMemo(() => {
    const name = user?.username?.trim() || "U";
    const parts = name.split(/\s+/).filter(Boolean);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
  }, [user?.username]);

  const resolvedProfilePic = useMemo(() => {
    return resolveAssetUrl(user?.profile_pic);
  }, [user?.profile_pic]);

  useEffect(() => {
    setImageError(false);
  }, [resolvedProfilePic]);

  const profileCompleteness = useMemo(() => {
    if (!user) return 0;

    let score = 0;

    if (user.username?.trim() && user.username.trim().length >= USERNAME_MIN)
      score += 20;
    if (user.email?.trim()) score += 15;
    if (user.bio?.trim() && user.bio.trim() !== DEFAULT_BIO) score += 20;
    if (user.rank?.trim()) score += 10;
    if (user.profile_pic) score += 10;
    if ((user.totalSolved ?? 0) > 0) score += 10;
    if (user.githubUrl?.trim()) score += 7;
    if (user.linkedinUrl?.trim()) score += 8;

    return Math.min(score, 100);
  }, [user]);

  const intelligenceInsights = useMemo<InsightItem[]>(() => {
    if (!user) return [];

    const insights: InsightItem[] = [];

    const solved = user.totalSolved ?? 0;
    const streak = user.currentStreak ?? 0;
    const hasCustomBio =
      !!user.bio?.trim() && user.bio.trim() !== DEFAULT_BIO;
    const hasAvatar = !!user.profile_pic;
    const hasJoinDate = !!user.joinDate;
    const hasGithub = !!user.githubUrl?.trim();
    const hasLinkedin = !!user.linkedinUrl?.trim();

    if (profileCompleteness < 60) {
      insights.push({
        title: "Profile needs strengthening",
        description:
          "Complete more profile details to make your account look credible and polished across the platform.",
        tone: "warning",
      });
    } else {
      insights.push({
        title: "Profile foundation looks strong",
        description:
          "Your profile has a healthy identity baseline and is beginning to feel trustworthy to other users.",
        tone: "good",
      });
    }

    if (!hasCustomBio) {
      insights.push({
        title: "Your bio is too generic",
        description:
          "Add a specific technical or career-focused bio so your profile communicates skill and intent instantly.",
        tone: "warning",
      });
    } else {
      insights.push({
        title: "Your bio adds personal signal",
        description:
          "Your profile already carries more personality and clarity than a blank developer account.",
        tone: "good",
      });
    }

    if (!hasGithub || !hasLinkedin) {
      insights.push({
        title: "External credibility is incomplete",
        description:
          "Add your GitHub and LinkedIn links so future public profile views feel stronger and more trustworthy.",
        tone: "warning",
      });
    } else {
      insights.push({
        title: "Professional links are connected",
        description:
          "Your profile is better positioned for future public visibility and recruiter trust signals.",
        tone: "good",
      });
    }

    if (solved === 0) {
      insights.push({
        title: "No challenge proof yet",
        description:
          "Start solving challenges so your profile moves from static identity to performance-backed credibility.",
        tone: "warning",
      });
    } else if (solved > 0 && solved < 10) {
      insights.push({
        title: "Momentum is building",
        description:
          "You have early traction. Consistent submissions will make the profile feel active and serious.",
        tone: "neutral",
      });
    } else {
      insights.push({
        title: "Performance signal is visible",
        description:
          "Your challenge activity already adds strong trust and shows measurable engagement.",
        tone: "good",
      });
    }

    if (streak >= 3) {
      insights.push({
        title: "Consistency is becoming a strength",
        description:
          "Your current streak suggests discipline. Keep it alive to strengthen your competitive identity.",
        tone: "good",
      });
    }

    if (!hasAvatar) {
      insights.push({
        title: "Add a profile photo",
        description:
          "A real avatar increases trust and makes the account feel more complete and memorable.",
        tone: "warning",
      });
    }

    if (!hasJoinDate) {
      insights.push({
        title: "Timeline data is incomplete",
        description:
          "Your account metadata is still limited. Once the backend returns a proper join date, profile trust improves.",
        tone: "neutral",
      });
    }

    return insights.slice(0, 4);
  }, [user, profileCompleteness]);

  const recommendedActions = useMemo(() => {
    if (!user) return [];

    const actions: string[] = [];

    if ((user.bio || "").trim() === DEFAULT_BIO) {
      actions.push(
        "Write a sharper bio that reflects your current engineering direction."
      );
    }

    if (!user.profile_pic) {
      actions.push(
        "Upload an avatar to make your profile look more established."
      );
    }

    if (!user.githubUrl?.trim()) {
      actions.push(
        "Add your GitHub profile link to strengthen your developer identity."
      );
    }

    if (!user.linkedinUrl?.trim()) {
      actions.push(
        "Add your LinkedIn profile link for future public profile trust."
      );
    }

    if ((user.totalSolved ?? 0) === 0) {
      actions.push(
        "Solve your first challenge to unlock profile activity signal."
      );
    } else if ((user.currentStreak ?? 0) < 3) {
      actions.push(
        "Maintain a short streak to make your profile feel actively maintained."
      );
    }

    if (!user.rank || user.rank === DEFAULT_RANK || user.rank === "Novice") {
      actions.push(
        "Refine your rank to better reflect your current skill position."
      );
    }

    if (actions.length === 0) {
      actions.push(
        "Your profile is in a healthy state. Keep activity consistent to strengthen trust."
      );
    }

    return actions.slice(0, 3);
  }, [user]);

  const isAdmin =
    user?.role === "super_admin" || user?.role === "sub_admin";

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-pink-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 text-center">
        <p className="text-sm text-gray-400">
          Unable to load profile right now.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${isAdmin ? "bg-[#0a0a0a]" : ""}`}>
      {notification && (
        <div className="fixed right-6 top-24 z-[100]">
          <div
            className={`rounded-xl border px-4 py-2 shadow-2xl backdrop-blur-xl ${
              notification.type === "success"
                ? "border-green-500/30 bg-green-500/10 text-green-300"
                : "border-red-500/30 bg-red-500/10 text-red-300"
            }`}
          >
            <p className="text-xs font-medium">{notification.msg}</p>
          </div>
        </div>
      )}

      {(profileError || statsError) && (
        <div className="space-y-2">
          {profileError && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2">
              <p className="text-xs text-red-300">{profileError}</p>
            </div>
          )}
          {statsError && (
            <div className="rounded-xl border border-pink-500/20 bg-pink-500/10 px-4 py-2">
              <p className="text-xs text-pink-200">{statsError}</p>
            </div>
          )}
        </div>
      )}

      <section className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="group relative">
              <div
                onClick={handleAvatarIntent}
                className={`flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 ${
                  isAdmin ? "border-purple-500/30" : "border-white/10"
                } bg-gradient-to-br from-white/[0.06] to-white/[0.02] shadow-xl transition hover:border-pink-500/40`}
              >
                {resolvedProfilePic && !imageError ? (
                  <img
                    src={resolvedProfilePic}
                    alt={user.username}
                    className="h-full w-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span className="text-xl font-bold uppercase tracking-wide text-white/70">
                    {avatarInitials}
                  </span>
                )}
              </div>

              {isAdmin && (
                <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-lg border border-white/10 bg-purple-500 shadow-lg">
                  <span className="text-[9px]">🛡️</span>
                </div>
              )}

              <button
                onClick={handleAvatarIntent}
                className="absolute -bottom-1 -right-1 rounded-full border border-white/10 bg-gradient-to-r from-pink-500 to-purple-500 p-1.5 text-white shadow-lg"
                type="button"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFileChange}
              />
            </div>

            <div className="min-w-0">
              <h1 className="mt-1 max-w-[250px] truncate text-2xl font-semibold text-white">
                {user.username}
              </h1>
              <p className="text-xs text-gray-500">{user.email}</p>
              <p className="mt-2 max-w-2xl line-clamp-2 text-xs leading-6 text-gray-400">
                {user.bio || "No bio added yet."}
              </p>

              {(user.githubUrl || user.linkedinUrl) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {user.githubUrl && (
                    <a
                      href={user.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-gray-300 transition hover:bg-white/[0.06] hover:text-white"
                    >
                      <svg
                        className="h-2.5 w-2.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      GitHub
                    </a>
                  )}
                  {user.linkedinUrl && (
                    <a
                      href={user.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-gray-300 transition hover:bg-white/[0.06] hover:text-white"
                    >
                      <svg
                        className="h-2.5 w-2.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0zM7.119 20.452H3.555V9h3.564v11.452zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zM20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z" />
                      </svg>
                      LinkedIn
                    </a>
                  )}
                </div>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge
                  label={
                    user.role === "super_admin"
                      ? "Super Admin"
                      : user.role === "sub_admin"
                      ? "Admin"
                      : user.rank || DEFAULT_RANK
                  }
                  tone={
                    user.role === "super_admin" || user.role === "sub_admin"
                      ? "purple"
                      : "pink"
                  }
                />
                <Badge label={`${profileCompleteness}% complete`} tone="pink" />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="rounded-lg border border-white/10 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-black shadow-xl transition-all hover:bg-gray-200 active:scale-95"
              type="button"
            >
              Edit Identity
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Solved" value={user.totalSolved ?? 0} />
        <StatCard label="Streak" value={`${user.currentStreak ?? 0} days`} />
        <StatCard label="Rank" value={user.rank || DEFAULT_RANK} />
        <StatCard label="Joined" value={displayJoinYear} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5">
            <div className="mb-3">
              <h2 className="text-base font-semibold text-white">
                Profile Strength
              </h2>
              <p className="mt-0.5 text-[10px] text-gray-500">
                Metric evaluating account completeness.
              </p>
            </div>

            <div className="mb-4">
              <div className="mb-1.5 flex items-center justify-between text-[10px]">
                <p className="text-gray-400">Completion</p>
                <p className="font-bold text-pink-500">
                  {profileCompleteness}%
                </p>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-pink-500 transition-all duration-500"
                  style={{ width: `${profileCompleteness}%` }}
                />
              </div>
            </div>

            <div className="grid gap-2">
              {intelligenceInsights.slice(0, 2).map((item, index) => (
                <InsightCard
                  key={`${item.title}-${index}`}
                  title={item.title}
                  description={item.description}
                  tone={item.tone}
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5">
            <h2 className="text-base font-semibold text-white">
              Account Information
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <InfoItem label="Email" value={user.email} />
              <InfoItem label="Username" value={user.username} />
              <InfoItem
                label="Country"
                value={
                  user.country
                    ? `${getCountryFlag(user.country)} ${user.country}`
                    : "Not specified"
                }
              />
              <InfoItem label="Member Since" value={displayJoinDate} />
              <InfoItem label="User ID" value={user.id || "Not available yet"} />
              {referralLink && (
                <InfoItem
                  label="Referral Link"
                  value={referralLink}
                  isReferral={true}
                />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">Smart Tips</h2>
              <span className="text-[10px] text-pink-300">Adaptive</span>
            </div>

            <div className="mt-4 space-y-2">
              {recommendedActions.map((action, index) => (
                <div
                  key={`${action}-${index}`}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                >
                  <p className="text-[11px] text-gray-200">{action}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">
                Recent Activity
              </h2>
              <button
                onClick={() => router.push("/dashboard/challenges")}
                className="text-xs text-pink-300 transition hover:text-pink-200"
                type="button"
              >
                View all
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {recentActivity.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-6 text-center">
                  <p className="text-xs text-gray-400">No activity yet.</p>
                </div>
              ) : (
                recentActivity.slice(0, 3).map((item, index) => (
                  <ActivityItem
                    key={`${item.id ?? index}-${index}`}
                    title={item.title || `Challenge #${item.id ?? index + 1}`}
                    status={item.status || "Completed"}
                    date={item.date || ""}
                    score={item.score ?? 0}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {user && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={{
            username: user.username,
            bio: user.bio || "",
            rank: user.rank || "Beginner",
            country: user.country || "",
            githubUrl: user.githubUrl || "",
            linkedinUrl: user.linkedinUrl || "",
          }}
          onSave={handleSaveProfile}
          isSaving={saving}
        />
      )}
    </div>
  );
}

function Badge({
  label,
  tone,
}: {
  label: string;
  tone: "pink" | "purple" | "neutral";
}) {
  const toneClass =
    tone === "pink"
      ? "border-pink-500/20 bg-pink-500/10 text-pink-200"
      : tone === "purple"
      ? "border-purple-500/20 bg-purple-500/10 text-purple-200"
      : "border-white/10 bg-white/[0.04] text-gray-300";

  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${toneClass}`}
    >
      {label}
    </span>
  );
}

function InsightCard({
  title,
  description,
  tone,
}: {
  title: string;
  description: string;
  tone: InsightTone;
}) {
  const toneClass =
    tone === "good"
      ? "text-emerald-400"
      : tone === "warning"
      ? "text-amber-400"
      : "text-blue-400";

  return (
    <div className="flex items-start gap-2 rounded-xl border border-white/5 bg-white/[0.01] p-2.5">
      <div className={`mt-1 h-1 w-1 shrink-0 rounded-full bg-current ${toneClass}`} />
      <div>
        <p className="text-[11px] font-bold text-white">{title}</p>
        <p className="mt-0.5 text-[10px] leading-relaxed text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-center transition-all hover:border-pink-500/20">
      <p className="text-[10px] uppercase tracking-wider text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold tracking-tight text-white">
        {value}
      </p>
    </div>
  );
}

function InfoItem({
  label,
  value,
  isReferral = false,
}: {
  label: string;
  value: string | null | undefined;
  isReferral?: boolean;
}) {
  const isUrl = /^https?:\/\//i.test(value || "");
  const isUserId = label === "User ID";
  const [copied, setCopied] = useState(false);

  const displayValue = value || "Not available";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareOnWhatsApp = () => {
    const message = `Check out CodeMaster! Join me using my referral link: ${displayValue}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
      displayValue
    )}&title=${encodeURIComponent(
      "Join me on CodeMaster!"
    )}&summary=${encodeURIComponent(
      "Code sharper. Compete smarter. Learn faster."
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-w-0">
      <p className="mb-0.5 text-[10px] uppercase tracking-tight text-gray-500">
        {label}
      </p>
      <div className="flex items-center gap-1.5">
        {isUrl && !isReferral ? (
          <a
            href={displayValue}
            target="_blank"
            rel="noreferrer"
            className="block max-w-[180px] truncate text-xs text-white underline-offset-4 hover:underline"
            title={displayValue}
          >
            {displayValue}
          </a>
        ) : (
          <p
            className="max-w-[180px] truncate text-xs text-white"
            title={displayValue}
          >
            {displayValue}
          </p>
        )}
        {(isUserId || isReferral) && displayValue !== "Not available" && (
          <>
            <button
              onClick={handleCopy}
              className="relative text-gray-500 transition-colors hover:text-white"
              title="Copy"
            >
              <Copy size={12} />
              {copied && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-1.5 py-0.5 text-[9px] text-white shadow-xl">
                  Copied!
                </span>
              )}
            </button>
            {isReferral && (
              <>
                <button
                  onClick={shareOnWhatsApp}
                  className="text-gray-500 transition-colors hover:text-green-500"
                  title="Share on WhatsApp"
                >
                  <MessageCircle size={12} />
                </button>
                <button
                  onClick={shareOnLinkedIn}
                  className="text-gray-500 transition-colors hover:text-blue-500"
                  title="Share on LinkedIn"
                >
                  <Share2 size={12} />
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ActivityItem({
  title,
  status,
  date,
  score,
}: {
  title: string;
  status: string;
  date: string;
  score: number;
}) {
  const isCompleted = status.toLowerCase() === "completed";

  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-white">{title}</p>
        <p className="mt-0.5 text-[10px] text-gray-500">{date || "Recent"}</p>
      </div>

      <div className="ml-4 text-right">
        <p
          className={`text-[10px] font-bold ${
            isCompleted ? "text-emerald-400" : "text-amber-400"
          }`}
        >
          {status}
        </p>
        <p className="mt-0.5 text-[10px] text-gray-500">+{score} pts</p>
      </div>
    </div>
  );
}