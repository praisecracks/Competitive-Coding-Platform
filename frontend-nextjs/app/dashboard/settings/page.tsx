"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { clearUserSession } from "@/lib/auth";
import { useTheme } from "@/app/context/ThemeContext";

type SettingsTab = "profile" | "account" | "preferences" | "danger";

type ProfileData = {
  id: string;
  username: string;
  email: string;
  bio: string;
  country: string;
  profile_pic: string | null;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

function resolveAssetUrl(path?: string | null) {
  if (!path) return null;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    const productionDomain = "codemaster-q9oo.onrender.com";
    if (path.includes(productionDomain)) {
      if (IS_PRODUCTION) {
        return path;
      }
      const url = new URL(path);
      return `/api${url.pathname}`;
    }
    return path;
  }

  let cleanPath = path.trim().replace(/\/+/g, "/");
  if (cleanPath.startsWith("/")) cleanPath = cleanPath.substring(1);

  if (!cleanPath.includes("/")) {
    return `/api/uploads/profiles/${cleanPath}`;
  }

  return `/api/${cleanPath}`;
}

export default function SettingsPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    id: "",
    username: "",
    email: "",
    bio: "",
    country: "",
    profile_pic: null,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    challengeReminders: true,
    publicProfile: false,
    weeklySummary: false,
    theme: "dark",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("terminal_token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load settings");

      const data = await res.json();
      setProfile({
        id: data.id || "",
        username: data.username || "",
        email: data.email || "",
        bio: data.bio || "",
        country: data.country || "",
        profile_pic: data.profile_pic || null,
      });
      setIsAdmin(data.role === "super_admin" || data.role === "sub_admin");
      setPreferences({
        emailNotifications: data.emailNotifications ?? true,
        challengeReminders: data.challengeReminders ?? true,
        publicProfile: data.publicProfile ?? false,
        weeklySummary: false,
        theme: theme,
      });
    } catch {
      setError("Failed to load your settings.");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg: string, isError = false) => {
    if (isError) setError(msg);
    else setSuccess(msg);
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 3000);
  };

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("terminal_token");
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error("Update failed");
      showNotification("Profile updated successfully!");
    } catch {
      showNotification("Failed to update profile.", true);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async () => {
    if (passwords.new !== passwords.confirm) {
      showNotification("Passwords do not match.", true);
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("terminal_token");
      const res = await fetch("/api/profile/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Password change failed");
      }

      showNotification("Password updated successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err: any) {
      showNotification(err.message || "Failed to update password.", true);
    } finally {
      setSaving(false);
    }
  };

  const handlePreferencesSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("terminal_token");
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          emailNotifications: preferences.emailNotifications,
          challengeReminders: preferences.challengeReminders,
          publicProfile: preferences.publicProfile,
          theme: preferences.theme,
        }),
      });

      if (!res.ok) throw new Error("Update failed");
      showNotification("Preferences saved successfully!");
    } catch {
      showNotification("Failed to save preferences.", true);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    clearUserSession();
    router.push("/login");
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("terminal_token");
      const res = await fetch("/api/profile", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          throw new Error(data.error || "Account deletion failed");
        }
        throw new Error("Account deletion failed");
      }

      clearUserSession();
      setShowDeleteConfirm(false);
      showNotification("Account deleted successfully. Redirecting to login...", false);

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      showNotification(err.message || "Failed to delete account.", true);
    } finally {
      setSaving(false);
    }
  };

  const initials = useMemo(() => {
    return profile.username
      .trim()
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join("");
  }, [profile.username]);

  const resolvedAvatar = useMemo(() => {
    return resolveAssetUrl(profile.profile_pic);
  }, [profile.profile_pic]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-pink-500" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isAdmin
          ? isLight
            ? "bg-[#f8fafc] text-gray-900"
            : "bg-[#0a0a0a] text-white"
          : isLight
          ? "bg-[#f8fafc] text-gray-900"
          : "bg-[#050507] text-white"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1
              className={`text-3xl font-black tracking-tight uppercase ${
                isLight ? "text-gray-900" : "text-white"
              }`}
            >
              {isAdmin ? "Administrative Controls" : "Personal Preferences"}
            </h1>
            <p
              className={`mt-1 text-xs font-black uppercase tracking-widest ${
                isLight ? "text-gray-500" : "text-gray-500"
              }`}
            >
              {isAdmin
                ? "Configure system-level personal settings"
                : "Manage your identity and platform experience"}
            </p>
          </div>

          {isAdmin && (
            <div
              className={`flex items-center gap-2 rounded-2xl px-4 py-2 ${
                isLight
                  ? "border border-purple-200 bg-purple-50"
                  : "border border-purple-500/20 bg-purple-500/10"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
              <span
                className={`text-[10px] font-black uppercase tracking-widest ${
                  isLight ? "text-purple-700" : "text-purple-400"
                }`}
              >
                Admin Mode
              </span>
            </div>
          )}
        </header>

        <AnimatePresence>
          {(error || success) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed right-6 top-24 z-[110] rounded-xl border px-6 py-3 shadow-2xl backdrop-blur-md ${
                error
                  ? isLight
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-red-500/20 bg-red-500/10 text-red-400"
                  : isLight
                  ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                  : "border-green-500/20 bg-green-500/10 text-green-400"
              }`}
            >
              {error || success}
            </motion.div>
          )}
        </AnimatePresence>

        <ConfirmationModal
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={confirmLogout}
          title="Sign Out"
          message="Are you sure you want to log out of your current session?"
          confirmLabel="Log Out"
          tone="neutral"
          isLight={isLight}
        />

        <ConfirmationModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDelete}
          title="Delete Account"
          message="This action is permanent and cannot be undone. All your progress, challenge history, and profile data will be erased. Are you absolutely sure?"
          confirmLabel="Delete permanently"
          tone="danger"
          isLight={isLight}
        />

        <header
          className={`mb-8 overflow-hidden rounded-[32px] border p-8 ${
            isLight
              ? "border-gray-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
              : "border-white/10 bg-[#0a0a0a] shadow-2xl"
          }`}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${
                  isLight
                    ? "border-pink-200 bg-pink-50 text-pink-600"
                    : "border-pink-500/20 bg-pink-500/10 text-pink-300"
                }`}
              >
                Control Panel
              </span>
              <h1
                className={`mt-4 text-3xl font-bold tracking-tight ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                System Settings
              </h1>
              <p className={`mt-2 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                Manage your identity, security, and preferences.
              </p>
            </div>

            <Link
              href="/dashboard"
              className={`inline-flex items-center justify-center rounded-2xl border px-6 py-3 text-sm font-medium transition ${
                isLight
                  ? "border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              Return to Dashboard
            </Link>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="space-y-2">
            <TabItem
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
              label="Public Profile"
              icon={<UserIcon />}
              isLight={isLight}
            />
            <TabItem
              active={activeTab === "account"}
              onClick={() => setActiveTab("account")}
              label="Account Security"
              icon={<LockIcon />}
              isLight={isLight}
            />
            <TabItem
              active={activeTab === "preferences"}
              onClick={() => setActiveTab("preferences")}
              label="Platform Preferences"
              icon={<SettingsIcon />}
              isLight={isLight}
            />
            <TabItem
              active={activeTab === "danger"}
              onClick={() => setActiveTab("danger")}
              label="Danger Zone"
              icon={<DangerIcon />}
              isDanger
              isLight={isLight}
            />
          </aside>

          <main
            className={`rounded-[32px] border p-8 ${
              isLight
                ? "border-gray-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
                : "border-white/10 bg-[#0a0a0a] shadow-xl"
            }`}
          >
            {activeTab === "profile" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className={`mb-6 text-xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                  Profile Settings
                </h2>

                <div className="space-y-6">
                  <div className="mb-8 flex items-center gap-6">
                    <div
                      className={`flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border text-2xl font-bold ${
                        isLight
                          ? "border-gray-200 bg-gradient-to-br from-pink-100 to-purple-100 text-pink-600"
                          : "border-white/10 bg-gradient-to-br from-pink-500/20 to-purple-500/20 text-pink-300"
                      }`}
                    >
                      {resolvedAvatar ? (
                        <img src={resolvedAvatar} className="h-full w-full rounded-2xl object-cover" />
                      ) : (
                        <svg className={`h-10 w-10 ${isLight ? "text-pink-400/50" : "text-pink-300/40"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </div>

                    <div>
                      <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                        Profile Photo
                      </p>
                      <p className={`mt-1 text-xs ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                        Your identity across CODEMASTER.
                      </p>
                      <Link
                        href="/dashboard/profile"
                        className={`mt-2 inline-block text-xs ${
                          isLight ? "text-pink-600 hover:underline" : "text-pink-400 hover:underline"
                        }`}
                      >
                        Update avatar in Profile →
                      </Link>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <InputGroup label="Username" isLight={isLight}>
                      <input
                        type="text"
                        value={profile.username}
                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                        className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none ${
                          isLight
                            ? "border-gray-200 bg-gray-50 text-gray-900 focus:border-pink-300 focus:bg-white"
                            : "border-white/10 bg-white/5 text-white focus:border-pink-500/50"
                        }`}
                      />
                    </InputGroup>

                    <InputGroup label="Country" isLight={isLight}>
                      <input
                        type="text"
                        value={profile.country}
                        onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                        className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none ${
                          isLight
                            ? "border-gray-200 bg-gray-50 text-gray-900 focus:border-pink-300 focus:bg-white"
                            : "border-white/10 bg-white/5 text-white focus:border-pink-500/50"
                        }`}
                      />
                    </InputGroup>
                  </div>

                  <InputGroup label="Bio" isLight={isLight}>
                    <textarea
                      rows={4}
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className={`w-full resize-none rounded-xl border px-4 py-3 text-sm focus:outline-none ${
                        isLight
                          ? "border-gray-200 bg-gray-50 text-gray-900 focus:border-pink-300 focus:bg-white"
                          : "border-white/10 bg-white/5 text-white focus:border-pink-500/50"
                      }`}
                    />
                  </InputGroup>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleProfileSave}
                      disabled={saving}
                      className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-pink-500/20 hover:opacity-90 disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "account" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="mb-6 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isLight ? "bg-pink-50 text-pink-600" : "bg-pink-500/10 text-pink-400"
                    }`}
                  >
                    <LockIcon />
                  </div>
                  <h2 className={`text-xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                    Account Security
                  </h2>
                </div>

                <div className="space-y-8">
                  <div
                    className={`space-y-6 rounded-[24px] border p-6 ${
                      isLight
                        ? "border-gray-200 bg-gray-50"
                        : "border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent"
                    }`}
                  >
                    <InputGroup label="Public User ID" isLight={isLight}>
                      <div
                        className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                          isLight
                            ? "border-gray-200 bg-white text-gray-700"
                            : "border-white/5 bg-black/20 text-gray-400"
                        }`}
                      >
                        <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        <span className="flex-1 truncate font-mono">{profile.id}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(profile.id);
                            showNotification("ID copied to clipboard!");
                          }}
                          className={`rounded-lg p-2 transition-colors ${
                            isLight
                              ? "text-pink-600 hover:bg-pink-50"
                              : "text-pink-400 hover:bg-white/10"
                          }`}
                          title="Copy ID"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        </button>
                      </div>
                      <p className={`mt-2 text-[10px] ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                        Share this ID with others to invite you to duels.
                      </p>
                    </InputGroup>

                    <InputGroup label="Registered Email" isLight={isLight}>
                      <div
                        className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                          isLight
                            ? "border-gray-200 bg-white text-gray-700"
                            : "border-white/5 bg-black/20 text-gray-500"
                        }`}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {profile.email}
                      </div>
                      <p className={`mt-2 flex items-center gap-1.5 text-[10px] ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Email changes are locked to your identity for security.
                      </p>
                    </InputGroup>
                  </div>

                  <div
                    className={`relative overflow-hidden rounded-[24px] border p-8 ${
                      isLight
                        ? "border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
                        : "border-white/10 bg-[#050507] shadow-inner"
                    }`}
                  >
                    <div className={`absolute right-0 top-0 p-8 ${isLight ? "opacity-[0.04]" : "opacity-5"}`}>
                      <svg className="h-32 w-32" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>

                    <h3 className={`mb-2 text-sm font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      Update Credentials
                    </h3>
                    <p className={`mb-6 text-xs ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                      Rotate your password periodically to keep your account safe.
                    </p>

                    <div className="max-w-md space-y-4">
                      <div className="space-y-1.5">
                        <label className={`ml-1 text-[10px] font-bold uppercase tracking-widest ${isLight ? "text-gray-500" : "text-gray-600"}`}>
                          Current Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={passwords.current}
                          onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                          className={`w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none ${
                            isLight
                              ? "border-gray-200 bg-gray-50 text-gray-900 focus:border-pink-300 focus:bg-white"
                              : "border-white/10 bg-black/60 text-white focus:border-pink-500/50"
                          }`}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className={`ml-1 text-[10px] font-bold uppercase tracking-widest ${isLight ? "text-gray-500" : "text-gray-600"}`}>
                          New Secure Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={passwords.new}
                          onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                          className={`w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none ${
                            isLight
                              ? "border-gray-200 bg-gray-50 text-gray-900 focus:border-pink-300 focus:bg-white"
                              : "border-white/10 bg-black/60 text-white focus:border-pink-500/50"
                          }`}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className={`ml-1 text-[10px] font-bold uppercase tracking-widest ${isLight ? "text-gray-500" : "text-gray-600"}`}>
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={passwords.confirm}
                          onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                          className={`w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none ${
                            isLight
                              ? "border-gray-200 bg-gray-50 text-gray-900 focus:border-pink-300 focus:bg-white"
                              : "border-white/10 bg-black/60 text-white focus:border-pink-500/50"
                          }`}
                        />
                      </div>
                    </div>

                    <div className={`mt-8 flex items-center justify-between gap-6 border-t pt-6 ${isLight ? "border-gray-200" : "border-white/5"}`}>
                      <p className={`max-w-[200px] text-[10px] leading-relaxed ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                        By updating, you will be required to use this new password for all future sessions.
                      </p>
                      <button
                        onClick={handlePasswordSave}
                        disabled={saving}
                        className={`rounded-xl border px-8 py-3 text-sm font-bold transition-all active:scale-95 disabled:opacity-50 ${
                          isLight
                            ? "border-gray-200 bg-gray-50 text-gray-900 hover:bg-gray-100"
                            : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                        }`}
                      >
                        {saving ? "Encrypting..." : "Apply Security Update"}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "preferences" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className={`mb-6 text-xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                  Platform Preferences
                </h2>

                <div className="space-y-6">
                  <div
                    className={`flex items-center justify-between rounded-2xl border p-5 ${
                      isLight
                        ? "border-gray-200 bg-gray-50"
                        : "border-white/10 bg-white/[0.02]"
                    }`}
                  >
                    <div>
                      <p className={`text-sm font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                        Light Mode
                      </p>
                      <p className={`mt-1 text-xs ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                        Switch between light and dark theme.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        toggleTheme();
                      }}
                      className={`relative h-6 w-12 rounded-full transition-colors ${
                        isLight ? "bg-pink-500" : "bg-white/10"
                      }`}
                    >
                      <div
                        className={`absolute top-1 h-4 w-4 rounded-full transition-transform ${
                          isLight
                            ? "translate-x-7 bg-white"
                            : "translate-x-1 bg-white/50"
                        }`}
                      />
                    </button>
                  </div>

                  <ToggleRow
                    label="Email Notifications"
                    description="Get updates about platform changes and achievements."
                    checked={preferences.emailNotifications}
                    onChange={() =>
                      setPreferences({
                        ...preferences,
                        emailNotifications: !preferences.emailNotifications,
                      })
                    }
                    isLight={isLight}
                  />

                  <ToggleRow
                    label="Challenge Reminders"
                    description="We'll nudge you to maintain your coding streak."
                    checked={preferences.challengeReminders}
                    onChange={() =>
                      setPreferences({
                        ...preferences,
                        challengeReminders: !preferences.challengeReminders,
                      })
                    }
                    isLight={isLight}
                  />

                  <ToggleRow
                    label="Public Profile"
                    description="Allow other developers to find your profile."
                    checked={preferences.publicProfile}
                    onChange={() =>
                      setPreferences({
                        ...preferences,
                        publicProfile: !preferences.publicProfile,
                      })
                    }
                    isLight={isLight}
                  />
                </div>

                <div className="flex justify-end pt-8">
                  <button
                    onClick={handlePreferencesSave}
                    disabled={saving}
                    className={`rounded-xl border px-8 py-3 text-sm font-bold transition-colors ${
                      isLight
                        ? "border-gray-200 bg-gray-50 text-gray-900 hover:bg-gray-100"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {saving ? "Saving..." : "Save Preferences"}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === "danger" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="mb-6 text-xl font-bold text-rose-400">Danger Zone</h2>

                <div className="space-y-6">
                  <div
                    className={`flex items-center justify-between rounded-2xl border p-6 ${
                      isLight
                        ? "border-gray-200 bg-gray-50"
                        : "border-white/10 bg-white/[0.02]"
                    }`}
                  >
                    <div>
                      <p className={`text-sm font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                        Sign Out
                      </p>
                      <p className={`mt-1 text-xs ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                        End your current session on this device.
                      </p>
                    </div>

                    <button
                      onClick={handleLogout}
                      className={`rounded-xl border px-6 py-2 text-xs font-bold ${
                        isLight
                          ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                          : "border-white/10 text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      Logout
                    </button>
                  </div>

                  <div
                    className={`flex items-center justify-between rounded-2xl border p-6 ${
                      isLight
                        ? "border-rose-200 bg-rose-50"
                        : "border-rose-500/20 bg-rose-500/5"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-rose-400">Delete Account</p>
                      <p className={`mt-1 text-xs ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                        Permanently remove all your progress and data.
                      </p>
                    </div>

                    <button
                      onClick={handleDeleteAccount}
                      className={`rounded-xl border px-6 py-2 text-xs font-bold transition-colors ${
                        isLight
                          ? "border-rose-200 bg-white text-rose-600 hover:bg-rose-100"
                          : "border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                      }`}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  tone = "neutral",
  isLight,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  tone?: "neutral" | "danger";
  isLight: boolean;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`absolute inset-0 ${
              isLight ? "bg-slate-900/35" : "bg-black/80"
            } backdrop-blur-sm`}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full max-w-sm overflow-hidden rounded-[28px] border p-8 ${
              isLight
                ? "border-gray-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]"
                : "border-white/10 bg-[#0d0d0d] shadow-2xl"
            }`}
          >
            <h3 className={`text-lg font-bold ${tone === "danger" ? "text-rose-400" : isLight ? "text-gray-900" : "text-white"}`}>
              {title}
            </h3>
            <p className={`mt-3 text-sm leading-relaxed ${isLight ? "text-gray-600" : "text-gray-400"}`}>
              {message}
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`w-full rounded-xl py-3 text-sm font-bold transition-all ${
                  tone === "danger"
                    ? isLight
                      ? "border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                      : "border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                    : isLight
                    ? "border border-gray-200 bg-gray-50 text-gray-900 hover:bg-gray-100"
                    : "border border-white/10 bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {confirmLabel}
              </button>

              <button
                onClick={onClose}
                className={`w-full rounded-xl py-3 text-sm font-bold transition-colors ${
                  isLight ? "text-gray-500 hover:text-gray-900" : "text-gray-500 hover:text-white"
                }`}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function TabItem({
  label,
  active,
  onClick,
  icon,
  isDanger = false,
  isLight,
}: any) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-2xl px-6 py-4 transition-all duration-200 ${
        active
          ? isLight
            ? "border border-pink-200 bg-pink-50 text-pink-700 shadow-[0_8px_18px_rgba(236,72,153,0.08)]"
            : "border border-pink-500/20 bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-300 shadow-lg shadow-pink-500/5"
          : isLight
          ? "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm"
          : "text-gray-400 hover:bg-white/5"
      } ${isDanger && !active ? (isLight ? "hover:bg-rose-50 hover:text-rose-600" : "hover:bg-rose-500/5") : ""}`}
    >
      <span className={active ? (isLight ? "text-pink-600" : "text-pink-400") : ""}>{icon}</span>
      <span className="text-sm font-bold">{label}</span>
    </button>
  );
}

function InputGroup({
  label,
  children,
  isLight,
}: {
  label: string;
  children: React.ReactNode;
  isLight: boolean;
}) {
  return (
    <div className="space-y-2">
      <label
        className={`text-xs font-bold uppercase tracking-widest ${
          isLight ? "text-gray-500" : "text-gray-500"
        }`}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  isLight,
}: any) {
  return (
    <div
      className={`flex items-center justify-between rounded-2xl border p-5 ${
        isLight
          ? "border-gray-200 bg-gray-50"
          : "border-white/10 bg-white/[0.02]"
      }`}
    >
      <div>
        <p className={`text-sm font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
          {label}
        </p>
        <p className={`mt-1 text-xs ${isLight ? "text-gray-500" : "text-gray-500"}`}>
          {description}
        </p>
      </div>

      <button
        onClick={onChange}
        className={`relative h-6 w-12 rounded-full transition-colors ${
          checked ? "bg-pink-500" : isLight ? "bg-gray-300" : "bg-white/10"
        }`}
      >
        <motion.div
          animate={{ x: checked ? 26 : 4 }}
          className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm"
        />
      </button>
    </div>
  );
}

const UserIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LockIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

const DangerIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);