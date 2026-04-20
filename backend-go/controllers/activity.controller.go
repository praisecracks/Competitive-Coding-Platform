package controllers

import (
	"context"
	"fmt"
	"net/http"
	"sort"
	"strings"
	"time"

	"codingplatform/database"
	"codingplatform/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// GetActivityFeed returns a unified chronological feed of user activities
func GetActivityFeed(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 15*time.Second)
	defer cancel()

	userIDValue, _ := c.Get("user_id")
	userID, _ := userIDValue.(string)

	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var activities []models.Activity

	// 1. Fetch recent submissions
	fetchSubmissions(ctx, userID, &activities)

	// 2. Fetch completed duels
	fetchDuels(ctx, userID, &activities)

	// 3. Fetch learning milestones (journal entries, streak milestones, track completions)
	fetchLearningProgress(ctx, userID, &activities)

	// 4. Fetch achievements and badges
	fetchAchievements(ctx, userID, &activities)

	// 5. Fetch profile updates
	fetchProfileUpdates(ctx, userID, &activities)

	// 6. Sort by date descending and limit
	sort.Slice(activities, func(i, j int) bool {
		return activities[i].Date.After(activities[j].Date)
	})

	maxActivities := 100
	if len(activities) > maxActivities {
		activities = activities[:maxActivities]
	}

	c.JSON(http.StatusOK, gin.H{
		"activities": activities,
		"count":      len(activities),
	})
}

// fetchSubmissions adds submission activities
func fetchSubmissions(ctx context.Context, userID string, activities *[]models.Activity) {
	submissionsCollection := database.GetCollection("submissions")
	var submissions []models.SubmissionRecord
	cursor, err := submissionsCollection.Find(ctx, bson.M{"user_id": userID})
	if err != nil {
		return
	}
	defer cursor.Close(ctx)
	_ = cursor.All(ctx, &submissions)

	challengesCollection := database.GetCollection("challenges")
	var challenges []models.Challenge
	chCursor, _ := challengesCollection.Find(ctx, bson.M{})
	if chCursor != nil {
		defer chCursor.Close(ctx)
		_ = chCursor.All(ctx, &challenges)
	}
	challengeMap := make(map[int]models.Challenge)
	for _, ch := range challenges {
		challengeMap[ch.ID] = ch
	}

	for idx, sub := range submissions {
		title := fmt.Sprintf("Challenge #%d", sub.ChallengeID)
		var difficulty, category string
		if ch, ok := challengeMap[sub.ChallengeID]; ok {
			title = ch.Title
			difficulty = ch.Difficulty
			category = ch.Category
		}
		status := canonicalSubmissionStatus(sub.Status)
		actStatus := activityStatusFromSubmission(status)
		actIcon := iconFromSubmissionStatus(status)
		actColor := colorFromSubmissionStatus(status)
		actBGColor := bgColorFromSubmissionStatus(status)

		*activities = append(*activities, models.Activity{
			ID:         fmt.Sprintf("sub_%d", idx),
			Type:       models.ActivitySubmission,
			Title:      title,
			Subtitle:   fmt.Sprintf("Scored %d%%", sub.Score),
			Status:     actStatus,
			Score:      sub.Score,
			Icon:       actIcon,
			Color:      actColor,
			BGColor:    actBGColor,
			Date:       sub.CreatedAt,
			CreatedAt:  sub.CreatedAt,
			Difficulty: difficulty,
			Category:   category,
			Metadata: map[string]interface{}{
				"language":    sub.Language,
				"challengeId": sub.ChallengeID,
				"passedTests": sub.PassedTests,
				"totalTests":  sub.TotalTests,
			},
		})
	}
}

// fetchDuels adds duel activities
func fetchDuels(ctx context.Context, userID string, activities *[]models.Activity) {
	duelsCollection := database.GetCollection("duels")
	var duels []models.Duel
	duelCursor, err := duelsCollection.Find(ctx, bson.M{
		"status": models.DuelCompleted,
		"$or": []bson.M{
			{"challenger_id": userID},
			{"opponent_id": userID},
		},
	})
	if err != nil {
		return
	}
	defer duelCursor.Close(ctx)
	_ = duelCursor.All(ctx, &duels)

	usersCollection := database.GetCollection("users")
	var users []models.User
	userCursor, _ := usersCollection.Find(ctx, bson.M{})
	if userCursor != nil {
		defer userCursor.Close(ctx)
		_ = userCursor.All(ctx, &users)
	}
	userMap := make(map[string]models.User)
	for _, u := range users {
		userMap[u.ID.Hex()] = u
	}

	for _, duel := range duels {
		opponentID := duel.Opponent
		if opponentID == userID {
			opponentID = duel.Challenger
		}
		opponent := userMap[opponentID]
		opponentName := "Unknown"
		if opponent.Username != "" {
			opponentName = opponent.Username
		}

		myScore := duel.OpponentScore
		opponentScore := duel.ChallengerScore
		if duel.Challenger == userID {
			myScore = duel.ChallengerScore
			opponentScore = duel.OpponentScore
		}

		var status models.ActivityStatus = models.StatusLost
		var color string = "text-red-500"
		var bgColor string = "bg-red-500/20"
		if duel.WinnerID == userID {
			status = models.StatusWon
			color = "text-emerald-500"
			bgColor = "bg-emerald-500/20"
		}

		completedAt := time.Now()
		if duel.CompletedAt != nil {
			completedAt = *duel.CompletedAt
		}

		*activities = append(*activities, models.Activity{
			ID:        fmt.Sprintf("duel_%s", duel.ID),
			Type:      models.ActivityDuel,
			Title:     fmt.Sprintf("Duel vs %s", opponentName),
			Subtitle:  fmt.Sprintf("%d - %d", myScore, opponentScore),
			Status:    status,
			Score:     myScore,
			Icon:      "Swords",
			Color:     color,
			BGColor:   bgColor,
			Date:      completedAt,
			CreatedAt: completedAt,
			Metadata: map[string]interface{}{
				"opponent":    opponentName,
				"opponentId":  opponentID,
				"challengeId": duel.ChallengeID,
			},
		})
	}
}

// fetchLearningProgress adds learning activities (journal, streak milestones, track completions)
func fetchLearningProgress(ctx context.Context, userID string, activities *[]models.Activity) {
	userObjID, _ := primitive.ObjectIDFromHex(userID)
	learningProgressCollection := database.GetCollection("learning_progress")
	var learningProgress []models.LearningProgress
	lpCursor, err := learningProgressCollection.Find(ctx, bson.M{"user_id": userObjID})
	if err != nil {
		return
	}
	defer lpCursor.Close(ctx)
	_ = lpCursor.All(ctx, &learningProgress)

	if len(learningProgress) == 0 {
		return
	}

	lp := learningProgress[0]

	// 7-day streak milestone
	if lp.Streak.CurrentStreak >= 7 {
		*activities = append(*activities, models.Activity{
			ID:        fmt.Sprintf("streak_%d_%d", lp.Streak.CurrentStreak, time.Now().Unix()),
			Type:      models.ActivityAchievement,
			Title:     fmt.Sprintf("%d-Day Learning Streak!", lp.Streak.CurrentStreak),
			Subtitle:  "Keep the momentum going",
			Status:    models.StatusCompleted,
			Score:     100,
			Icon:      "Flame",
			Color:     "text-amber-500",
			BGColor:   "bg-amber-500/20",
			Date:      lp.Streak.LastLearningDate,
			CreatedAt: lp.Streak.LastLearningDate,
		})
	}

	// 30-day streak milestone
	if lp.Streak.CurrentStreak >= 30 {
		*activities = append(*activities, models.Activity{
			ID:        fmt.Sprintf("streak_30_%d", time.Now().Unix()),
			Type:      models.ActivityAchievement,
			Title:     "30-Day Streak Master!",
			Subtitle:  "Unwavering dedication",
			Status:    models.StatusCompleted,
			Score:     500,
			Icon:      "Flame",
			Color:     "text-orange-500",
			BGColor:   "bg-orange-500/20",
			Date:      lp.Streak.LastLearningDate,
			CreatedAt: lp.Streak.LastLearningDate,
		})
	}

	// Journal entries (course/topic completions)
	for _, entry := range lp.Journal {
		entryType := entry.Type
		icon := "BookOpen"
		if entryType == "topic_completion" {
			icon = "FileText"
		}
		*activities = append(*activities, models.Activity{
			ID:        fmt.Sprintf("journal_%s", entry.ID),
			Type:      models.ActivityLearning,
			Title:     entry.Title,
			Subtitle:  entryType,
			Status:    models.StatusCompleted,
			Icon:      icon,
			Color:     "text-blue-500",
			BGColor:   "bg-blue-500/20",
			Date:      entry.CompletedAt,
			CreatedAt: entry.CompletedAt,
		})
	}
}

// fetchAchievements adds achievement/badge unlock activities
func fetchAchievements(ctx context.Context, userID string, activities *[]models.Activity) {
	// TODO: Integrate with real achievements system when available
	// For now, derive from existing stats

	usersCollection := database.GetCollection("users")
	var user models.User
	objID, _ := primitive.ObjectIDFromHex(userID)
	err := usersCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&user)
	if err != nil {
		return
	}

	// First win achievement
	if user.ChallengesWon >= 1 {
		*activities = append(*activities, models.Activity{
			ID:        fmt.Sprintf("achievement_first_win_%s", user.ID.Hex()),
			Type:      models.ActivityAchievement,
			Title:     "First Victory!",
			Subtitle:  "You solved your first challenge",
			Status:    models.StatusUnlocked,
			Icon:      "Trophy",
			Color:     "text-yellow-500",
			BGColor:   "bg-yellow-500/20",
			Date:      user.UpdatedAt,
			CreatedAt: user.UpdatedAt,
			Metadata: map[string]interface{}{
				"winsRequired": 1,
			},
			XPAwarded: 100,
		})
	}

	// 10 wins
	if user.ChallengesWon >= 10 {
		*activities = append(*activities, models.Activity{
			ID:        fmt.Sprintf("achievement_10wins_%s", user.ID.Hex()),
			Type:      models.ActivityAchievement,
			Title:     "Victory Streak",
			Subtitle:  "Won 10 challenges",
			Status:    models.StatusUnlocked,
			Icon:      "Trophy",
			Color:     "text-yellow-500",
			BGColor:   "bg-yellow-500/20",
			Date:      user.UpdatedAt,
			CreatedAt: user.UpdatedAt,
			Metadata: map[string]interface{}{
				"winsRequired": 10,
			},
			XPAwarded: 500,
		})
	}

	// 50 wins
	if user.ChallengesWon >= 50 {
		*activities = append(*activities, models.Activity{
			ID:        fmt.Sprintf("achievement_50wins_%s", user.ID.Hex()),
			Type:      models.ActivityAchievement,
			Title:     "Champion",
			Subtitle:  "Won 50 challenges",
			Status:    models.StatusUnlocked,
			Icon:      "Trophy",
			Color:     "text-yellow-500",
			BGColor:   "bg-yellow-500/20",
			Date:      user.UpdatedAt,
			CreatedAt: user.UpdatedAt,
			Metadata: map[string]interface{}{
				"winsRequired": 50,
			},
			XPAwarded: 1000,
		})
	}
}

// fetchProfileUpdates adds profile modification activities
func fetchProfileUpdates(ctx context.Context, userID string, activities *[]models.Activity) {
	// TODO: Create an audit log collection for profile changes
	// For now, we can detect recent profile updates by comparing CreatedAt vs UpdatedAt
	// This is a placeholder until profile_audit collection is added

	usersCollection := database.GetCollection("users")
	var user models.User
	objID, _ := primitive.ObjectIDFromHex(userID)
	err := usersCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&user)
	if err != nil {
		return
	}

	// If profile was recently updated (within last 7 days)
	if user.UpdatedAt.After(user.CreatedAt.Add(24 * time.Hour)) {
		diff := time.Since(user.UpdatedAt)
		if diff < 7*24*time.Hour {
			*activities = append(*activities, models.Activity{
				ID:        fmt.Sprintf("profile_update_%s", user.ID.Hex()),
				Type:      models.ActivityProfile,
				Title:     "Profile Updated",
				Subtitle:  "Bio, avatar, or settings changed",
				Status:    models.StatusCompleted,
				Icon:      "User",
				Color:     "text-blue-500",
				BGColor:   "bg-blue-500/20",
				Date:      user.UpdatedAt,
				CreatedAt: user.UpdatedAt,
			})
		}
	}
}

// Activity Status Helpers
func canonicalSubmissionStatus(status string) string {
	s := strings.ToLower(strings.TrimSpace(status))
	if s == "accepted" || s == "passed" || s == "correct" {
		return "accepted"
	}
	if s == "runtime_error" {
		return "runtime error"
	}
	if s == "time_limit" || s == "time_limit_exceeded" {
		return "time limit exceeded"
	}
	if s == "memory_limit" || s == "memory_limit_exceeded" {
		return "memory limit exceeded"
	}
	return s
}

func activityStatusFromSubmission(status string) models.ActivityStatus {
	switch status {
	case "accepted", "passed", "correct":
		return models.StatusAccepted
	case "failed", "runtime error", "time limit exceeded", "memory limit exceeded", "compilation error":
		return models.StatusFailed
	default:
		return models.StatusPending
	}
}

func iconFromSubmissionStatus(status string) string {
	switch status {
	case "accepted", "passed", "correct":
		return "CheckCircle2"
	case "failed", "runtime error", "time limit exceeded", "memory limit exceeded", "compilation error":
		return "XCircle"
	default:
		return "AlertCircle"
	}
}

func colorFromSubmissionStatus(status string) string {
	switch status {
	case "accepted", "passed", "correct":
		return "text-emerald-500"
	case "failed", "runtime error", "time limit exceeded", "memory limit exceeded", "compilation error":
		return "text-red-500"
	default:
		return "text-amber-500"
	}
}

func bgColorFromSubmissionStatus(status string) string {
	switch status {
	case "accepted", "passed", "correct":
		return "bg-emerald-500/20"
	case "failed", "runtime error", "time limit exceeded", "memory limit exceeded", "compilation error":
		return "bg-red-500/20"
	default:
		return "bg-amber-500/20"
	}
}
