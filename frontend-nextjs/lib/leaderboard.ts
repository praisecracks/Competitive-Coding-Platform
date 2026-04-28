// Leaderboard service functions
export async function getLeaderboard() {
  // Mock leaderboard data for development
  // In production, this would fetch from the backend API
  return [
    {
      rank: 1,
      userId: "user1",
      username: "champion coder",
      profilePic: "/uploads/avatars/user1.jpg",
      country: "US",
      totalPoints: 9850,
      totalSolved: 45,
      currentStreak: 14,
      easySolved: 15,
      mediumSolved: 20,
      hardSolved: 10,
      lastAcceptedAt: "2026-04-22T15:30:00Z",
      bio: "Master coder",
      publicProfile: true
    },
    {
      rank: 2,
      userId: "user2",
      username: "_queen",
      profilePic: "/uploads/avatars/user2.jpg",
      country: "UK",
      totalPoints: 200,
      totalSolved: 24,
      currentStreak: 6,
      easySolved: 10,
      mediumSolved: 12,
      hardSolved: 2,
      lastAcceptedAt: "2026-04-22T14:45:00Z",
      bio: "DSA enthusiast",
      publicProfile: true
    },
    {
      rank: 3,
      userId: "user3",
      username: "debug_master",
      profilePic: "/uploads/avatars/user3.jpg",
      country: "IN",
      totalPoints: 8750,
      totalSolved: 38,
      currentStreak: 10,
      easySolved: 12,
      mediumSolved: 20,
      hardSolved: 6,
      lastAcceptedAt: "2026-04-22T13:20:00Z",
      bio: "Problem solver",
      publicProfile: true
    }
  ];
}