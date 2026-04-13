"use client";

import { useTheme } from "@/app/context/ThemeContext";
import { Camera, Shield, Flame, BookOpen, Trash2 } from "lucide-react";

type ProfileHeaderProps = {
  user: {
    username: string;
    email: string;
    bio?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    role?: string;
    rank?: string;
  };
  isAdmin: boolean;
  resolvedProfilePic: string | null;
  imageError: boolean;
  avatarInitials: string;
  profileCompleteness: number;
  learningXp: number;
  strongestCategory: string;
  onAvatarClick: () => void;
  onAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAvatarRemove?: () => void;
  onEditClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
};

const DEFAULT_RANK = "Beginner";

export default function ProfileHeader({
  user,
  isAdmin,
  resolvedProfilePic,
  imageError,
  avatarInitials,
  profileCompleteness,
  learningXp,
  strongestCategory,
  onAvatarClick,
  onAvatarChange,
  onAvatarRemove,
  onEditClick,
  fileInputRef,
}: ProfileHeaderProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section
      className={`relative overflow-hidden rounded-3xl border p-5 sm:p-6 lg:p-7 ${
        isLight
          ? "border-gray-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
          : "border-white/10 bg-[#0a0a0a]"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-0 ${
          isLight
            ? "bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.08),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.06),transparent_24%)] opacity-70"
            : "bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.10),transparent_24%)]"
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-px ${
          isLight
            ? "bg-gradient-to-r from-transparent via-pink-200 to-transparent"
            : "bg-gradient-to-r from-transparent via-pink-500/30 to-transparent"
        }`}
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="group relative">
            <div
              onClick={onAvatarClick}
              className={`relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-3xl border transition duration-300 hover:border-pink-500/40 ${
                isLight
                  ? "border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-[0_18px_40px_rgba(15,23,42,0.10)]"
                  : isAdmin
                  ? "border-purple-500/30 bg-gradient-to-br from-white/[0.08] to-white/[0.02] shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
                  : "border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
              }`}
            >
              {resolvedProfilePic && !imageError ? (
                <img
                  src={resolvedProfilePic}
                  alt={user.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span
                  className={`text-2xl font-bold uppercase tracking-wide ${
                    isLight ? "text-gray-600" : "text-white/75"
                  }`}
                >
                  {avatarInitials}
                </span>
              )}
            </div>

            {isAdmin && (
              <div
                className={`absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border text-white shadow-lg ${
                  isLight
                    ? "border-white bg-purple-500"
                    : "border-white/10 bg-purple-500"
                }`}
              >
                <Shield className="h-3 w-3" />
              </div>
            )}

            <button
              onClick={onAvatarClick}
              className={`absolute -bottom-1 -right-1 inline-flex h-8 w-8 items-center justify-center rounded-full border text-white shadow-lg transition hover:scale-105 ${
                isLight
                  ? "border-white bg-gradient-to-r from-pink-500 to-purple-500"
                  : "border-white/10 bg-gradient-to-r from-pink-500 to-purple-500"
              }`}
              type="button"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>

            {resolvedProfilePic && !imageError && onAvatarRemove && (
              <button
                onClick={onAvatarRemove}
                className={`absolute -bottom-1 -left-1 inline-flex h-8 w-8 items-center justify-center rounded-full border text-white shadow-lg opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-105 hover:bg-red-500 ${
                  isLight
                    ? "border-white bg-red-500/80"
                    : "border-white/10 bg-red-500/80"
                }`}
                type="button"
                title="Remove photo"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onAvatarChange}
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1
                className={`max-w-[280px] truncate text-3xl font-semibold tracking-tight sm:max-w-[420px] sm:text-4xl ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                {user.username}
              </h1>
              <div
                className={`hidden h-2 w-2 rounded-full sm:block ${
                  isLight
                    ? "bg-emerald-500"
                    : "bg-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.9)]"
                }`}
              />
            </div>

            <p
              className={`mt-1 text-sm ${
                isLight ? "text-gray-600" : "text-gray-500"
              }`}
            >
              {user.email}
            </p>

            <p
              className={`mt-4 max-w-3xl text-sm leading-7 sm:text-[15px] ${
                isLight ? "text-gray-600" : "text-gray-300"
              }`}
            >
              {user.bio || "No bio added yet."}
            </p>

            {(user.githubUrl || user.linkedinUrl) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {user.githubUrl && (
                  <a
                    href={user.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex min-h-[36px] items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] font-medium transition ${
                      isLight
                        ? "border-gray-200 bg-gray-400 text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-500 hover:text-gray-900"
                        : "border-white/10 bg-white/[0.03] text-gray-300 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="leading-none">GitHub</span>
                  </a>
                )}

                {user.linkedinUrl && (
                  <a
                    href={user.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex min-h-[36px] items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] font-medium transition ${
                      isLight
                        ? "border-gray-200 text-gray-700 bg-blue-400 shadow-sm hover:border-gray-300 hover:bg-blue-500 hover:text-gray-900"
                        : "border-white/10 bg-white/[0.03] text-gray-300 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0zM7.119 20.452H3.555V9h3.564v11.452zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zM20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z" />
                    </svg>
                    <span className="leading-none">LinkedIn</span>
                  </a>
                )}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2.5">
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
                isLight={isLight}
              />
              <Badge
                label={`${profileCompleteness}% complete`}
                tone="pink"
                isLight={isLight}
              />
              <Badge
                label={`${learningXp} learning xp`}
                tone="neutral"
                isLight={isLight}
              />
              <Badge
                label={
                  strongestCategory &&
                  strongestCategory !== "No dominant area yet"
                    ? strongestCategory
                    : "Learning focus building"
                }
                tone="neutral"
                isLight={isLight}
              />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 lg:items-end">
          <button
            onClick={onEditClick}
            className={`rounded-xl border px-5 py-3 text-[10px] font-bold uppercase tracking-[0.22em] transition-all active:scale-95 ${
              isLight
                ? "border-gray-200 bg-gray-900 text-white shadow-[0_12px_30px_rgba(15,23,42,0.14)] hover:bg-black"
                : "border-white/10 bg-white text-black shadow-xl hover:bg-gray-100"
            }`}
            type="button"
          >
            Edit Identity
          </button>

          <div className="grid min-w-[230px] grid-cols-2 gap-2">
            <MiniSignalCard
              icon={<Flame className="h-3.5 w-3.5" />}
              label="Growth"
              value={profileCompleteness >= 80 ? "Strong" : "Building"}
              isLight={isLight}
            />
            <MiniSignalCard
              icon={<BookOpen className="h-3.5 w-3.5" />}
              label="Learning"
              value={learningXp > 0 ? "Active" : "Starting"}
              isLight={isLight}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({
  label,
  tone,
  isLight,
}: {
  label: string;
  tone: "pink" | "purple" | "neutral";
  isLight: boolean;
}) {
  const toneClass =
    tone === "pink"
      ? isLight
        ? "border-pink-200 bg-pink-50 text-pink-700"
        : "border-pink-500/20 bg-pink-500/10 text-pink-200"
      : tone === "purple"
      ? isLight
        ? "border-purple-200 bg-purple-50 text-purple-700"
        : "border-purple-500/20 bg-purple-500/10 text-purple-200"
      : isLight
      ? "border-gray-200 bg-white text-gray-700 shadow-sm"
      : "border-white/10 bg-white/[0.04] text-gray-300";

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${toneClass}`}
    >
      {label}
    </span>
  );
}

function MiniSignalCard({
  icon,
  label,
  value,
  isLight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLight: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border px-3 py-3 ${
        isLight
          ? "border-gray-200 bg-white shadow-sm"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <div
        className={`flex items-center gap-2 ${
          isLight ? "text-pink-600" : "text-pink-300"
        }`}
      >
        {icon}
      </div>
      <p
        className={`mt-2 text-[10px] uppercase tracking-[0.2em] ${
          isLight ? "text-gray-500" : "text-gray-500"
        }`}
      >
        {label}
      </p>
      <p
        className={`mt-1 text-sm font-semibold ${
          isLight ? "text-gray-900" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}