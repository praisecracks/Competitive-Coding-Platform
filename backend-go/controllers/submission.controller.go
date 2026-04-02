package controllers

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"codingplatform/database"
	"codingplatform/models"
	"codingplatform/services"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type SubmitRequest struct {
	ChallengeID int                   `json:"challenge_id"`
	Language    string                `json:"language"`
	Code        string                `json:"code"`
	History     []models.HistoryEntry `json:"history"`
}

type EnrichedSubmission struct {
	ID            string    `json:"id"`
	Username      string    `json:"username"`
	ChallengeID   int       `json:"challenge_id"`
	ChallengeName string    `json:"challenge_name"`
	Language      string    `json:"language"`
	Status        string    `json:"status"`
	Score         int       `json:"score"`
	SubmittedAt   time.Time `json:"submitted_at"`
}

type SubmissionMetrics struct {
	TotalSubmissions int     `json:"total_submissions"`
	Accepted         int     `json:"accepted"`
	Rejected         int     `json:"rejected"`
	Pending          int     `json:"pending"`
	Errors           int     `json:"errors"`
	AverageScore     float64 `json:"average_score"`
}

type SubmissionsAuditResponse struct {
	Submissions []EnrichedSubmission `json:"submissions"`
	Metrics     SubmissionMetrics    `json:"metrics"`
}

// SubmitCode handles code submission
func SubmitCode(c *gin.Context) {
	userIDValue, _ := c.Get("user_id")
	userID := userIDValue.(string)
	usernameValue, _ := c.Get("username")
	username := usernameValue.(string)

	var req SubmitRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_PAYLOAD"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 30*time.Second)
	defer cancel()

	challengesCollection := database.GetCollection("challenges")
	var challenge models.Challenge
	err := challengesCollection.FindOne(ctx, bson.M{"id": req.ChallengeID}).Decode(&challenge)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "CHALLENGE_NOT_FOUND"})
		return
	}

	// Grade the submission
	result := services.ExecuteSubmissionAgainstChallenge(req.Language, req.Code, challenge, 5*time.Second)

	score := 0
	if result.TotalTests > 0 {
		score = (result.PassedTests * 100) / result.TotalTests
	}

	submission := models.SubmissionRecord{
		UserID:        userID,
		Username:      username,
		ChallengeID:   req.ChallengeID,
		Language:      req.Language,
		Code:          req.Code,
		Score:         score,
		Status:        result.Status,
		PassedTests:   result.PassedTests,
		TotalTests:    result.TotalTests,
		Output:        result.Output,
		History:       req.History,
		ExecutionTime: result.ExecutionTime,
		CreatedAt:     time.Now().UTC(),
	}

	submissionsCollection := database.GetCollection("submissions")
	_, err = submissionsCollection.InsertOne(ctx, submission)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "SUBMISSION_SAVE_FAILED"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":        result.Status,
		"output":        result.Output,
		"passedTests":   result.PassedTests,
		"totalTests":    result.TotalTests,
		"executionTime": result.ExecutionTime,
		"score":         score,
	})
}

// GetSubmissionsAudit returns submissions for admin review
func GetSubmissionsAudit(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	submissionsCollection := database.GetCollection("submissions")
	challengesCollection := database.GetCollection("challenges")

	var submissions []models.SubmissionRecord
	cursor, err := submissionsCollection.Find(ctx, bson.M{}, options.Find().SetSort(bson.M{"created_at": -1}).SetLimit(200))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "FETCH_SUBMISSIONS_FAILED"})
		return
	}
	defer cursor.Close(ctx)
	_ = cursor.All(ctx, &submissions)

	var challenges []models.Challenge
	challengeCursor, _ := challengesCollection.Find(ctx, bson.M{})
	if challengeCursor != nil {
		defer challengeCursor.Close(ctx)
		_ = challengeCursor.All(ctx, &challenges)
	}

	challengeMap := make(map[int]string)
	for _, ch := range challenges {
		challengeMap[ch.ID] = ch.Title
	}

	enrichedSubmissions := []EnrichedSubmission{}
	metrics := SubmissionMetrics{
		TotalSubmissions: len(submissions),
	}
	var totalScore int

	for _, sub := range submissions {
		enrichedSub := EnrichedSubmission{
			ID:            sub.UserID + "_" + strconv.Itoa(sub.ChallengeID),
			Username:      sub.Username,
			ChallengeID:   sub.ChallengeID,
			ChallengeName: challengeMap[sub.ChallengeID],
			Language:      sub.Language,
			Status:        sub.Status,
			Score:         sub.Score,
			SubmittedAt:   sub.CreatedAt,
		}
		enrichedSubmissions = append(enrichedSubmissions, enrichedSub)

		switch sub.Status {
		case "accepted":
			metrics.Accepted++
		case "rejected":
			metrics.Rejected++
		case "pending":
			metrics.Pending++
		case "runtime_error", "compilation_error":
			metrics.Errors++
		}
		totalScore += sub.Score
	}

	if metrics.TotalSubmissions > 0 {
		metrics.AverageScore = float64(totalScore) / float64(metrics.TotalSubmissions)
	}

	c.JSON(http.StatusOK, SubmissionsAuditResponse{
		Submissions: enrichedSubmissions,
		Metrics:     metrics,
	})
}
