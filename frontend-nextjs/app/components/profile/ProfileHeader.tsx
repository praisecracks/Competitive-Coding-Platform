"use client";

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
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a] p-5 sm:p-6 lg:p-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.10),transparent_24%)]" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="group relative">
            <div
              onClick={onAvatarClick}
              className={`relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-3xl border ${
                isAdmin ? "border-purple-500/30" : "border-white/10"
              } bg-gradient-to-br from-white/[0.08] to-white/[0.02] shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition duration-300 hover:border-pink-500/40`}
            >
              {resolvedProfilePic && !imageError ? (
                <img
                  src={resolvedProfilePic}
                  alt={user.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold uppercase tracking-wide text-white/75">
                  {avatarInitials}
                </span>
              )}
            </div>

            {isAdmin && (
              <div className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-purple-500 text-white shadow-lg">
                <Shield className="h-3 w-3" />
              </div>
            )}

            <button
              onClick={onAvatarClick}
              className="absolute -bottom-1 -right-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg transition hover:scale-105"
              type="button"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>

            {resolvedProfilePic && !imageError && onAvatarRemove && (
              <button
                onClick={onAvatarRemove}
                className="absolute -bottom-1 -left-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-red-500/80 text-white shadow-lg opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-105 hover:bg-red-500"
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
              <h1 className="max-w-[280px] truncate text-3xl font-semibold tracking-tight text-white sm:max-w-[420px] sm:text-4xl">
                {user.username}
              </h1>

              <div className="hidden h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.9)] sm:block" />
            </div>

            <p className="mt-1 text-sm text-gray-500">{user.email}</p>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-300 sm:text-[15px]">
              {user.bio || "No bio added yet."}
            </p>

            {(user.githubUrl || user.linkedinUrl) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {user.githubUrl && (
                  <a
                    href={user.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-gray-300 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <svg
                      className="h-3 w-3"
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
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-gray-300 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <svg
                      className="h-3 w-3"
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
              />
              <Badge label={`${profileCompleteness}% complete`} tone="pink" />
              <Badge label={`${learningXp} learning xp`} tone="neutral" />
              <Badge
                label={
                  strongestCategory && strongestCategory !== "No dominant area yet"
                    ? strongestCategory
                    : "Learning focus building"
                }
                tone="neutral"
              />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 lg:items-end">
          <button
            onClick={onEditClick}
            className="rounded-xl border border-white/10 bg-white px-5 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-black shadow-xl transition-all hover:bg-gray-200 active:scale-95"
            type="button"
          >
            Edit Identity
          </button>

          <div className="grid min-w-[230px] grid-cols-2 gap-2">
            <MiniSignalCard
              icon={<Flame className="h-3.5 w-3.5" />}
              label="Growth"
              value={profileCompleteness >= 80 ? "Strong" : "Building"}
            />
            <MiniSignalCard
              icon={<BookOpen className="h-3.5 w-3.5" />}
              label="Learning"
              value={learningXp > 0 ? "Active" : "Starting"}
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
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3">
      <div className="flex items-center gap-2 text-pink-300">{icon}</div>
      <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}