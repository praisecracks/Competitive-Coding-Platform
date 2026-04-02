// Use Next.js API proxy - requests to /api/* are proxied to the Go backend
const API_BASE_URL = "/api";

export interface SearchUser {
  id: string;
  username: string;
  rank?: string;
  profile_pic?: string;
}

export interface SearchChallenge {
  id: string;
  title: string;
  difficulty?: string;
  category?: string;
  tags?: string[];
}

export interface SearchResults {
  users: SearchUser[];
  challenges: SearchChallenge[];
}

/**
 * Debounce function to prevent excessive API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Fetch search results from backend
 */
export async function fetchSearchResults(
  query: string,
  token?: string
): Promise<SearchResults> {
  if (!query.trim()) {
    return { users: [], challenges: [] };
  }

  try {
    const params = new URLSearchParams({
      q: query.trim(),
    });

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_BASE_URL}/search?${params.toString()}`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      console.error("Search API error:", response.status);
      return { users: [], challenges: [] };
    }

    const data = await response.json();
    return {
      users: Array.isArray(data.users) ? data.users : [],
      challenges: Array.isArray(data.challenges) ? data.challenges : [],
    };
  } catch (error) {
    console.error("Search fetch error:", error);
    return { users: [], challenges: [] };
  }
}

/**
 * Get initials from a name for avatar fallback
 */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

/**
 * Highlight search query in text
 */
export function highlightMatch(text: string, query: string): string {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}
