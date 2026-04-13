package controllers

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"codingplatform/database"
	"codingplatform/models"
	"codingplatform/services"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

// GetReferralCode returns the user's referral code, generating one if it doesn't exist.
func GetReferralCode(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "UNAUTHORIZED"})
		return
	}

	usersCollection := database.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.User
	err := usersCollection.FindOne(ctx, bson.M{"_id": userID}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "USER_NOT_FOUND"})
		return
	}

	if user.ReferralCode != "" {
		c.JSON(http.StatusOK, gin.H{"referralCode": user.ReferralCode})
		return
	}

	newReferralCode := uuid.New().String()

	update := bson.M{
		"$set": bson.M{
			"referral_code": newReferralCode,
			"updated_at":    time.Now().UTC(),
		},
	}

	_, err = usersCollection.UpdateOne(ctx, bson.M{"_id": userID}, update)
	if err != nil {
		fmt.Printf(">>> REFERRAL_CODE_UPDATE_ERROR: user=%s, error=%v\n", userID.Hex(), err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "FAILED_TO_UPDATE_REFERRAL_CODE",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"referralCode": newReferralCode})
}

func getUserID(c *gin.Context) (primitive.ObjectID, bool) {
	userIDRaw, exists := c.Get("user_id")
	if !exists {
		return primitive.NilObjectID, false
	}

	userIDStr, ok := userIDRaw.(string)
	if !ok {
		return primitive.NilObjectID, false
	}

	objID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		return primitive.NilObjectID, false
	}

	return objID, true
}

func buildBackendBaseURL(c *gin.Context) string {
	envURL := strings.TrimSpace(os.Getenv("BACKEND_URL"))
	if envURL != "" {
		return strings.TrimRight(envURL, "/")
	}

	scheme := "http"
	if proto := strings.TrimSpace(c.GetHeader("X-Forwarded-Proto")); proto != "" {
		scheme = proto
	} else if c.Request.TLS != nil {
		scheme = "https"
	}

	host := strings.TrimSpace(c.GetHeader("X-Forwarded-Host"))
	if host == "" {
		host = strings.TrimSpace(c.Request.Host)
	}

	if host == "" {
		return "http://127.0.0.1:8080"
	}

	return fmt.Sprintf("%s://%s", scheme, host)
}

func normalizeStoredFilePath(path string) string {
	path = strings.TrimSpace(path)
	if path == "" {
		return ""
	}

	path = strings.ReplaceAll(path, "\\", "/")

	if strings.HasPrefix(path, "http://") || strings.HasPrefix(path, "https://") {
		return path
	}

	if !strings.Contains(path, "/") {
		path = "/uploads/profiles/" + path
	}

	if !strings.HasPrefix(path, "/") {
		path = "/" + path
	}

	return path
}

func resolvePublicFileURL(c *gin.Context, storedPath string) string {
	storedPath = normalizeStoredFilePath(storedPath)
	if storedPath == "" {
		return ""
	}

	if strings.HasPrefix(storedPath, "http://") || strings.HasPrefix(storedPath, "https://") {
		return storedPath
	}

	return buildBackendBaseURL(c) + storedPath
}

// GetProfile returns the current user's profile
func GetProfile(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "UNAUTHORIZED"})
		return
	}

	usersCollection := database.GetCollection("users")
	submissionsCollection := database.GetCollection("submissions")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.User
	err := usersCollection.FindOne(ctx, bson.M{"_id": userID}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "USER_NOT_FOUND"})
		return
	}

	solvedCount, currentStreak := getUserProfileStats(ctx, submissionsCollection, userID.Hex())
	resolvedProfilePic := resolvePublicFileURL(c, user.ProfilePic)

	c.JSON(http.StatusOK, gin.H{
		"id":                 user.ID.Hex(),
		"username":           user.Username,
		"email":              user.Email,
		"profile_pic":        resolvedProfilePic,
		"country":            user.Country,
		"rank":               user.Rank,
		"role":               user.Role,
		"bio":                user.Bio,
		"totalSolved":        solvedCount,
		"currentStreak":      currentStreak,
		"joinDate":           user.CreatedAt,
		"githubUrl":          user.GithubUrl,
		"linkedinUrl":        user.LinkedinUrl,
		"publicProfile":      user.PublicProfile,
		"emailNotifications": user.EmailNotifications,
		"challengeReminders": user.ChallengeReminders,
		"theme":              user.Theme,
	})
}

// UpdateProfile updates the current user's profile
func UpdateProfile(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "UNAUTHORIZED"})
		return
	}

	var input struct {
		Username           *string `json:"username"`
		Bio                *string `json:"bio"`
		Rank               *string `json:"rank"`
		ProfilePic         *string `json:"profile_pic"`
		Country            *string `json:"country"`
		GithubUrl          *string `json:"githubUrl"`
		LinkedinUrl        *string `json:"linkedinUrl"`
		EmailNotifications *bool   `json:"emailNotifications"`
		ChallengeReminders *bool   `json:"challengeReminders"`
		PublicProfile      *bool   `json:"publicProfile"`
		Theme              *string `json:"theme"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_PAYLOAD"})
		return
	}

	updateData := bson.M{"updated_at": time.Now().UTC()}

	if input.Username != nil {
		updateData["username"] = strings.TrimSpace(*input.Username)
	}
	if input.Bio != nil {
		updateData["bio"] = strings.TrimSpace(*input.Bio)
	}
	if input.Rank != nil {
		updateData["rank"] = strings.TrimSpace(*input.Rank)
	}
	if input.Country != nil {
		updateData["country"] = strings.TrimSpace(*input.Country)
	}
	if input.GithubUrl != nil {
		updateData["github_url"] = strings.TrimSpace(*input.GithubUrl)
	}
	if input.LinkedinUrl != nil {
		updateData["linkedin_url"] = strings.TrimSpace(*input.LinkedinUrl)
	}
	if input.EmailNotifications != nil {
		updateData["email_notifications"] = *input.EmailNotifications
	}
	if input.ChallengeReminders != nil {
		updateData["challenge_reminders"] = *input.ChallengeReminders
	}
	if input.PublicProfile != nil {
		updateData["public_profile"] = *input.PublicProfile
	}
	if input.Theme != nil {
		theme := strings.TrimSpace(*input.Theme)
		if theme == "light" || theme == "dark" {
			updateData["theme"] = theme
		}
	}
	if input.ProfilePic != nil {
		updateData["profile_pic"] = normalizeStoredFilePath(*input.ProfilePic)
	}

	usersCollection := database.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := usersCollection.UpdateOne(ctx, bson.M{"_id": userID}, bson.M{"$set": updateData})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "PROFILE_UPDATE_FAILED"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "PROFILE_UPDATED"})
}

// ChangePassword handles password change for the current user
func ChangePassword(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "UNAUTHORIZED"})
		return
	}

	var input struct {
		CurrentPassword string `json:"currentPassword" binding:"required"`
		NewPassword     string `json:"newPassword" binding:"required,min=6"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_PAYLOAD"})
		return
	}

	usersCollection := database.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.User
	err := usersCollection.FindOne(ctx, bson.M{"_id": userID}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "USER_NOT_FOUND"})
		return
	}

	if !isPasswordValid(user.Password, input.CurrentPassword) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "INVALID_CURRENT_PASSWORD"})
		return
	}

	newHash, _ := bcrypt.GenerateFromPassword([]byte(input.NewPassword), bcrypt.DefaultCost)
	_, err = usersCollection.UpdateOne(ctx, bson.M{"_id": userID}, bson.M{
		"$set": bson.M{
			"password":   string(newHash),
			"updated_at": time.Now().UTC(),
		},
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "PASSWORD_CHANGE_FAILED"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "PASSWORD_CHANGED"})
}

// DeleteAccount deletes the current user's own account
func DeleteAccount(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "UNAUTHORIZED"})
		return
	}

	usersCollection := database.GetCollection("users")
	submissionsCollection := database.GetCollection("submissions")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Delete user's submissions first
	_, err := submissionsCollection.DeleteMany(ctx, bson.M{"user_id": userID.Hex()})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DELETE_FAILED"})
		return
	}

	// Delete user account
	_, err = usersCollection.DeleteOne(ctx, bson.M{"_id": userID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DELETE_FAILED"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ACCOUNT_DELETED"})
}

// UploadAvatar handles avatar upload
func UploadAvatar(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "UNAUTHORIZED"})
		return
	}

	file, err := c.FormFile("avatar")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "FILE_REQUIRED"})
		return
	}

	ext := strings.ToLower(filepath.Ext(file.Filename))
	if ext != ".jpg" && ext != ".jpeg" && ext != ".png" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_FILE_TYPE"})
		return
	}

	if file.Size > 2*1024*1024 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "FILE_TOO_LARGE"})
		return
	}

	uploadDir := "uploads/profiles"
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UPLOAD_DIR_CREATE_FAILED"})
		return
	}

	filename := userID.Hex() + "_" + time.Now().Format("20060102150405") + ext
	filePath := filepath.Join(uploadDir, filename)

	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UPLOAD_FAILED"})
		return
	}

	dbPath := normalizeStoredFilePath(filePath)
	publicURL := resolvePublicFileURL(c, dbPath)

	usersCollection := database.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err = usersCollection.UpdateOne(ctx, bson.M{"_id": userID}, bson.M{
		"$set": bson.M{
			"profile_pic": dbPath,
			"updated_at":  time.Now().UTC(),
		},
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB_UPDATE_FAILED"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":     "AVATAR_UPDATED",
		"profile_pic": publicURL,
	})
}

// DeleteAvatar removes the user's profile picture
func DeleteAvatar(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "UNAUTHORIZED"})
		return
	}

	usersCollection := database.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// First get the current user to find the old profile pic path
	var user models.User
	err := usersCollection.FindOne(ctx, bson.M{"_id": userID}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "USER_NOT_FOUND"})
		return
	}

	// If user has a profile picture, try to delete the old file
	if user.ProfilePic != "" {
		// Try to delete the old file if it exists in uploads
		normalizedPath := normalizeStoredFilePath(user.ProfilePic)
		if strings.HasPrefix(normalizedPath, "/uploads/") {
			filePath := strings.TrimPrefix(normalizedPath, "/")
			if _, err := os.Stat(filePath); err == nil {
				os.Remove(filePath)
			}
		}
	}

	// Clear the profile_pic in the database
	_, err = usersCollection.UpdateOne(ctx, bson.M{"_id": userID}, bson.M{
		"$set": bson.M{
			"profile_pic": "",
			"updated_at":  time.Now().UTC(),
		},
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "AVATAR_DELETE_FAILED"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "AVATAR_DELETED"})
}

// GetDashboardStats returns stats for the dashboard
func GetDashboardStats(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	userIDValue, _ := c.Get("user_id")
	userID, _ := userIDValue.(string)

	usersCollection := database.GetCollection("users")
	challengesCollection := database.GetCollection("challenges")
	submissionsCollection := database.GetCollection("submissions")

	objID, _ := primitive.ObjectIDFromHex(userID)
	var user models.User
	_ = usersCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&user)

	var submissions []models.SubmissionRecord
	cursor, err := submissionsCollection.Find(ctx, bson.M{"user_id": userID})
	if err == nil {
		defer cursor.Close(ctx)
		_ = cursor.All(ctx, &submissions)
	}

	var allChallenges []models.Challenge
	challengeCursor, err := challengesCollection.Find(ctx, bson.M{})
	if err == nil {
		defer challengeCursor.Close(ctx)
		_ = challengeCursor.All(ctx, &allChallenges)
	}

	challengeMap := make(map[int]models.Challenge)
	for _, ch := range allChallenges {
		challengeMap[ch.ID] = ch
	}

	easyTotal, easySolved := 0, 0
	mediumTotal, mediumSolved := 0, 0
	hardTotal, hardSolved := 0, 0

	for _, ch := range allChallenges {
		switch strings.ToLower(ch.Difficulty) {
		case "easy":
			easyTotal++
		case "medium":
			mediumTotal++
		case "hard":
			hardTotal++
		}
	}

	solvedMap := make(map[int]bool)
	passedSubmissionCount := 0
	perfectSubmissionCount := 0

	for _, sub := range submissions {
		if isPassingSubmission(sub) {
			solvedMap[sub.ChallengeID] = true
			passedSubmissionCount++
		}
		if isPerfectSubmission(sub) {
			perfectSubmissionCount++
		}
	}

	for id := range solvedMap {
		if ch, ok := challengeMap[id]; ok {
			switch strings.ToLower(ch.Difficulty) {
			case "easy":
				easySolved++
			case "medium":
				mediumSolved++
			case "hard":
				hardSolved++
			}
		}
	}

	recentSubmissions := []gin.H{}
	sort.Slice(submissions, func(i, j int) bool {
		return submissions[i].CreatedAt.After(submissions[j].CreatedAt)
	})

	limit := 5
	if len(submissions) < limit {
		limit = len(submissions)
	}

	for i := 0; i < limit; i++ {
		sub := submissions[i]
		title := fmt.Sprintf("Challenge #%d", sub.ChallengeID)
		if ch, ok := challengeMap[sub.ChallengeID]; ok {
			title = ch.Title
		}

		recentSubmissions = append(recentSubmissions, gin.H{
			"id":     sub.ChallengeID,
			"title":  title,
			"status": displaySubmissionStatus(sub),
			"score":  sub.Score,
			"date":   humanizeTime(sub.CreatedAt),
		})
	}

	totalPoints := 0
	rank := 0
	leaderboard, err := services.BuildLeaderboard(ctx, usersCollection, submissionsCollection, challengesCollection)
	if err == nil {
		for i, entry := range leaderboard {
			if entry.UserID == userID {
				totalPoints = entry.TotalPoints
				rank = i + 1
				break
			}
		}
	}

	passRate := 0.0
	if len(submissions) > 0 {
		passRate = (float64(passedSubmissionCount) / float64(len(submissions))) * 100
	}

	duelsCollection := database.GetCollection("duels")

	totalDuels := 0
	victories := 0

	duelCursor, err := duelsCollection.Find(ctx, bson.M{
		"status": models.DuelCompleted,
		"$or": []bson.M{
			{"challenger_id": userID},
			{"opponent_id": userID},
		},
	})
	if err == nil {
		defer duelCursor.Close(ctx)
		var completedDuels []models.Duel
		_ = duelCursor.All(ctx, &completedDuels)
		totalDuels = len(completedDuels)
		for _, duel := range completedDuels {
			if duel.WinnerID == userID {
				victories++
			}
		}
	}

	winRate := 0.0
	if totalDuels > 0 {
		winRate = (float64(victories) / float64(totalDuels)) * 100
	}

	c.JSON(http.StatusOK, gin.H{
		"totalSolved":       len(solvedMap),
		"currentStreak":     calculateCurrentStreak(submissions),
		"challengesWon":     passedSubmissionCount,
		"perfectChallenges": perfectSubmissionCount,
		"challengesPlayed":  len(submissions),
		"passRate":          passRate,
		"rank":              rank,
		"totalPoints":       totalPoints,
		"easySolved":        easySolved,
		"mediumSolved":      mediumSolved,
		"hardSolved":        hardSolved,
		"totalEasy":         easyTotal,
		"totalMedium":       mediumTotal,
		"totalHard":         hardTotal,
		"recentSubmissions": recentSubmissions,
		"victories":         victories,
		"winRate":           winRate,
	})
}

// GetAnalytics returns detailed analytics for the user
func GetAnalytics(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	userIDValue, _ := c.Get("user_id")
	userID, _ := userIDValue.(string)

	usersCollection := database.GetCollection("users")
	challengesCollection := database.GetCollection("challenges")
	submissionsCollection := database.GetCollection("submissions")

	objID, _ := primitive.ObjectIDFromHex(userID)
	var user models.User
	_ = usersCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&user)

	var submissions []models.SubmissionRecord
	cursor, err := submissionsCollection.Find(ctx, bson.M{"user_id": userID})
	if err == nil {
		defer cursor.Close(ctx)
		_ = cursor.All(ctx, &submissions)
	}

	var allChallenges []models.Challenge
	challengeCursor, err := challengesCollection.Find(ctx, bson.M{})
	if err == nil {
		defer challengeCursor.Close(ctx)
		_ = challengeCursor.All(ctx, &allChallenges)
	}

	challengeMap := make(map[int]models.Challenge)
	for _, ch := range allChallenges {
		challengeMap[ch.ID] = ch
	}

	easyTotal, easySolved := 0, 0
	mediumTotal, mediumSolved := 0, 0
	hardTotal, hardSolved := 0, 0

	for _, ch := range allChallenges {
		switch strings.ToLower(ch.Difficulty) {
		case "easy":
			easyTotal++
		case "medium":
			mediumTotal++
		case "hard":
			hardTotal++
		}
	}

	solvedMap := make(map[int]bool)
	passedCount := 0
	perfectCount := 0
	totalScore := 0

	for _, sub := range submissions {
		totalScore += sub.Score

		if isPassingSubmission(sub) {
			solvedMap[sub.ChallengeID] = true
			passedCount++
		}

		if isPerfectSubmission(sub) {
			perfectCount++
		}
	}

	for id := range solvedMap {
		if ch, ok := challengeMap[id]; ok {
			switch strings.ToLower(ch.Difficulty) {
			case "easy":
				easySolved++
			case "medium":
				mediumSolved++
			case "hard":
				hardSolved++
			}
		}
	}

	weeklyProgress := []gin.H{}
	now := time.Now()
	for i := 6; i >= 0; i-- {
		day := now.AddDate(0, 0, -i).UTC()
		dayKey := day.Format("2006-01-02")
		count := 0
		for _, sub := range submissions {
			if sub.CreatedAt.UTC().Format("2006-01-02") == dayKey {
				count++
			}
		}
		weeklyProgress = append(weeklyProgress, gin.H{
			"day":   day.Format("Mon"),
			"value": count,
		})
	}

	categoryMap := make(map[string]struct {
		solved int
		total  int
	})
	for _, ch := range allChallenges {
		cat := ch.Category
		if cat == "" {
			cat = "General"
		}
		entry := categoryMap[cat]
		entry.total++
		if solvedMap[ch.ID] {
			entry.solved++
		}
		categoryMap[cat] = entry
	}

	categoryPerformance := []gin.H{}
	for cat, stats := range categoryMap {
		performance := 0
		if stats.total > 0 {
			performance = (stats.solved * 100) / stats.total
		}
		categoryPerformance = append(categoryPerformance, gin.H{
			"label": cat,
			"value": performance,
		})
	}
	sort.Slice(categoryPerformance, func(i, j int) bool {
		return categoryPerformance[i]["label"].(string) < categoryPerformance[j]["label"].(string)
	})

	recentActivity := []gin.H{}
	sort.Slice(submissions, func(i, j int) bool {
		return submissions[i].CreatedAt.After(submissions[j].CreatedAt)
	})

	limit := 10
	if len(submissions) < limit {
		limit = len(submissions)
	}

	for i := 0; i < limit; i++ {
		sub := submissions[i]
		title := fmt.Sprintf("Challenge #%d", sub.ChallengeID)
		category := "General"
		difficulty := "Medium"

		if ch, ok := challengeMap[sub.ChallengeID]; ok {
			title = ch.Title
			category = ch.Category
			difficulty = strings.Title(strings.ToLower(ch.Difficulty))
		}

		recentActivity = append(recentActivity, gin.H{
			"title":      title,
			"category":   category,
			"difficulty": difficulty,
			"status":     displaySubmissionStatus(sub),
			"score":      sub.Score,
			"date":       humanizeTime(sub.CreatedAt),
		})
	}

	rank := 0
	totalPoints := 0
	leaderboard, err := services.BuildLeaderboard(ctx, usersCollection, submissionsCollection, challengesCollection)
	if err == nil {
		for i, entry := range leaderboard {
			if entry.UserID == userID {
				rank = i + 1
				totalPoints = entry.TotalPoints
				break
			}
		}
	}

	passRate := 0.0
	if len(submissions) > 0 {
		passRate = (float64(passedCount) / float64(len(submissions))) * 100
	}

	acceptanceRate := 0.0
	if len(submissions) > 0 {
		acceptanceRate = (float64(perfectCount) / float64(len(submissions))) * 100
	}

	averageScore := 0
	if len(submissions) > 0 {
		averageScore = totalScore / len(submissions)
	}

	c.JSON(http.StatusOK, gin.H{
		"weeklyProgress": weeklyProgress,
		"difficultyBreakdown": []gin.H{
			{"label": "Easy", "solved": easySolved, "total": easyTotal},
			{"label": "Medium", "solved": mediumSolved, "total": mediumTotal},
			{"label": "Hard", "solved": hardSolved, "total": hardTotal},
		},
		"categoryPerformance": categoryPerformance,
		"recentActivity":      recentActivity,
		"stats": gin.H{
			"totalPoints":    totalPoints,
			"acceptanceRate": acceptanceRate,
			"passRate":       passRate,
			"currentStreak":  calculateCurrentStreak(submissions),
			"totalSolved":    len(solvedMap),
			"totalAttempts":  len(submissions),
			"averageScore":   averageScore,
			"rank":           rank,
			"passedCount":    passedCount,
			"perfectCount":   perfectCount,
		},
	})
}

// ResetStats resets the current user's stats by deleting their submissions
func ResetStats(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	userIDValue, _ := c.Get("user_id")
	userID, _ := userIDValue.(string)

	submissionsCollection := database.GetCollection("submissions")
	_, err := submissionsCollection.DeleteMany(ctx, bson.M{"user_id": userID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "RESET_STATS_FAILED"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "STATS_RESET_SUCCESSFUL"})
}

func isPerfectSubmission(submission models.SubmissionRecord) bool {
	normalized := strings.ToLower(strings.TrimSpace(submission.Status))
	return normalized == "accepted" || submission.Score == 100
}

func isPassingSubmission(submission models.SubmissionRecord) bool {
	normalized := strings.ToLower(strings.TrimSpace(submission.Status))

	if normalized == "accepted" || normalized == "passed" {
		return true
	}

	if normalized == "partial" && submission.Score >= 50 {
		return true
	}

	return submission.Score >= 50
}

func displaySubmissionStatus(submission models.SubmissionRecord) string {
	if isPerfectSubmission(submission) {
		return "Accepted"
	}

	if isPassingSubmission(submission) {
		return "Passed"
	}

	switch strings.ToLower(strings.TrimSpace(submission.Status)) {
	case "runtime_error":
		return "Runtime Error"
	case "compilation_error":
		return "Compilation Error"
	case "internal_error":
		return "Internal Error"
	case "pending":
		return "Pending"
	default:
		return "Failed"
	}
}

// Stats helpers
func getUserProfileStats(ctx context.Context, submissionsCollection *mongo.Collection, userID string) (int, int) {
	var submissions []models.SubmissionRecord

	cursor, err := submissionsCollection.Find(ctx, bson.M{"user_id": userID})
	if err != nil {
		return 0, 0
	}
	defer cursor.Close(ctx)

	if err := cursor.All(ctx, &submissions); err != nil {
		return 0, 0
	}

	passedSet := map[int]bool{}
	for _, submission := range submissions {
		if isPassingSubmission(submission) {
			passedSet[submission.ChallengeID] = true
		}
	}

	currentStreak := calculateCurrentStreak(submissions)

	return len(passedSet), currentStreak
}

func calculateCurrentStreak(submissions []models.SubmissionRecord) int {
	if len(submissions) == 0 {
		return 0
	}

	daySet := map[string]bool{}
	for _, submission := range submissions {
		if !isPassingSubmission(submission) {
			continue
		}
		dayKey := submission.CreatedAt.UTC().Format("2006-01-02")
		daySet[dayKey] = true
	}

	streak := 0
	current := time.Now().UTC()

	for {
		dayKey := current.UTC().Format("2006-01-02")
		if !daySet[dayKey] {
			break
		}
		streak++
		current = current.AddDate(0, 0, -1)
	}

	return streak
}

func humanizeTime(t time.Time) string {
	now := time.Now()
	diff := now.Sub(t)

	if diff < time.Minute {
		return "Just now"
	}
	if diff < time.Hour {
		return fmt.Sprintf("%dm ago", int(diff.Minutes()))
	}
	if diff < 24*time.Hour {
		return fmt.Sprintf("%dh ago", int(diff.Hours()))
	}
	if diff < 7*24*time.Hour {
		return fmt.Sprintf("%dd ago", int(diff.Hours()/24))
	}

	return t.Format("2006-01-02")
}
