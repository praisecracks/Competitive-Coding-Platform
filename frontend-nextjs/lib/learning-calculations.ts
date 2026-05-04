import type { LearningTrack } from "@/app/dashboard/learning/data";
import type { TrackProgress } from "./learning-api";

export type { LearningProgress } from "./learning-api";

export interface ActivityScoreResult {
  score: number;
  isActive: boolean;
}

/**
 * Calculates an activity score for a track based on user engagement.
 * Used primarily for sorting the "Continue Learning" section.
 *
 * Scoring logic (higher = more active):
 * - Recent activity (last accessed within 30 days): up to 100 pts (decays 3.33/day)
 * - Time spent: 50 pts per hour
 * - Completed lessons: 5 pts each
 * - Progress percentage: 2 pts per percent
 * - Completed topics: 15 pts each
 */
export function calculateTrackActivityScore(
  track: LearningTrack,
  progress: TrackProgress | null | undefined
): number {
  if (!progress) return 0;

  const completedLessonIds = progress.completedLessonIds || [];
  const lessonProgressEntries = Object.entries(progress.lessonProgress || {});
  const topicTimeSpentEntries = Object.entries(progress.topicTimeSpent || {});

  const hasActivity =
    (progress.completedTopicIds?.length || 0) > 0 ||
    completedLessonIds.length > 0 ||
    lessonProgressEntries.some(([, l]) => l.completed) ||
    !!progress.lastAccessedAt ||
    !!progress.startedAt ||
    topicTimeSpentEntries.some(([, time]) => time > 0);

  if (!hasActivity) return 0;

  let score = 0;

  // Strong bonus: recent lastAccessedAt (within 30 days)
  // 100 points if accessed today, decays linearly to 0 at 30 days ago
  if (progress.lastAccessedAt) {
    const daysAgo = (Date.now() - new Date(progress.lastAccessedAt).getTime()) / (1000 * 60 * 60 * 24);
    score += Math.max(0, 100 - daysAgo * 3.33);
  }

  // Medium bonus: total time spent (hours -> points)
  const totalTimeSpent = Object.values(progress.topicTimeSpent || {}).reduce((sum, sec) => sum + sec, 0);
  const hoursSpent = totalTimeSpent / 3600;
  score += hoursSpent * 50;

  // Medium bonus: completed lessons
  const completedLessonsCount = completedLessonIds.length;
  const lessonProgressCount = lessonProgressEntries.filter(([, l]) => l.completed).length;
  score += (completedLessonsCount + lessonProgressCount) * 5;

  // Small bonus: progress percentage
  let trackTotalLessons = 0;
  let trackCompletedLessons = 0;
  track.topics.forEach((topic) => {
    const topicLessons = topic.subtopics.length;
    trackTotalLessons += topicLessons;
    let topicCompleted = 0;
    const completedTopicIds = progress.completedTopicIds || [];
    if (completedTopicIds.includes(topic.id)) {
      topicCompleted = topicLessons;
    } else {
      topic.subtopics.forEach((subtopic) => {
        if (
          progress.lessonProgress?.[subtopic.id]?.completed ||
          completedLessonIds.includes(subtopic.id)
        ) {
          topicCompleted++;
        }
      });
    }
    trackCompletedLessons += topicCompleted;
  });
  const progressPercent = trackTotalLessons > 0 ? (trackCompletedLessons / trackTotalLessons) * 100 : 0;
  score += progressPercent * 2;

  // Small bonus: completed topics
  score += (progress.completedTopicIds?.length || 0) * 15;

  return score;
}

/**
 * Determines if a track has any meaningful activity.
 */
export function hasTrackActivity(
  progress: TrackProgress | null | undefined
): boolean {
  if (!progress) return false;

  const completedLessonIds = progress.completedLessonIds || [];
  const lessonProgressEntries = Object.entries(progress.lessonProgress || {});
  const topicTimeSpentEntries = Object.entries(progress.topicTimeSpent || {});

  return (
    (progress.completedTopicIds?.length || 0) > 0 ||
    completedLessonIds.length > 0 ||
    lessonProgressEntries.some(([, l]) => l.completed) ||
    !!progress.lastAccessedAt ||
    !!progress.startedAt ||
    topicTimeSpentEntries.some(([, time]) => time > 0)
  );
}

/**
 * Sorts tracks by activity score descending, with most active first.
 * Tracks with equal scores are sorted by last accessed date (most recent first).
 * Untouched tracks (score 0) appear at the end, preserving original order.
 */
export function sortTracksByActivity(
  tracks: LearningTrack[],
  trackProgressMap: Record<string, TrackProgress>
): LearningTrack[] {
  return [...tracks].sort((a, b) => {
    const scoreA = calculateTrackActivityScore(a, trackProgressMap[a.id]);
    const scoreB = calculateTrackActivityScore(b, trackProgressMap[b.id]);

    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }

    // Tie-breaker: sort by last accessed time (most recent first)
    const timeA = trackProgressMap[a.id]?.lastAccessedAt || "";
    const timeB = trackProgressMap[b.id]?.lastAccessedAt || "";
    return new Date(timeB).getTime() - new Date(timeA).getTime();
  });
}

/**
 * Categorizes tracks into active (has activity) and untouched.
 * Preserves original order within each category.
 */
export function categorizeTracksByActivity(
  tracks: LearningTrack[],
  trackProgressMap: Record<string, TrackProgress>
): { active: LearningTrack[]; untouched: LearningTrack[] } {
  const active: LearningTrack[] = [];
  const untouched: LearningTrack[] = [];

  tracks.forEach((track) => {
    const progress = trackProgressMap[track.id];
    if (hasTrackActivity(progress)) {
      active.push(track);
    } else {
      untouched.push(track);
    }
  });

  return { active, untouched };
}
