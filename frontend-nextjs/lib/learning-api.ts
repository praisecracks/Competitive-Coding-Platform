// frontend-nextjs/lib/learning-api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

async function getAuthHeaders(): Promise<HeadersInit> {
  const token = localStorage.getItem("terminal_token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

export interface TrackProgress {
  completedTopicIds: string[];
  completedLessonIds: string[];
  lessonProgress: Record<string, { completed: boolean; timeSpentSeconds: number }>;
  topicTimeSpent: Record<string, number>;
  startedAt?: string;
  lastAccessedAt?: string;
}

export interface LegacyPathProgress {
  completedStepIds: string[];
  liked: boolean;
  rating: number | null;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastLearningDate: string;
}

export interface JournalEntry {
  id: string;
  type: "course_completion" | "topic_completion";
  title: string;
  completedAt: string;
  noteContent?: {
    courseTitle: string;
    stepTitle: string;
    description?: string;
    content?: string[];
    example?: {
      title?: string;
      code?: string;
      explanation?: string;
    };
    commonMistake?: string;
    keyTakeaways?: string[];
  };
}

export interface LearningProgress {
  id?: string;
  userId: string;
  trackProgress: Record<string, TrackProgress>;
  legacyProgress: Record<string, LegacyPathProgress>;
  streak: StreakData;
  journal: JournalEntry[];
  createdAt?: string;
  updatedAt?: string;
}

export async function getLearningProgress(): Promise<LearningProgress> {
  const token = localStorage.getItem("terminal_token");
  const userEmail = localStorage.getItem("user_email");
  const sanitized = userEmail ? sanitizeForKey(userEmail) : null;
  
  // Try MongoDB API first
  try {
    const res = await fetch(`${API_BASE_URL}/learning/progress`, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (res.ok) {
      return res.json();
    }
  } catch (e) {
    console.warn("MongoDB API unavailable, falling back to localStorage");
  }

  // Fallback to localStorage
  return fallbackToLocalStorage(sanitized);
}

function sanitizeForKey(value: string): string {
  if (!value) return "anonymous";
  return value.toLowerCase().replace(/[^a-z0-9@._-]/g, "_").slice(0, 64);
}

function fallbackToLocalStorage(sanitized: string | null): LearningProgress {
  const result: LearningProgress = {
    userId: "",
    trackProgress: {},
    legacyProgress: {},
    streak: { currentStreak: 0, longestStreak: 0, lastLearningDate: "" },
    journal: [],
  };

  if (!sanitized) return result;

  try {
    // Try user-scoped key first
    const localProgress = localStorage.getItem(`codemaster_learning_track_progress_${sanitized}`);
    if (localProgress) {
      const parsed = JSON.parse(localProgress);
      result.trackProgress = parsed;
    }

    const localLegacy = localStorage.getItem(`codemaster_learning_progress_v1_${sanitized}`);
    if (localLegacy) {
      result.legacyProgress = JSON.parse(localLegacy);
    }

    const localStreak = localStorage.getItem(`codemaster_learning_streak_v1_${sanitized}`);
    if (localStreak) {
      result.streak = JSON.parse(localStreak);
    }

    const localJournal = localStorage.getItem(`codemaster_learning_journal_${sanitized}`);
    if (localJournal) {
      result.journal = JSON.parse(localJournal);
    }
  } catch (e) {
    console.error("localStorage fallback failed", e);
  }

  return result;
}

export async function updateTrackProgress(trackId: string, progress: TrackProgress): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/learning/track-progress`, {
    method: "PUT",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ trackId, progress }),
  });

  if (!res.ok) {
    throw new Error("Failed to update track progress");
  }
}

export async function updateStreak(completedLesson: boolean = true): Promise<StreakData> {
  const res = await fetch(`${API_BASE_URL}/learning/streak`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ completedLesson }),
  });

  if (!res.ok) {
    throw new Error("Failed to update streak");
  }

  return res.json();
}

export async function addJournalEntry(entry: Omit<JournalEntry, "id" | "completedAt">): Promise<JournalEntry> {
  const res = await fetch(`${API_BASE_URL}/learning/journal`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(entry),
  });

  if (!res.ok) {
    throw new Error("Failed to add journal entry");
  }

  return res.json();
}

export async function deleteJournalEntry(entryId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/learning/journal/${entryId}`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to delete journal entry");
  }
}

export async function updateLegacyProgress(pathId: string, progress: LegacyPathProgress): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/learning/legacy-progress`, {
    method: "PUT",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ pathId, progress }),
  });

  if (!res.ok) {
    throw new Error("Failed to update legacy progress");
  }
}

// Legacy localStorage keys for migration
const LEGACY_GLOBAL_PROGRESS_KEY = "codemaster_learning_track_progress";
const LEGACY_LEGACY_PROGRESS_KEY = "codemaster_learning_progress_v1";
const LEGACY_STREAK_KEY = "codemaster_learning_streak_v1";
const LEGACY_JOURNAL_KEY = "codemaster_learning_journal";

const MIGRATION_DONE_KEY = "codemaster_learning_migrated";

// Check if user has old localStorage data
function hasLegacyData(): boolean {
  return !!(
    localStorage.getItem(LEGACY_GLOBAL_PROGRESS_KEY) ||
    localStorage.getItem(LEGACY_LEGACY_PROGRESS_KEY) ||
    localStorage.getItem(LEGACY_STREAK_KEY) ||
    localStorage.getItem(LEGACY_JOURNAL_KEY)
  );
}

// Migrate localStorage progress to MongoDB
export async function migrateLegacyProgress(): Promise<LearningProgress> {
  const userEmail = localStorage.getItem("user_email");
  const sanitized = userEmail ? sanitizeForKey(userEmail) : null;

  // Check if migration already done (for MongoDB mode)
  if (localStorage.getItem(MIGRATION_DONE_KEY) === "true") {
    return getLearningProgress();
  }

  // Check if there's legacy global data to migrate
  if (!hasLegacyData()) {
    localStorage.setItem(MIGRATION_DONE_KEY, "true");
    return getLearningProgress();
  }

  try {
    // Get current MongoDB progress
    const mongoProgress = await getLearningProgress().catch(() => null);
    const hasMongoData = mongoProgress && 
      (Object.keys(mongoProgress.trackProgress || {}).length > 0 ||
       mongoProgress.streak?.currentStreak > 0 ||
       (mongoProgress.journal || []).length > 0);

    // If MongoDB already has data, use it
    if (hasMongoData) {
      localStorage.setItem(MIGRATION_DONE_KEY, "true");
      return mongoProgress;
    }

    // Migrate from localStorage
    const globalProgress = localStorage.getItem(LEGACY_GLOBAL_PROGRESS_KEY);
    const legacyProgress = localStorage.getItem(LEGACY_LEGACY_PROGRESS_KEY);
    const streakData = localStorage.getItem(LEGACY_STREAK_KEY);
    const journalData = localStorage.getItem(LEGACY_JOURNAL_KEY);

    // Migrate track progress
    if (globalProgress) {
      const parsed = JSON.parse(globalProgress);
      for (const [trackId, progress] of Object.entries(parsed)) {
        if (trackId && typeof progress === 'object') {
          await updateTrackProgress(trackId, progress as TrackProgress);
        }
      }
    }

    // Migrate streak
    if (streakData) {
      const parsed = JSON.parse(streakData);
      if (parsed.currentStreak > 0) {
        await updateStreak(false); // This will increment if different day
      }
    }

    // Migrate journal entries
    if (journalData) {
      const parsed = JSON.parse(journalData);
      for (const entry of parsed) {
        if (entry && entry.id) {
          await addJournalEntry({
            type: entry.type,
            title: entry.title,
            noteContent: entry.noteContent,
          });
        }
      }
    }

    // Mark migration as done
    localStorage.setItem(MIGRATION_DONE_KEY, "true");

    // Return migrated data
    return getLearningProgress();
  } catch (e) {
    console.error("Migration failed:", e);
    // On migration failure, return whatever we can from MongoDB
    return getLearningProgress();
  }
}
