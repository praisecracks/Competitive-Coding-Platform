"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type EditProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: {
    username: string;
    bio: string;
    rank: string;
    country: string;
    githubUrl: string;
    linkedinUrl: string;
  };
  onSave: (data: {
    username: string;
    bio: string;
    rank: string;
    country: string;
    githubUrl: string;
    linkedinUrl: string;
  }) => Promise<void>;
  isSaving?: boolean;
};

const USERNAME_MIN = 3;
const USERNAME_MAX = 20;
const BIO_MAX = 220;
const URL_MAX = 200;

const RANK_OPTIONS = [
  "Beginner",
  "Novice",
  "Apprentice",
  "Expert",
  "Master",
  "Grandmaster",
];

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

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
  onSave,
  isSaving = false,
}: EditProfileModalProps) {
  const [editedUsername, setEditedUsername] = useState("");
  const [editedBio, setEditedBio] = useState("");
  const [editedRank, setEditedRank] = useState("");
  const [editedCountry, setEditedCountry] = useState("");
  const [editedGithubUrl, setEditedGithubUrl] = useState("");
  const [editedLinkedinUrl, setEditedLinkedinUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset form when modal opens or user changes
  useEffect(() => {
    if (isOpen && user) {
      setEditedUsername(user.username || "");
      setEditedBio(user.bio || "");
      setEditedRank(user.rank || "Beginner");
      setEditedCountry(user.country || "");
      setEditedGithubUrl(user.githubUrl || "");
      setEditedLinkedinUrl(user.linkedinUrl || "");
      setErrors({});
      setTouched({});
    }
  }, [isOpen, user]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const validateField = useCallback((field: string, value: string) => {
    switch (field) {
      case "username":
        if (!value.trim()) {
          return "Username cannot be empty.";
        }
        if (value.length < USERNAME_MIN) {
          return `Username must be at least ${USERNAME_MIN} characters.`;
        }
        if (value.length > USERNAME_MAX) {
          return `Username must not exceed ${USERNAME_MAX} characters.`;
        }
        return "";
      case "bio":
        if (value.length > BIO_MAX) {
          return `Bio should be ${BIO_MAX} characters or less.`;
        }
        return "";
      case "githubUrl":
        if (value && !isValidUrl(normalizeUrl(value))) {
          return "Please enter a valid GitHub URL.";
        }
        return "";
      case "linkedinUrl":
        if (value && !isValidUrl(normalizeUrl(value))) {
          return "Please enter a valid LinkedIn URL.";
        }
        return "";
      default:
        return "";
    }
  }, []);

  const handleFieldChange = (field: string, value: string) => {
    let newValue = value;
    if (field === "username") newValue = clampUsername(value);
    if (field === "bio") newValue = clampBio(value);
    if (field === "githubUrl" || field === "linkedinUrl") newValue = clampUrl(value);
    if (field === "country") newValue = value.trim();

    switch (field) {
      case "username":
        setEditedUsername(newValue);
        break;
      case "bio":
        setEditedBio(newValue);
        break;
      case "rank":
        setEditedRank(newValue);
        break;
      case "country":
        setEditedCountry(newValue);
        break;
      case "githubUrl":
        setEditedGithubUrl(newValue);
        break;
      case "linkedinUrl":
        setEditedLinkedinUrl(newValue);
        break;
    }

    const error = validateField(field, newValue);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async () => {
    // Validate all fields
    const fieldsToValidate = [
      { field: "username", value: editedUsername },
      { field: "bio", value: editedBio },
      { field: "githubUrl", value: editedGithubUrl },
      { field: "linkedinUrl", value: editedLinkedinUrl },
    ];

    const newErrors: Record<string, string> = {};
    fieldsToValidate.forEach(({ field, value }) => {
      const error = validateField(field, value);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({
        username: true,
        bio: true,
        githubUrl: true,
        linkedinUrl: true,
      });
      return;
    }

    const normalizedGithubUrl = normalizeUrl(editedGithubUrl);
    const normalizedLinkedinUrl = normalizeUrl(editedLinkedinUrl);

    await onSave({
      username: editedUsername.trim(),
      bio: editedBio.trim(),
      rank: editedRank,
      country: editedCountry.trim(),
      githubUrl: normalizedGithubUrl,
      linkedinUrl: normalizedLinkedinUrl,
    });
  };

  const bioLength = editedBio.length;
  const hasChanges = () => {
    return (
      editedUsername !== (user.username || "") ||
      editedBio !== (user.bio || "") ||
      editedRank !== (user.rank || "Beginner") ||
      editedCountry !== (user.country || "") ||
      editedGithubUrl !== (user.githubUrl || "") ||
      editedLinkedinUrl !== (user.linkedinUrl || "")
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container - Centered with responsive sizing */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl flex flex-col"
            style={{ 
              maxHeight: "90vh",
              maxWidth: "min(95%, 500px)" // Constrained width for desktop
            }}
          >
            {/* Header with close button always visible */}
            <div className="sticky top-0 z-10 border-b border-white/10 bg-gradient-to-r from-pink-500/5 to-purple-500/5 px-4 sm:px-6 py-3 sm:py-5 backdrop-blur-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-white">
                    Edit Profile
                  </h2>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-500">
                    Refine your public account identity
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="shrink-0 rounded-lg p-1.5 sm:p-2 text-gray-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  type="button"
                  aria-label="Close modal"
                >
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div 
              ref={scrollContainerRef}
              className="overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 flex-1"
            >
              <div className="space-y-4 sm:space-y-6">
                {/* Username */}
                <div>
                  <label className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium text-gray-300">
                    Username
                  </label>
                  <input
                    value={editedUsername}
                    onChange={(e) =>
                      handleFieldChange("username", e.target.value)
                    }
                    onBlur={() => handleBlur("username")}
                    maxLength={USERNAME_MAX}
                    className={`w-full rounded-lg border ${
                      errors.username && touched.username
                        ? "border-red-500/50 bg-red-500/5"
                        : "border-white/10 bg-[#111111]"
                    } px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white outline-none transition focus:border-pink-500/50 placeholder:text-gray-600`}
                    placeholder="Choose a username"
                  />
                  <div className="mt-1.5 sm:mt-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      {USERNAME_MIN}–{USERNAME_MAX} characters
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      {editedUsername.length}/{USERNAME_MAX}
                    </p>
                  </div>
                  {errors.username && touched.username && (
                    <p className="mt-1.5 text-[10px] sm:text-xs text-red-400">
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Rank */}
                <div>
                  <label className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium text-gray-300">
                    Skill Level
                  </label>
                  <select
                    value={editedRank}
                    onChange={(e) => handleFieldChange("rank", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#111111] px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white outline-none transition focus:border-pink-500/50"
                  >
                    {RANK_OPTIONS.map((rank) => (
                      <option key={rank} value={rank} className="bg-[#111111]">
                        {rank}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Country */}
                <div>
                  <label className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium text-gray-300">
                    Country
                    <span className="ml-2 text-[10px] sm:text-xs text-gray-500">
                      (optional)
                    </span>
                  </label>
                  <input
                    value={editedCountry}
                    onChange={(e) =>
                      handleFieldChange("country", e.target.value)
                    }
                    onBlur={() => handleBlur("country")}
                    className="w-full rounded-lg border border-white/10 bg-[#111111] px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white outline-none transition focus:border-pink-500/50 placeholder:text-gray-600"
                    placeholder="e.g., United States, India, UK"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium text-gray-300">
                    Bio
                  </label>
                  <textarea
                    value={editedBio}
                    onChange={(e) => handleFieldChange("bio", e.target.value)}
                    onBlur={() => handleBlur("bio")}
                    rows={3}
                    maxLength={BIO_MAX}
                    className={`w-full resize-none rounded-lg border ${
                      errors.bio && touched.bio
                        ? "border-red-500/50 bg-red-500/5"
                        : "border-white/10 bg-[#111111]"
                    } px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white outline-none transition focus:border-pink-500/50 placeholder:text-gray-600`}
                    placeholder="Tell people a little about yourself..."
                  />
                  <div className="mt-1.5 sm:mt-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      Keep it specific and professional
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      {bioLength}/{BIO_MAX}
                    </p>
                  </div>
                  {errors.bio && touched.bio && (
                    <p className="mt-1.5 text-[10px] sm:text-xs text-red-400">{errors.bio}</p>
                  )}
                </div>

                {/* GitHub URL */}
                <div>
                  <label className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium text-gray-300">
                    GitHub Profile
                    <span className="ml-2 text-[10px] sm:text-xs text-gray-500">
                      (optional)
                    </span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      value={editedGithubUrl}
                      onChange={(e) =>
                        handleFieldChange("githubUrl", e.target.value)
                      }
                      onBlur={() => handleBlur("githubUrl")}
                      maxLength={URL_MAX}
                      className={`w-full rounded-lg border ${
                        errors.githubUrl && touched.githubUrl
                          ? "border-red-500/50 bg-red-500/5"
                          : "border-white/10 bg-[#111111]"
                      } py-2.5 sm:py-3 pl-9 sm:pl-10 pr-3 sm:pr-4 text-sm text-white outline-none transition focus:border-pink-500/50 placeholder:text-gray-600`}
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                  {errors.githubUrl && touched.githubUrl && (
                    <p className="mt-1.5 text-[10px] sm:text-xs text-red-400">
                      {errors.githubUrl}
                    </p>
                  )}
                </div>

                {/* LinkedIn URL */}
                <div>
                  <label className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium text-gray-300">
                    LinkedIn Profile
                    <span className="ml-2 text-[10px] sm:text-xs text-gray-500">
                      (optional)
                    </span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z" />
                      </svg>
                    </div>
                    <input
                      value={editedLinkedinUrl}
                      onChange={(e) =>
                        handleFieldChange("linkedinUrl", e.target.value)
                      }
                      onBlur={() => handleBlur("linkedinUrl")}
                      maxLength={URL_MAX}
                      className={`w-full rounded-lg border ${
                        errors.linkedinUrl && touched.linkedinUrl
                          ? "border-red-500/50 bg-red-500/5"
                          : "border-white/10 bg-[#111111]"
                      } py-2.5 sm:py-3 pl-9 sm:pl-10 pr-3 sm:pr-4 text-sm text-white outline-none transition focus:border-pink-500/50 placeholder:text-gray-600`}
                      placeholder="https://linkedin.com/in/yourusername"
                    />
                  </div>
                  {errors.linkedinUrl && touched.linkedinUrl && (
                    <p className="mt-1.5 text-[10px] sm:text-xs text-red-400">
                      {errors.linkedinUrl}
                    </p>
                  )}
                </div>

                {/* Professional Tips */}
                <div className="rounded-lg border border-pink-500/20 bg-pink-500/5 p-3 sm:p-4">
                  <p className="mb-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-pink-300">
                    Professional Tips
                  </p>
                  <ul className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-sm text-gray-400">
                    <li className="flex items-start gap-1.5 sm:gap-2">
                      <span className="mt-0.5 text-pink-400 text-xs">✓</span>
                      <span className="flex-1">
                        Add your GitHub to showcase your code contributions
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5 sm:gap-2">
                      <span className="mt-0.5 text-pink-400 text-xs">✓</span>
                      <span className="flex-1">
                        Connect LinkedIn to build professional credibility
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5 sm:gap-2">
                      <span className="mt-0.5 text-pink-400 text-xs">✓</span>
                      <span className="flex-1">
                        Complete profile increases trust and visibility
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 border-t border-white/10 bg-[#0f0f12] px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto rounded-lg border border-white/10 bg-white/[0.03] px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-300 transition hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSaving || !hasChanges()}
                  className="w-full sm:w-auto rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium text-white transition hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  type="button"
                >
                  {isSaving ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
