export const AUTH_TOKEN_KEY = "terminal_token";
export const AUTH_USERNAME_KEY = "user_name";
export const AUTH_EMAIL_KEY = "user_email";
export const AUTH_USER_KEY = "user";

export const GLOBAL_PROGRESS_KEY = "codemaster_learning_track_progress";
export const GLOBAL_LEGACY_PROGRESS_KEY = "codemaster_learning_progress_v1";
export const GLOBAL_STREAK_KEY = "codemaster_learning_streak_v1";
export const GLOBAL_JOURNAL_KEY = "codemaster_learning_journal";

function sanitizeKeyPart(value: string): string {
  if (!value) return "anonymous";
  return value.toLowerCase().replace(/[^a-z0-9@._-]/g, "_").slice(0, 64);
}

export function getUserScopedKey(baseKey: string): string {
  if (typeof window === "undefined") return baseKey;

  const stored = localStorage.getItem(AUTH_EMAIL_KEY);
  if (!stored) return baseKey;

  const sanitized = sanitizeKeyPart(stored);
  return `${baseKey}_${sanitized}`;
}

export function getUserProgressKey(): string {
  return getUserScopedKey(GLOBAL_PROGRESS_KEY);
}

export function getUserLegacyProgressKey(): string {
  return getUserScopedKey(GLOBAL_LEGACY_PROGRESS_KEY);
}

export function getUserStreakKey(): string {
  return getUserScopedKey(GLOBAL_STREAK_KEY);
}

export function getUserJournalKey(): string {
  return getUserScopedKey(GLOBAL_JOURNAL_KEY);
}

type PersistedUser = {
  username: string;
  email: string;
  country: string;
  profile_pic: string;
  role: string;
};

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(AUTH_TOKEN_KEY);
}

export function normalizeProfileImageUrl(profilePic?: string | null): string {
  if (!profilePic) return "";

  const trimmed = profilePic.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("/uploads/")) {
    return trimmed;
  }

  const uploadsIndex = trimmed.indexOf("/uploads/");
  if (uploadsIndex !== -1) {
    return trimmed.slice(uploadsIndex);
  }

  return trimmed;
}

export function getStoredUser(): PersistedUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);

    return {
      username: parsed?.username || "",
      email: parsed?.email || "",
      country: parsed?.country || "",
      profile_pic: normalizeProfileImageUrl(
        parsed?.profile_pic || parsed?.profilePic || ""
      ),
      role: parsed?.role || "user",
    };
  } catch {
    return null;
  }
}

export function persistUserSession(data: {
  token?: string;
  username?: string;
  email?: string;
  country?: string;
  profile_pic?: string;
  profilePic?: string;
  role?: string;
}) {
  if (typeof window === "undefined") return;

  if (data.token) {
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
  }

  if (data.username) {
    localStorage.setItem(AUTH_USERNAME_KEY, data.username);
  }

  if (data.email) {
    localStorage.setItem(AUTH_EMAIL_KEY, data.email);
  }

  const normalizedProfilePic = normalizeProfileImageUrl(
    data.profile_pic || data.profilePic || ""
  );

  localStorage.setItem(
    AUTH_USER_KEY,
    JSON.stringify({
      username: data.username || "",
      email: data.email || "",
      country: data.country || "",
      profile_pic: normalizedProfilePic,
      role: data.role || "user",
    })
  );
}

export function clearUserSession() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USERNAME_KEY);
  localStorage.removeItem(AUTH_EMAIL_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem("user_pic");

  localStorage.removeItem("dashboard_notifications");
  localStorage.removeItem("dismissed_notification_ids");
}

export function sanitizeRedirect(value: string | null): string {
  if (!value) return "/dashboard";
  if (!value.startsWith("/")) return "/dashboard";
  if (value.startsWith("//")) return "/dashboard";
  return value;
}