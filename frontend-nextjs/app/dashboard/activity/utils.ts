export function formatDate(dateStr?: string): string {
  if (!dateStr) return "Recent";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function getDateGroup(dateStr?: string): string {
  if (!dateStr) return "Today";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7) return "This Week";
  if (diffDays <= 30) return "This Month";
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function isRecent(dateStr?: string): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const twoDaysMs = 2 * 24 * 60 * 60 * 1000;
  return Date.now() - date.getTime() < twoDaysMs;
}

export function getDifficultyColors(difficulty?: string, isLight?: boolean): string {
  if (!difficulty) return "";
  const lower = difficulty.toLowerCase();
  if (lower === "easy") {
    return isLight ? "text-emerald-600 bg-emerald-100" : "text-emerald-400 bg-emerald-500/20";
  }
  if (lower === "medium") {
    return isLight ? "text-amber-600 bg-amber-100" : "text-amber-400 bg-amber-500/20";
  }
  if (lower === "hard") {
    return isLight ? "text-red-600 bg-red-100" : "text-red-400 bg-red-500/20";
  }
  return "";
}
