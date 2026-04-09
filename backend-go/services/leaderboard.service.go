package services

import (
	"context"
	"fmt"
	"sort"
	"strings"
	"time"

	"codingplatform/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type leaderboardSubmission struct {
	UserID      string    `bson:"user_id"`
	ChallengeID int       `bson:"challenge_id"`
	Status      string    `bson:"status"`
	Score       int       `bson:"score"`
	CreatedAt   time.Time `bson:"created_at"`
}

type LeaderboardEntry struct {
	Rank           int       `json:"rank"`
	UserID         string    `json:"userId"`
	Username       string    `json:"username"`
	ProfilePic     string    `json:"profilePic"`
	Country        string    `json:"country"`
	TotalPoints    int       `json:"totalPoints"`
	TotalSolved    int       `json:"totalSolved"`
	CurrentStreak  int       `json:"currentStreak"`
	EasySolved     int       `json:"easySolved"`
	MediumSolved   int       `json:"mediumSolved"`
	HardSolved     int       `json:"hardSolved"`
	LastAcceptedAt time.Time `json:"lastAcceptedAt"`
	Bio            string    `json:"bio,omitempty"`
	GithubUrl      string    `json:"githubUrl,omitempty"`
	LinkedinUrl    string    `json:"linkedinUrl,omitempty"`
	PublicProfile  bool      `json:"publicProfile,omitempty"`
	UserRank       string    `json:"userRank,omitempty"`
}

func getPointsForDifficulty(difficulty string) int {
	switch strings.ToLower(strings.TrimSpace(difficulty)) {
	case "easy":
		return 10
	case "medium":
		return 25
	case "hard":
		return 50
	default:
		return 0
	}
}

func isPassingLeaderboardSubmission(sub leaderboardSubmission) bool {
	normalized := strings.ToLower(strings.TrimSpace(sub.Status))

	if normalized == "accepted" || normalized == "passed" {
		return true
	}

	if normalized == "partial" && sub.Score >= 50 {
		return true
	}

	return sub.Score >= 50
}

func BuildLeaderboard(
	ctx context.Context,
	usersCollection *mongo.Collection,
	submissionsCollection *mongo.Collection,
	challengesCollection *mongo.Collection,
) ([]LeaderboardEntry, error) {
	var users []models.User
	userCursor, err := usersCollection.Find(ctx, bson.M{})
	if err != nil {
		fmt.Printf(">>> ERROR: Failed to find users: %v\n", err)
		return nil, err
	}
	defer userCursor.Close(ctx)

	for userCursor.Next(ctx) {
		var user models.User
		if err := userCursor.Decode(&user); err != nil {
			fmt.Printf(">>> WARNING: Skipping corrupted user record: %v\n", err)
			continue
		}
		users = append(users, user)
	}

	userMap := make(map[string]models.User)
	for _, user := range users {
		userMap[user.ID.Hex()] = user
	}

	var submissions []leaderboardSubmission
	submissionCursor, err := submissionsCollection.Find(ctx, bson.M{})
	if err != nil {
		fmt.Printf(">>> ERROR: Failed to find submissions: %v\n", err)
		return nil, err
	}
	defer submissionCursor.Close(ctx)

	for submissionCursor.Next(ctx) {
		var submission leaderboardSubmission
		if err := submissionCursor.Decode(&submission); err != nil {
			fmt.Printf(">>> WARNING: Skipping corrupted submission record: %v\n", err)
			continue
		}
		submissions = append(submissions, submission)
	}

	var challenges []models.Challenge
	challengeCursor, err := challengesCollection.Find(ctx, bson.M{})
	if err != nil {
		fmt.Printf(">>> ERROR: Failed to find challenges: %v\n", err)
		return nil, err
	}
	defer challengeCursor.Close(ctx)

	for challengeCursor.Next(ctx) {
		var challenge models.Challenge
		if err := challengeCursor.Decode(&challenge); err != nil {
			fmt.Printf(">>> WARNING: Skipping corrupted challenge record: %v\n", err)
			continue
		}
		challenges = append(challenges, challenge)
	}

	challengeMap := make(map[int]models.Challenge)
	for _, challenge := range challenges {
		challengeMap[challenge.ID] = challenge
	}

	fmt.Printf(">>> LEADERBOARD: Starting aggregation (Users: %d, Submissions: %d, Challenges: %d)\n", len(userMap), len(submissions), len(challengeMap))

	userSolvedChallenges := make(map[string]map[int]bool)
	userPassedDays := make(map[string]map[string]bool)
	userLastPassedAt := make(map[string]time.Time)

	for _, submission := range submissions {
		userID := strings.TrimSpace(submission.UserID)
		if userID == "" {
			continue
		}

		if _, exists := userMap[userID]; !exists {
			continue
		}

		if !isPassingLeaderboardSubmission(submission) {
			continue
		}

		if _, exists := userSolvedChallenges[userID]; !exists {
			userSolvedChallenges[userID] = make(map[int]bool)
		}

		userSolvedChallenges[userID][submission.ChallengeID] = true

		if _, exists := userPassedDays[userID]; !exists {
			userPassedDays[userID] = make(map[string]bool)
		}

		dayKey := submission.CreatedAt.UTC().Format("2006-01-02")
		userPassedDays[userID][dayKey] = true

		if submission.CreatedAt.After(userLastPassedAt[userID]) {
			userLastPassedAt[userID] = submission.CreatedAt
		}
	}

	entries := make([]LeaderboardEntry, 0)
	fmt.Printf(">>> LEADERBOARD: Processing %d unique solvers\n", len(userSolvedChallenges))

	for userID, solvedChallenges := range userSolvedChallenges {
		user := userMap[userID]

		totalPoints := 0
		totalSolved := 0
		easySolved := 0
		mediumSolved := 0
		hardSolved := 0

		for challengeID := range solvedChallenges {
			challenge, exists := challengeMap[challengeID]
			if !exists {
				continue
			}

			points := getPointsForDifficulty(challenge.Difficulty)
			totalPoints += points
			totalSolved++

			switch strings.ToLower(strings.TrimSpace(challenge.Difficulty)) {
			case "easy":
				easySolved++
			case "medium":
				mediumSolved++
			case "hard":
				hardSolved++
			}
		}

		if totalSolved == 0 {
			continue
		}

		currentStreak := calculateAcceptedStreak(userPassedDays[userID])

		entries = append(entries, LeaderboardEntry{
			UserID:         userID,
			Username:       user.Username,
			ProfilePic:     user.ProfilePic,
			Country:        user.Country,
			TotalPoints:    totalPoints,
			TotalSolved:    totalSolved,
			CurrentStreak:  currentStreak,
			EasySolved:     easySolved,
			MediumSolved:   mediumSolved,
			HardSolved:     hardSolved,
			LastAcceptedAt: userLastPassedAt[userID],
			Bio:            user.Bio,
			GithubUrl:      user.GithubUrl,
			LinkedinUrl:    user.LinkedinUrl,
			PublicProfile:  user.PublicProfile,
			UserRank:       user.Rank,
		})
	}

	fmt.Printf(">>> LEADERBOARD: Sorting %d entries\n", len(entries))

	sort.Slice(entries, func(i, j int) bool {
		if entries[i].TotalPoints != entries[j].TotalPoints {
			return entries[i].TotalPoints > entries[j].TotalPoints
		}
		if entries[i].TotalSolved != entries[j].TotalSolved {
			return entries[i].TotalSolved > entries[j].TotalSolved
		}
		if entries[i].CurrentStreak != entries[j].CurrentStreak {
			return entries[i].CurrentStreak > entries[j].CurrentStreak
		}
		if !entries[i].LastAcceptedAt.Equal(entries[j].LastAcceptedAt) {
			return entries[i].LastAcceptedAt.After(entries[j].LastAcceptedAt)
		}
		return strings.ToLower(entries[i].Username) < strings.ToLower(entries[j].Username)
	})

	for i := range entries {
		entries[i].Rank = i + 1
	}

	return entries, nil
}

func calculateAcceptedStreak(daySet map[string]bool) int {
	if len(daySet) == 0 {
		return 0
	}

	now := time.Now().UTC()
	todayKey := now.Format("2006-01-02")
	yesterdayKey := now.AddDate(0, 0, -1).Format("2006-01-02")

	var current time.Time

	if daySet[todayKey] {
		current = now
	} else if daySet[yesterdayKey] {
		current = now.AddDate(0, 0, -1)
	} else {
		return 0
	}

	streak := 0
	for {
		dayKey := current.Format("2006-01-02")
		if !daySet[dayKey] {
			break
		}
		streak++
		current = current.AddDate(0, 0, -1)
	}

	return streak
}
