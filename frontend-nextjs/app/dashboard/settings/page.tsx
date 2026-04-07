"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { clearUserSession } from "@/lib/auth";

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
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Confirmation Modals
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Profile State
  const [profile, setProfile] = useState<ProfileData>({
    id: "",
    username: "",
    email: "",
    bio: "",
    country: "",
    profile_pic: null,
  });

  // Password State
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Preferences State
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    challengeReminders: true,
    publicProfile: false,
    weeklySummary: false,
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

      // Use relative /api path to ensure proxy works correctly
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
        weeklySummary: false, // weeklySummary is not yet in DB
      });
    } catch (err) {
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
      // Use relative /api path to ensure proxy works correctly
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
    } catch (err) {
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
      // Use relative /api path to ensure proxy works correctly
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(preferences),
      });

      if (!res.ok) throw new Error("Update failed");
      showNotification("Preferences saved successfully!");
    } catch (err) {
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
      const res = await fetch("/api/account", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Account deletion failed");
      }

      // Clear session and redirect to login
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
    <div className={`min-h-screen ${isAdmin ? 'bg-[#0a0a0a]' : 'bg-[#050507]'} text-white`}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">
              {isAdmin ? "Administrative Controls" : "Personal Preferences"}
            </h1>
            <p className="mt-1 text-xs text-gray-500 font-black uppercase tracking-widest">
              {isAdmin ? "Configure system-level personal settings" : "Manage your identity and platform experience"}
            </p>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-500/10 border border-purple-500/20">
              <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Admin Mode</span>
            </div>
          )}
        </header>
        {/* Notifications */}
        <AnimatePresence>
          {(error || success) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed right-6 top-24 z-[110] rounded-xl border px-6 py-3 shadow-2xl backdrop-blur-md ${
                error ? "border-red-500/20 bg-red-500/10 text-red-400" : "border-green-500/20 bg-green-500/10 text-green-400"
              }`}
            >
              {error || success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirmation Modals */}
        <ConfirmationModal
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={confirmLogout}
          title="Sign Out"
          message="Are you sure you want to log out of your current session?"
          confirmLabel="Log Out"
          tone="neutral"
        />

        <ConfirmationModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDelete}
          title="Delete Account"
          message="This action is permanent and cannot be undone. All your progress, challenge history, and profile data will be erased. Are you absolutely sure?"
          confirmLabel="Delete permanently"
          tone="danger"
        />

        <header className="mb-8 overflow-hidden rounded-[32px] border border-white/10 bg-[#0a0a0a] p-8 shadow-2xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-pink-500/20 bg-pink-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-pink-300">
                Control Panel
              </span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">System Settings</h1>
              <p className="mt-2 text-gray-400">Manage your identity, security, and preferences.</p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium transition hover:bg-white/10"
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
            />
            <TabItem
              active={activeTab === "account"}
              onClick={() => setActiveTab("account")}
              label="Account Security"
              icon={<LockIcon />}
            />
            <TabItem
              active={activeTab === "preferences"}
              onClick={() => setActiveTab("preferences")}
              label="Platform Preferences"
              icon={<SettingsIcon />}
            />
            <TabItem
              active={activeTab === "danger"}
              onClick={() => setActiveTab("danger")}
              label="Danger Zone"
              icon={<DangerIcon />}
              isDanger
            />
          </aside>

          <main className="rounded-[32px] border border-white/10 bg-[#0a0a0a] p-8 shadow-xl">
            {activeTab === "profile" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-xl font-bold text-white mb-6">Profile Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="h-20 w-20 rounded-2xl border border-white/10 bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center text-2xl font-bold text-pink-300 overflow-hidden">
                      {resolvedAvatar ? (
                        <img src={resolvedAvatar} className="h-full w-full object-cover rounded-2xl" />
                      ) : (
                        <svg className="w-10 h-10 text-pink-300/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Profile Photo</p>
                      <p className="text-xs text-gray-500 mt-1">Your identity across CODEMASTER.</p>
                      <Link href="/dashboard/profile" className="text-xs text-pink-400 hover:underline mt-2 inline-block">Update avatar in Profile →</Link>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <InputGroup label="Username">
                      <input
                        type="text"
                        value={profile.username}
                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-pink-500/50 focus:outline-none"
                      />
                    </InputGroup>
                    <InputGroup label="Country">
                      <input
                        type="text"
                        value={profile.country}
                        onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-pink-500/50 focus:outline-none"
                      />
                    </InputGroup>
                  </div>

                  <InputGroup label="Bio">
                    <textarea
                      rows={4}
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-pink-500/50 focus:outline-none resize-none"
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
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400">
                    <LockIcon />
                  </div>
                  <h2 className="text-xl font-bold text-white">Account Security</h2>
                </div>
                
                <div className="space-y-8">
                  <div className="p-6 rounded-[24px] border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent space-y-6">
                    <InputGroup label="Public User ID">
                      <div className="flex items-center gap-3 w-full rounded-xl border border-white/5 bg-black/20 px-4 py-3 text-sm text-gray-400">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        <span className="font-mono truncate flex-1">{profile.id}</span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(profile.id);
                            showNotification("ID copied to clipboard!");
                          }}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-pink-400"
                          title="Copy ID"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-2">
                        Share this ID with others to invite you to duels.
                      </p>
                    </InputGroup>

                    <InputGroup label="Registered Email">
                      <div className="flex items-center gap-3 w-full rounded-xl border border-white/5 bg-black/20 px-4 py-3 text-sm text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {profile.email}
                      </div>
                      <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1.5">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        Email changes are locked to your identity for security.
                      </p>
                    </InputGroup>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-[#050507] p-8 shadow-inner overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                      <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-2">Update Credentials</h3>
                    <p className="text-xs text-gray-500 mb-6">Rotate your password periodically to keep your account safe.</p>
                    
                    <div className="space-y-4 max-w-md">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-gray-600 font-bold ml-1">Current Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={passwords.current}
                          onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white focus:border-pink-500/50 focus:outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-gray-600 font-bold ml-1">New Secure Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={passwords.new}
                          onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white focus:border-pink-500/50 focus:outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-gray-600 font-bold ml-1">Confirm New Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={passwords.confirm}
                          onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white focus:border-pink-500/50 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between gap-6 border-t border-white/5 pt-6">
                      <p className="text-[10px] text-gray-500 leading-relaxed max-w-[200px]">
                        By updating, you will be required to use this new password for all future sessions.
                      </p>
                      <button
                        onClick={handlePasswordSave}
                        disabled={saving}
                        className="rounded-xl bg-white/5 border border-white/10 px-8 py-3 text-sm font-bold text-white hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50"
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
                <h2 className="text-xl font-bold text-white mb-6">Platform Preferences</h2>
                <div className="space-y-4">
                  <ToggleRow
                    label="Email Notifications"
                    description="Get updates about platform changes and achievements."
                    checked={preferences.emailNotifications}
                    onChange={() => setPreferences({ ...preferences, emailNotifications: !preferences.emailNotifications })}
                  />
                  <ToggleRow
                    label="Challenge Reminders"
                    description="We'll nudge you to maintain your coding streak."
                    checked={preferences.challengeReminders}
                    onChange={() => setPreferences({ ...preferences, challengeReminders: !preferences.challengeReminders })}
                  />
                  <ToggleRow
                    label="Public Profile"
                    description="Allow other developers to find your profile."
                    checked={preferences.publicProfile}
                    onChange={() => setPreferences({ ...preferences, publicProfile: !preferences.publicProfile })}
                  />
                </div>
                <div className="flex justify-end pt-8">
                   <button 
                    onClick={handlePreferencesSave}
                    disabled={saving}
                    className="rounded-xl bg-white/5 border border-white/10 px-8 py-3 text-sm font-bold hover:bg-white/10 transition-colors"
                   >
                     {saving ? "Saving..." : "Save Preferences"}
                   </button>
                </div>
              </motion.div>
            )}

            {activeTab === "danger" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-xl font-bold text-rose-400 mb-6">Danger Zone</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                    <div>
                      <p className="text-sm font-bold text-white">Sign Out</p>
                      <p className="text-xs text-gray-500 mt-1">End your current session on this device.</p>
                    </div>
                    <button 
                      onClick={handleLogout} 
                      className="rounded-xl border border-white/10 px-6 py-2 text-xs font-bold hover:bg-white/5 text-gray-300"
                    >
                      Logout
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-6 rounded-2xl border border-rose-500/20 bg-rose-500/5">
                    <div>
                      <p className="text-sm font-bold text-rose-400">Delete Account</p>
                      <p className="text-xs text-gray-500 mt-1">Permanently remove all your progress and data.</p>
                    </div>
                    <button 
                      onClick={handleDeleteAccount}
                      className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-6 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-colors"
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
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  tone?: "neutral" | "danger";
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
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0d0d] p-8 shadow-2xl"
          >
            <h3 className={`text-lg font-bold ${tone === 'danger' ? 'text-rose-400' : 'text-white'}`}>
              {title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
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
                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
                    : "bg-white/10 text-white border border-white/10 hover:bg-white/20"
                }`}
              >
                {confirmLabel}
              </button>
              <button
                onClick={onClose}
                className="w-full rounded-xl py-3 text-sm font-bold text-gray-500 hover:text-white transition-colors"
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

function TabItem({ label, active, onClick, icon, isDanger = false }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 ${
        active 
          ? "bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 text-pink-300 shadow-lg shadow-pink-500/5" 
          : "hover:bg-white/5 text-gray-400"
      } ${isDanger && !active ? "hover:bg-rose-500/5" : ""}`}
    >
      <span className={active ? "text-pink-400" : ""}>{icon}</span>
      <span className="text-sm font-bold">{label}</span>
    </button>
  );
}

function InputGroup({ label, children }: any) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange }: any) {
  return (
    <div className="flex items-center justify-between p-5 rounded-2xl border border-white/10 bg-white/[0.02]">
      <div>
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`w-12 h-6 rounded-full transition-colors relative ${checked ? "bg-pink-500" : "bg-white/10"}`}
      >
        <motion.div
          animate={{ x: checked ? 26 : 4 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
        />
      </button>
    </div>
  );
}

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);
const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
);
const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
);
const DangerIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
);
