"use client";

import {
  Copy,
  Share2,
  MessageCircle,
  BookOpen,
  Trophy,
  Sparkles,
  ArrowRight,
  BrainCircuit,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/context/ThemeContext";
import EditProfileModal from "@/app/components/profile/editmodal";
import ProfileHeader from "@/app/components/profile/ProfileHeader";
import { getCountryFlag } from "@/lib/flags";
import { ReportButton } from "@/app/components/ReportButton";
import {
  AUTH_EMAIL_KEY,
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  AUTH_USERNAME_KEY,
  getStoredUser,
  normalizeProfileImageUrl,
} from "@/lib/auth";
import { LEARNING_PATHS } from "@/app/dashboard/learning/data";

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

type LearningProgressStore = {
  totalXp?: number;
  paths?: Record<
    string,
    {
      completedStepIds?: string[];
      liked?: boolean;
      rating?: number;
    }
  >;
};

const API_BASE_URL = "/api";
const LEARNING_PROGRESS_KEY = "codemaster_learning_progress_v1";

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

function getLearningProgress(): LearningProgressStore {
  if (typeof window === "undefined") return {};
  try {
    // Check new key first (codemaster_learning_track_progress)
    const raw = localStorage.getItem("codemaster_learning_track_progress");
    if (raw) {
      const progress = JSON.parse(raw);
      // Convert new format (completedLessonIds) to old format for profile compatibility
      const lessonIds = progress.completedLessonIds || [];
      return {
        paths: lessonIds.reduce((acc: Record<string, { completedStepIds: string[] }>, lessonId: string) => {
          // lessonId format: trackId-topicId-lessonIndex (e.g., "javascript-basics-topic-0-1")
          const parts = lessonId.split('-');
          const trackId = parts[0];
          if (!acc[trackId]) acc[trackId] = { completedStepIds: [] };
          acc[trackId].completedStepIds.push(lessonId);
          return acc;
        }, {}),
        totalXp: progress.totalXp || 0
      };
    }
    // Fallback to old key
    const rawOld = localStorage.getItem(LEARNING_PROGRESS_KEY);
    if (!rawOld) return {};
    return JSON.parse(rawOld);
  } catch {
    return {};
  }
}

const FRONTEND_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || "https://codemasterx.com.ng";

export default function ProfilePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === "light";
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
  const [learningProgress, setLearningProgress] = useState<LearningProgressStore>(() => getLearningProgress());

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

  useEffect(() => {
    const loadLearning = () => setLearningProgress(getLearningProgress());

    window.addEventListener("storage", loadLearning);
    window.addEventListener("focus", loadLearning);
    window.addEventListener("user-profile-updated", loadLearning);

    return () => {
      window.removeEventListener("storage", loadLearning);
      window.removeEventListener("focus", loadLearning);
      window.removeEventListener("user-profile-updated", loadLearning);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
      router.push("/login?redirect=/dashboard/profile");
      return;
    }

    void loadProfilePage(token);
   }, []);

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
      const currentLinkedinUrl =
        payload?.linkedinUrl ?? user?.linkedinUrl ?? "";
      const currentRole =
        payload?.role ?? user?.role ?? cachedUser?.role ?? "user";
      const currentReferralCode =
        payload?.referralCode ?? user?.referralCode ?? "";
      const currentDuelsWon = payload?.duelsWon ?? user?.duelsWon ?? 0;
      const currentWinRate = payload?.winRate ?? user?.winRate ?? 0;

      const updatedUser = {
        username: truncateText(currentName, USERNAME_MAX),
        email: currentEmail,
        rank: currentRank,
        country: currentCountry,
        profile_pic: currentProfilePic,
        totalSolved: currentSolved,
        currentStreak: currentStreak,
        githubUrl: currentGithubUrl,
        linkedinUrl: currentLinkedinUrl,
        role: currentRole,
        referralCode: currentReferralCode,
        duelsWon: currentDuelsWon,
        winRate: currentWinRate,
      };

      try {
        const raw = localStorage.getItem(AUTH_USER_KEY);
        const existing = raw ? JSON.parse(raw) : {};
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify({ ...existing, ...updatedUser }));
        localStorage.setItem(AUTH_USERNAME_KEY, updatedUser.username);
        localStorage.setItem(AUTH_EMAIL_KEY, updatedUser.email);
      } catch (e) {
        console.error("Failed to sync profile to localStorage", e);
      }

      Promise.resolve().then(() => {
        window.dispatchEvent(new Event("user-profile-updated"));
      });
    },
    [user]
  );

  const loadProfilePage = async (token: string) => {
    setLoading(true);
    const startTime = Date.now();

    const MIN_SKELETON_TIME = 800;  // Show skeleton at least 0.8s for smoothness
    const MAX_TOTAL_TIME = 8000;    // Hard cap: never exceed 8s total
    const REQUEST_TIMEOUT = 5000;   // Individual request timeout

    // Timeout wrapper: never rejects, resolves to null on timeout
    const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T | null> => {
      return Promise.race([
        promise.catch(() => null),
        new Promise<T | null>((resolve) => setTimeout(() => resolve(null), ms))
      ]);
    };

    // Fire all three in parallel with individual timeouts
    await Promise.allSettled([
      withTimeout(fetchProfile(token), REQUEST_TIMEOUT),
      withTimeout(fetchDashboardStats(token), REQUEST_TIMEOUT),
      withTimeout(fetchReferralCode(token), REQUEST_TIMEOUT),
    ]);

    // Enforce minimum skeleton display time
    const elapsed = Date.now() - startTime;
    if (elapsed < MIN_SKELETON_TIME) {
      await new Promise(r => setTimeout(r, MIN_SKELETON_TIME - elapsed));
    }

    // Hard cap: force exit after MAX_TOTAL_TIME regardless
    const totalElapsed = Date.now() - startTime;
    if (totalElapsed >= MAX_TOTAL_TIME) {
      console.warn("Profile load exceeded max time, forcing render");
    }

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
      const normalizedProfilePic = normalizeProfileImageUrl(
        data.profile_pic || ""
      );

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

  const handleAvatarRemove = async () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return;

    try {
      notify("Removing avatar...");

      const res = await fetch(`${API_BASE_URL}/profile/avatar`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const rawText = await res.text().catch(() => "");
        console.error("Avatar remove failed:", {
          status: res.status,
          statusText: res.statusText,
          body: rawText,
        });
      }

      setImageError(false);

      setUser((prev) => {
        if (!prev) return prev;

        const updated = {
          ...prev,
          profile_pic: null,
        };

        syncSidebarCache(updated);
        return updated;
      });

      notify("Avatar removed successfully");
    } catch (error) {
      console.error("Remove avatar error:", error);
      setUser((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, profile_pic: null };
        syncSidebarCache(updated);
        return updated;
      });
      notify("Avatar removed", "success");
    }
  };

  const displayJoinDate = useMemo(() => {
    if (!user?.joinDate) return "Not available yet";
    const parsed = new Date(user.joinDate);
    if (Number.isNaN(parsed.getTime())) return "Not available yet";
    return parsed.toDateString();
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

  const learningSnapshot = useMemo(() => {
    const pathProgress = learningProgress.paths || {};

    let completedCourses = 0;
    let startedCourses = 0;
    let completedSteps = 0;
    let activeCourse: {
      id: string;
      title: string;
      subtitle: string;
      completed: number;
      total: number;
      percent: number;
      nextStepTitle?: string;
      relatedChallengeId?: string;
      category: string;
    } | null = null;

    let strongestCategory = "No dominant area yet";
    let maxCompletedInCategory = 0;

    const categoryCounter: Record<string, number> = {};

    for (const path of LEARNING_PATHS) {
      const completedStepIds = pathProgress[path.id]?.completedStepIds || [];
      const totalSteps = path.steps.length;
      const doneCount = completedStepIds.length;

      if (doneCount > 0) {
        startedCourses++;
        completedSteps += doneCount;
        categoryCounter[path.category] =
          (categoryCounter[path.category] || 0) + doneCount;
      }

      if (doneCount === totalSteps && totalSteps > 0) {
        completedCourses++;
      }

      const percent =
        totalSteps > 0 ? Math.round((doneCount / totalSteps) * 100) : 0;

      if (doneCount > 0 && doneCount < totalSteps) {
        const nextStep = path.steps.find(
          (step) => !completedStepIds.includes(step.id)
        );

        if (!activeCourse || percent > activeCourse.percent) {
          activeCourse = {
            id: path.id,
            title: path.title,
            subtitle: path.subtitle,
            completed: doneCount,
            total: totalSteps,
            percent,
            nextStepTitle: nextStep?.title,
            relatedChallengeId: path.relatedChallengeId,
            category: path.category,
          };
        }
      }
    }

    for (const [category, count] of Object.entries(categoryCounter)) {
      if (count > maxCompletedInCategory) {
        maxCompletedInCategory = count;
        strongestCategory = category;
      }
    }

    return {
      totalLearningXp: learningProgress.totalXp || 0,
      startedCourses,
      completedCourses,
      completedSteps,
      strongestCategory,
      activeCourse,
    };
  }, [learningProgress]);

  const recommendedChallenge = useMemo(() => {
    if (learningSnapshot.activeCourse?.relatedChallengeId) {
      return {
        challengeId: learningSnapshot.activeCourse.relatedChallengeId,
        reason: `Recommended from your ${learningSnapshot.activeCourse.title} learning path.`,
        label: "Continue with linked challenge",
      };
    }

    const fallbackMap: Record<string, { id: string; title: string; reason: string }> = {
      "Data Structures": {
        id: "1",
        title: "Two Sum",
        reason: "A good next step for practicing core lookup patterns.",
      },
      Algorithms: {
        id: "2",
        title: "Valid Parentheses",
        reason: "Helps strengthen structured problem-solving under pressure.",
      },
      JavaScript: {
        id: "1",
        title: "Two Sum",
        reason: "Good for applying beginner logic with practical coding flow.",
      },
      Python: {
        id: "1",
        title: "Two Sum",
        reason: "Useful for translating beginner logic into problem-solving.",
      },
      Go: {
        id: "1",
        title: "Two Sum",
        reason: "A simple challenge to build confidence in structured thinking.",
      },
    };

    const fallback = fallbackMap[learningSnapshot.strongestCategory];
    if (!fallback) return null;

    return {
      challengeId: fallback.id,
      reason: fallback.reason,
      title: fallback.title,
      label: "Recommended next challenge",
    };
  }, [learningSnapshot]);

  const skillIdentity = useMemo(() => {
    const solved = user?.totalSolved ?? 0;
    const streak = user?.currentStreak ?? 0;

    const competitiveState =
      solved >= 15
        ? "Battle-tested"
        : solved >= 5
        ? "Building traction"
        : "Early stage";

    const consistencyState =
      streak >= 7 ? "Highly consistent" : streak >= 3 ? "Getting consistent" : "Needs rhythm";

    return {
      strongestArea: learningSnapshot.strongestCategory,
      growthState: competitiveState,
      consistencyState,
      learningState:
        learningSnapshot.totalLearningXp > 0 ? "Learning active" : "Learning not started",
    };
  }, [learningSnapshot, user?.currentStreak, user?.totalSolved]);

  const isAdmin =
    user?.role === "super_admin" || user?.role === "sub_admin";

   if (loading) {
    return (
      <div className={`space-y-4 ${isAdmin ? (isLight ? "bg-gray-50" : "bg-[#0a0a0a]") : ""}`}>
        {/* Header skeleton */}
        <div className={`rounded-2xl border p-6 sm:p-8 ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0a0a0a]"}`}>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {/* Avatar skeleton */}
            <div className="relative">
              <div className={`h-28 w-28 shrink-0 animate-pulse rounded-full ${isLight ? "bg-gray-200" : "bg-white/5"}`} />
              <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full border-2 border-white bg-gray-200" />
            </div>

            {/* Info skeleton */}
            <div className="flex-1 space-y-3">
              <div className={`h-8 w-48 animate-pulse rounded-lg ${isLight ? "bg-gray-200" : "bg-white/5"}`} />
              <div className={`h-4 w-32 animate-pulse rounded-lg ${isLight ? "bg-gray-200" : "bg-white/5"}`} />
              <div className="flex gap-4 pt-2">
                <div className={`h-4 w-24 animate-pulse rounded-lg ${isLight ? "bg-gray-200" : "bg-white/5"}`} />
                <div className={`h-4 w-20 animate-pulse rounded-lg ${isLight ? "bg-gray-200" : "bg-white/5"}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`rounded-2xl border p-4 ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0a0a0a]"}`}>
              <div className={`h-4 w-24 animate-pulse rounded ${isLight ? "bg-gray-200" : "bg-white/5"}`} />
              <div className={`mt-3 h-8 w-16 animate-pulse rounded-lg ${isLight ? "bg-gray-200" : "bg-white/5"}`} />
            </div>
          ))}
        </div>

        {/* Two-column layout skeleton */}
        <div className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
          {/* Left column */}
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className={`rounded-2xl border p-5 ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0a0a0a]"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className={`h-5 w-40 animate-pulse rounded-lg ${isLight ? "bg-gray-200" : "bg-white/5"}`} />
                    <div className={`h-3 w-60 animate-pulse rounded ${isLight ? "bg-gray-200" : "bg-white/5"}`} />
                  </div>
                  <div className={`h-8 w-8 shrink-0 rounded-lg ${isLight ? "bg-gray-200" : "bg-white/5"}`} />
                </div>
                <div className="mt-5 space-y-3">
                  <div className={`h-4 w-full animate-pulse rounded ${isLight ? "bg-gray-200" : "bg-white/5"}`} />
                  <div className={`h-4 w-3/4 animate-pulse rounded ${isLight ? "bg-gray-200" : "bg-white/5"}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`rounded-2xl border p-5 ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0a0a0a]"}`}>
                <div className={`h-5 w-40 animate-pulse rounded-lg ${isLight ? "bg-gray-200" : "bg-white/5"}`} />
                <div className="mt-4 space-y-3">
                  <div className={`h-4 w-full animate-pulse rounded ${isLight ? "bg-gray-200" : "bg-white/5"}`} />
                  <div className={`h-4 w-5/6 animate-pulse rounded ${isLight ? "bg-gray-200" : "bg-white/5"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className={`rounded-2xl border p-8 text-center ${
          isLight
            ? "border-gray-200 bg-white shadow-sm"
            : "border-white/10 bg-[#0a0a0a]"
        }`}
      >
        <p className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
          Unable to load profile right now.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`space-y-4 ${
        isAdmin ? (isLight ? "bg-gray-50" : "bg-[#0a0a0a]") : ""
      }`}
    >
      {/* Floating Report Button */}
      {user?.id && <ReportButton type="user" targetId={parseInt(user.id) || 0} targetLabel={user.username} />}
      
      {notification && (
        <div className="fixed right-6 top-24 z-[100]">
          <div
            className={`rounded-xl border px-4 py-2 shadow-2xl backdrop-blur-xl ${
              notification.type === "success"
                ? isLight
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-green-500/30 bg-green-500/10 text-green-300"
                : isLight
                ? "border-red-200 bg-red-50 text-red-700"
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
            <div
              className={`rounded-xl border px-4 py-2 ${
                isLight
                  ? "border-red-200 bg-red-50"
                  : "border-red-500/20 bg-red-500/10"
              }`}
            >
              <p className={`text-xs ${isLight ? "text-red-600" : "text-red-300"}`}>
                {profileError}
              </p>
            </div>
          )}
          {statsError && (
            <div
              className={`rounded-xl border px-4 py-2 ${
                isLight
                  ? "border-pink-200 bg-pink-50"
                  : "border-pink-500/20 bg-pink-500/10"
              }`}
            >
              <p className={`text-xs ${isLight ? "text-pink-600" : "text-pink-200"}`}>
                {statsError}
              </p>
            </div>
          )}
        </div>
      )}

      <ProfileHeader
        user={user}
        isAdmin={isAdmin}
        resolvedProfilePic={resolvedProfilePic}
        imageError={imageError}
        avatarInitials={avatarInitials}
        profileCompleteness={profileCompleteness}
        learningXp={learningSnapshot.totalLearningXp}
        strongestCategory={learningSnapshot.strongestCategory}
        onAvatarClick={handleAvatarIntent}
        onAvatarChange={handleAvatarFileChange}
        onAvatarRemove={handleAvatarRemove}
        onEditClick={() => setIsEditModalOpen(true)}
        fileInputRef={fileInputRef}
      />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Problems Solved" value={user.totalSolved ?? 0} isLight={isLight} />
        <StatCard label="Coding Streak" value={`${user.currentStreak ?? 0} days`} isLight={isLight} />
        <StatCard label="Skill Tier" value={user.rank || DEFAULT_RANK} isLight={isLight} />
        <StatCard label="Learning XP" value={learningSnapshot.totalLearningXp} isLight={isLight} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
        <div className="space-y-4">
          <div
            className={`rounded-2xl border p-5 ${
              isLight
                ? "border-gray-200 bg-white shadow-sm"
                : "border-white/10 bg-[#0a0a0a]"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className={`text-base font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                  Learning Snapshot
                </h2>
                <p className={`mt-0.5 text-[10px] ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                  Your progress inside the CodeMaster learning hub.
                </p>
              </div>
              <div
                className={`rounded-xl border p-2 ${
                  isLight
                    ? "border-pink-200 bg-pink-50 text-pink-600"
                    : "border-pink-500/20 bg-pink-500/10 text-pink-300"
                }`}
              >
                <BookOpen className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Started" value={learningSnapshot.startedCourses} isLight={isLight} />
              <StatCard label="Completed" value={learningSnapshot.completedCourses} isLight={isLight} />
              <StatCard label="Steps Done" value={learningSnapshot.completedSteps} isLight={isLight} />
              <StatCard label="XP" value={learningSnapshot.totalLearningXp} isLight={isLight} />
            </div>

            <div
              className={`mt-4 rounded-xl border p-4 ${
                isLight
                  ? "border-gray-200 bg-gray-50"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className={`text-[10px] uppercase tracking-[0.2em] ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                    Strongest Area
                  </p>
                  <p className={`mt-1 text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                    {learningSnapshot.strongestCategory}
                  </p>
                </div>

                <div
                  className={`rounded-xl border px-3 py-2 ${
                    isLight
                      ? "border-gray-200 bg-white"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                    Learning State
                  </p>
                  <p className={`mt-1 text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                    {skillIdentity.learningState}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`rounded-2xl border p-5 ${
              isLight
                ? "border-gray-200 bg-white shadow-sm"
                : "border-white/10 bg-[#0a0a0a]"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className={`text-base font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                  Current Learning Focus
                </h2>
                <p className="mt-0.5 text-[10px] text-gray-500">
                  Pick up where your growth path currently stands.
                </p>
              </div>
              <div
                className={`rounded-xl border p-2 ${
                  isLight
                    ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                    : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                }`}
              >
                <Sparkles className="h-4 w-4" />
              </div>
            </div>

            {learningSnapshot.activeCourse ? (
              <div className="mt-4">
                <p className={`text-lg font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                  {learningSnapshot.activeCourse.title}
                </p>
                <p className={`mt-1 max-w-2xl text-xs leading-6 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  {learningSnapshot.activeCourse.subtitle}
                </p>

                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-[10px]">
                    <p className={isLight ? "text-gray-500" : "text-gray-400"}>Progress</p>
                    <p className="font-bold text-pink-500">
                      {learningSnapshot.activeCourse.percent}%
                    </p>
                  </div>
                  <div className={`h-1.5 w-full overflow-hidden rounded-full ${isLight ? "bg-gray-200" : "bg-white/5"}`}>
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
                      style={{
                        width: `${learningSnapshot.activeCourse.percent}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div
                    className={`rounded-xl border p-3 ${
                      isLight
                        ? "border-gray-200 bg-gray-50"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
                      Next Step
                    </p>
                    <p className={`mt-1 text-xs font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                      {learningSnapshot.activeCourse.nextStepTitle ||
                        "Continue your course"}
                    </p>
                  </div>

                  <div
                    className={`rounded-xl border p-3 ${
                      isLight
                        ? "border-gray-200 bg-gray-50"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
                      Focus Area
                    </p>
                    <p className={`mt-1 text-xs font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                      {learningSnapshot.activeCourse.category}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      router.push(
                        `/dashboard/learning/${learningSnapshot.activeCourse?.id}`
                      )
                    }
                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition ${
                      isLight
                        ? "border border-gray-300 bg-gray-900 text-white hover:bg-black"
                        : "border border-white/10 bg-white text-black hover:bg-gray-200"
                    }`}
                    type="button"
                  >
                    Continue Learning
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  {learningSnapshot.activeCourse.relatedChallengeId && (
                    <button
                      onClick={() =>
                        router.push(
                          `/dashboard/challenges/${learningSnapshot.activeCourse?.relatedChallengeId}`
                        )
                      }
                      className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition ${
                        isLight
                          ? "border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100"
                          : "border-pink-500/20 bg-pink-500/10 text-pink-200 hover:bg-pink-500/15"
                      }`}
                      type="button"
                    >
                      Linked Challenge
                      <Trophy className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div
                className={`mt-4 rounded-xl border px-4 py-6 ${
                  isLight
                    ? "border-gray-200 bg-gray-50"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                  No active course yet
                </p>
                <p className={`mt-1 text-xs leading-6 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  Start a learning path so your profile reflects both knowledge growth and challenge readiness.
                </p>

                <button
                  onClick={() => router.push("/dashboard/learning")}
                  className={`mt-4 rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition ${
                    isLight
                      ? "border border-gray-300 bg-gray-900 text-white hover:bg-black"
                      : "border border-white/10 bg-white text-black hover:bg-gray-200"
                  }`}
                  type="button"
                >
                  Explore Learning Hub
                </button>
              </div>
            )}
          </div>

          <div
            className={`rounded-2xl border p-5 ${
              isLight
                ? "border-gray-200 bg-white shadow-sm"
                : "border-white/10 bg-[#0a0a0a]"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className={`text-base font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                  Account Information
                </h2>
                <p className="mt-0.5 text-[10px] text-gray-500">
                  Identity and platform metadata.
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <InfoItem label="Email" value={user.email} isLight={isLight} />
              <InfoItem label="Username" value={user.username} isLight={isLight} />
              <InfoItem
                label="Country"
                value={
                  user.country
                    ? `${getCountryFlag(user.country)} ${user.country}`
                    : "Not specified"
                }
                isLight={isLight}
              />
              <InfoItem label="Member Since" value={displayJoinDate} isLight={isLight} />
              <InfoItem label="User ID" value={user.id || "Not available yet"} isLight={isLight} />
              {referralLink && (
                <InfoItem
                  label="Referral Link"
                  value={referralLink}
                  isReferral={true}
                  isLight={isLight}
                />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div
            className={`rounded-2xl border p-5 ${
              isLight
                ? "border-gray-200 bg-white shadow-sm"
                : "border-white/10 bg-[#0a0a0a]"
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className={`text-base font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                Skill Identity
              </h2>
              <div
                className={`rounded-xl border p-2 ${
                  isLight
                    ? "border-pink-200 bg-pink-50 text-pink-600"
                    : "border-white/10 bg-white/[0.03] text-pink-300"
                }`}
              >
                <BrainCircuit className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              <SkillSignal
                label="Strongest area"
                value={skillIdentity.strongestArea}
                isLight={isLight}
              />
              <SkillSignal
                label="Challenge momentum"
                value={skillIdentity.growthState}
                isLight={isLight}
              />
              <SkillSignal
                label="Consistency"
                value={skillIdentity.consistencyState}
                isLight={isLight}
              />
            </div>
          </div>

          <div
            className={`rounded-2xl border p-5 ${
              isLight
                ? "border-gray-200 bg-white shadow-sm"
                : "border-white/10 bg-[#0a0a0a]"
            }`}
          >
            <div className="mb-3">
              <h2 className={`text-base font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                Profile Strength
              </h2>
              <p className="mt-0.5 text-[10px] text-gray-500">
                Supporting metric for account completeness.
              </p>
            </div>

            <div className="mb-4">
              <div className="mb-1.5 flex items-center justify-between text-[10px]">
                <p className={isLight ? "text-gray-500" : "text-gray-400"}>Completion</p>
                <p className="font-bold text-pink-500">{profileCompleteness}%</p>
              </div>
              <div className={`h-1 w-full overflow-hidden rounded-full ${isLight ? "bg-gray-200" : "bg-white/5"}`}>
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
                  isLight={isLight}
                />
              ))}
            </div>
          </div>

          <div
            className={`rounded-2xl border p-5 ${
              isLight
                ? "border-gray-200 bg-white shadow-sm"
                : "border-white/10 bg-[#0a0a0a]"
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className={`text-base font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                Smart Tips
              </h2>
              <span className={`text-[10px] ${isLight ? "text-pink-600" : "text-pink-300"}`}>
                Adaptive
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {recommendedActions.map((action, index) => (
                <div
                  key={`${action}-${index}`}
                  className={`rounded-xl border p-3 ${
                    isLight
                      ? "border-gray-200 bg-gray-50"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <p className={`text-[11px] ${isLight ? "text-gray-700" : "text-gray-200"}`}>
                    {action}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`rounded-2xl border p-5 ${
              isLight
                ? "border-gray-200 bg-white shadow-sm"
                : "border-white/10 bg-[#0a0a0a]"
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className={`text-base font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                Recent Activity
              </h2>
              <button
                onClick={() => router.push("/dashboard/challenges")}
                className={`text-xs transition ${
                  isLight
                    ? "text-pink-600 hover:text-pink-700"
                    : "text-pink-300 hover:text-pink-200"
                }`}
                type="button"
              >
                View all
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {recentActivity.length === 0 ? (
                <div
                  className={`rounded-xl border px-4 py-6 text-center ${
                    isLight
                      ? "border-gray-200 bg-gray-50"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    No activity yet.
                  </p>
                </div>
              ) : (
                recentActivity.slice(0, 3).map((item, index) => (
                  <ActivityItem
                    key={`${item.id ?? index}-${index}`}
                    title={item.title || `Challenge #${item.id ?? index + 1}`}
                    status={item.status || "Completed"}
                    date={item.date || ""}
                    score={item.score ?? 0}
                    isLight={isLight}
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

function InsightCard({
  title,
  description,
  tone,
  isLight,
}: {
  title: string;
  description: string;
  tone: InsightTone;
  isLight: boolean;
}) {
  const toneClass =
    tone === "good"
      ? "text-emerald-500"
      : tone === "warning"
      ? "text-amber-500"
      : "text-blue-500";

  return (
    <div
      className={`flex items-start gap-2 rounded-xl border p-2.5 ${
        isLight
          ? "border-gray-200 bg-gray-50"
          : "border-white/5 bg-white/[0.01]"
      }`}
    >
      <div
        className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-current ${toneClass}`}
      />
      <div>
        <p className={`text-[11px] font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
          {title}
        </p>
        <p className={`mt-0.5 text-[10px] leading-relaxed ${isLight ? "text-gray-600" : "text-gray-500"}`}>
          {description}
        </p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  isLight,
}: {
  label: string;
  value: string | number;
  isLight: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 text-center transition-all hover:border-pink-500/20 ${
        isLight
          ? "border-gray-200 bg-white shadow-sm"
          : "border-white/10 bg-[#0a0a0a]"
      }`}
    >
      <p className={`text-[10px] uppercase tracking-[0.18em] ${isLight ? "text-gray-500" : "text-gray-500"}`}>
        {label}
      </p>
      <p className={`mt-2 text-2xl font-semibold tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}

function SkillSignal({
  label,
  value,
  isLight,
}: {
  label: string;
  value: string;
  isLight: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        isLight
          ? "border-gray-200 bg-gray-50"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
        {label}
      </p>
      <p className={`mt-1 text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}

function InfoItem({
  label,
  value,
  isReferral = false,
  isLight,
}: {
  label: string;
  value: string | null | undefined;
  isReferral?: boolean;
  isLight: boolean;
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
            className={`block max-w-[180px] truncate text-xs underline-offset-4 hover:underline ${
              isLight ? "text-gray-800" : "text-white"
            }`}
            title={displayValue}
          >
            {displayValue}
          </a>
        ) : (
          <p
            className={`max-w-[180px] truncate text-xs ${
              isLight ? "text-gray-800" : "text-white"
            }`}
            title={displayValue}
          >
            {displayValue}
          </p>
        )}
        {(isUserId || isReferral) && displayValue !== "Not available" && (
          <>
            <button
              onClick={handleCopy}
              className={`relative transition-colors ${
                isLight
                  ? "text-gray-500 hover:text-gray-900"
                  : "text-gray-500 hover:text-white"
              }`}
              title="Copy"
              type="button"
            >
              <Copy size={12} />
              {copied && (
                <span
                  className={`absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-1.5 py-0.5 text-[9px] shadow-xl ${
                    isLight
                      ? "bg-gray-900 text-white"
                      : "bg-gray-800 text-white"
                  }`}
                >
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
                  type="button"
                >
                  <MessageCircle size={12} />
                </button>
                <button
                  onClick={shareOnLinkedIn}
                  className="text-gray-500 transition-colors hover:text-blue-500"
                  title="Share on LinkedIn"
                  type="button"
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
  isLight,
}: {
  title: string;
  status: string;
  date: string;
  score: number;
  isLight: boolean;
}) {
  const normalizedStatus = status.toLowerCase();
  const isSuccess =
    normalizedStatus === "completed" ||
    normalizedStatus === "accepted" ||
    normalizedStatus === "passed";

  return (
    <div
      className={`flex items-center justify-between rounded-xl border p-3 transition-all hover:border-pink-500/15 ${
        isLight
          ? "border-gray-200 bg-gray-50"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <div className="min-w-0">
        <p className={`truncate text-xs font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
          {title}
        </p>
        <p className="mt-0.5 text-[10px] text-gray-500">{date || "Recent"}</p>
      </div>

      <div className="ml-4 text-right">
        <p
          className={`text-[10px] font-bold ${
            isSuccess ? "text-emerald-500" : "text-amber-500"
          }`}
        >
          {status}
        </p>
        <p className="mt-0.5 text-[10px] text-gray-500">+{score} pts</p>
      </div>
    </div>
  );
}