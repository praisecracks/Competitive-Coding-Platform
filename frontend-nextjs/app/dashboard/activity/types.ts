export type ActivityType = "submission" | "duel" | "learning" | "achievement" | "profile" | "rank" | "badge" | "login";
export type ActivityStatus = "accepted" | "failed" | "pending" | "won" | "lost" | "completed" | "unlocked" | string;

export interface ActivityItem {
  id?: string;
  type: ActivityType;
  title: string;
  subtitle?: string;
  description?: string;
  status?: ActivityStatus;
  score?: number;
  xpAwarded?: number;
  date?: string;
  difficulty?: string;
  category?: string;
  icon: string;
  color: string;
  bgColor: string;
  metadata?: {
    opponent?: string;
    opponentId?: string;
    language?: string;
    challengeId?: number;
    streakDays?: number;
    badgeName?: string;
    oldRank?: string;
    newRank?: string;
    device?: string;
    location?: string;
    passedTests?: number;
    totalTests?: number;
  };
  isNew?: boolean;
  isMilestone?: boolean;
}
