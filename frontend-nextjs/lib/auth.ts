export const AUTH_TOKEN_KEY = "terminal_token";
export const AUTH_USERNAME_KEY = "user_name";
export const AUTH_EMAIL_KEY = "user_email";
export const AUTH_USER_KEY = "user";

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
}

export function sanitizeRedirect(value: string | null): string {
  if (!value) return "/dashboard";
  if (!value.startsWith("/")) return "/dashboard";
  if (value.startsWith("//")) return "/dashboard";
  return value;
}